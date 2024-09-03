import { Building } from '@/typeorm/Entities/Building';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { DeepPartial, FindOptionsOrder, In } from 'typeorm';
import { BuildingFilter } from '@/services/buildings/buildingSchema';
import userServices from '../users/usersServices';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import logger from '@/utilities/winstonLogger';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { isAdmin } from '@/utilities/authorizationChecks';

const buildingRepo = AppDataSource.getRepository(Building);

/**
 * @description          Adds a new building to the datasource.
 * @param   building     Incoming building data to be added to the database.
 * @returns {Response}   New Building added.
 * @throws {ErrorWithCode} If the building already exists or is unable to be added.
 */
export const addBuilding = async (building: DeepPartial<Building>) => {
  // TODO: Why would an incoming building have an id? Is there a better way to check for existing buildings?
  const existingBuilding = building.Id ? await getBuildingById(building.Id) : null;
  if (existingBuilding) {
    throw new ErrorWithCode('Building already exists.', 409);
  }
  const newBuilding = await buildingRepo.save(building);
  return newBuilding;
};

/**
 * @description Finds and returns a building with matching Id
 * @param       buildingId  - Number representing building we want to find.
 * @returns     findBuilding - Building data matching Id passed in.
 */
export const getBuildingById = async (buildingId: number) => {
  const evaluations = await AppDataSource.getRepository(BuildingEvaluation).find({
    where: { BuildingId: buildingId, EvaluationKeyId: 0 },
    order: { Year: 'DESC' },
  });
  const fiscals = await AppDataSource.getRepository(BuildingFiscal).find({
    where: { BuildingId: buildingId },
    order: { FiscalYear: 'DESC' },
  });
  const findBuilding = await buildingRepo.findOne({
    where: { Id: buildingId },
  });
  if (findBuilding) {
    return {
      ...findBuilding,
      Evaluations: evaluations,
      Fiscals: fiscals,
    };
  } else {
    return null;
  }
};

/**
 * @description Update a building with matching Id
 * @param       {DeepPartial<Building>} building  A partial building with updated info.
 * @returns     {Building} The updated building
 * @throws      {ErrorWithCode} Throws and error with 404 status if building does not exist.
 */
export const updateBuildingById = async (building: DeepPartial<Building>, ssoUser: SSOUser) => {
  const existingBuilding = await getBuildingById(building.Id);
  if (!existingBuilding) {
    throw new ErrorWithCode('Building does not exists.', 404);
  }
  const validUserAgencies = await userServices.getAgencies(ssoUser.preferred_username);
  if (!isAdmin(ssoUser) && !validUserAgencies.includes(building.AgencyId)) {
    throw new ErrorWithCode('This agency change is not permitted.', 403);
  }
  if (building.Fiscals && building.Fiscals.length) {
    building.Fiscals = await Promise.all(
      building.Fiscals.map(async (fiscal) => {
        const exists = await AppDataSource.getRepository(BuildingFiscal).findOne({
          where: {
            BuildingId: building.Id,
            FiscalYear: fiscal.FiscalYear,
            FiscalKeyId: fiscal.FiscalKeyId,
          },
        });
        const fiscalEntity: DeepPartial<BuildingFiscal> = {
          ...fiscal,
          CreatedById: exists ? exists.CreatedById : building.UpdatedById,
          UpdatedById: exists ? building.UpdatedById : undefined,
        };
        return fiscalEntity;
      }),
    );
  }
  if (building.Evaluations && building.Evaluations.length) {
    building.Evaluations = await Promise.all(
      building.Evaluations.map(async (evaluation) => {
        const exists = await AppDataSource.getRepository(BuildingEvaluation).findOne({
          where: {
            BuildingId: building.Id,
            Year: evaluation.Year,
            EvaluationKeyId: evaluation.EvaluationKeyId,
          },
        });
        const evaluationEntity: DeepPartial<BuildingEvaluation> = {
          ...evaluation,
          CreatedById: exists ? exists.CreatedById : building.UpdatedById,
          UpdatedById: exists ? building.UpdatedById : undefined,
        };
        return evaluationEntity;
      }),
    );
  }
  // Rebuild metadata to avoid overwriting the whole field.
  if (existingBuilding.LeasedLandMetadata) {
    building.LeasedLandMetadata = {
      ...existingBuilding.LeasedLandMetadata,
      ...building.LeasedLandMetadata,
    };
  }

  const updatedBuilding = await buildingRepo.save(building);
  return updatedBuilding;
};

/**
 * Deletes a building by its ID after checking for its existence and linked projects.
 * Throws an error if the building does not exist or is linked to projects.
 * Updates the building, its evaluations, and fiscals with deletion information in a transaction.
 * @param {number}  buildingId The ID of the building to delete.
 * @param {string}  username The username of the user performing the deletion.
 * @returns A promise that resolves to the removed building entity.
 * @throws Error if the building does not exist, is linked to projects, or an error occurs during the deletion process.
 */
export const deleteBuildingById = async (buildingId: number, username: string) => {
  const existingBuilding = await getBuildingById(buildingId);
  if (!existingBuilding) {
    throw new ErrorWithCode('Building does not exists.', 404);
  }
  const linkedProjects = await AppDataSource.getRepository(ProjectProperty).find({
    where: { BuildingId: buildingId },
  });
  if (linkedProjects.length) {
    throw new ErrorWithCode(
      `Building is involved in one or more projects with ID(s) ${linkedProjects.map((proj) => proj.ProjectId).join(', ')}`,
      403,
    );
  }
  const user = await userServices.getUser(username);
  const queryRunner = await AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const removeBuilding = await queryRunner.manager.update(Building, existingBuilding.Id, {
      DeletedById: user.Id,
      DeletedOn: new Date(),
    });
    await queryRunner.manager.update(
      BuildingEvaluation,
      { BuildingId: existingBuilding.Id },
      {
        DeletedById: user.Id,
        DeletedOn: new Date(),
      },
    );
    await queryRunner.manager.update(
      BuildingFiscal,
      { BuildingId: existingBuilding.Id },
      {
        DeletedById: user.Id,
        DeletedOn: new Date(),
      },
    );
    await queryRunner.commitTransaction();
    return removeBuilding;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    logger.warn(e.message);
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode(`Error updating building: ${e.message}`, 500);
  } finally {
    await queryRunner.release();
  }
};

/**
 * @description Retrieves buildings based on the provided filter.
 * @param {BuildingFilter} filter - The filter object used to specify the criteria for retrieving buildings.
 * @param {boolean} includeRelations Boolean that controls if related tables should be joined.
 * @returns {Building[]} An array of buildings that match the filter criteria.
 */
export const getBuildings = async (filter: BuildingFilter, includeRelations: boolean = false) => {
  const buildings = await buildingRepo.find({
    relations: {
      Agency: {
        Parent: includeRelations,
      },
      AdministrativeArea: includeRelations,
      Classification: includeRelations,
      PropertyType: includeRelations,
      Evaluations: includeRelations,
    },
    select: {
      Agency: {
        Id: true,
        Name: true,
        Parent: {
          Id: true,
          Name: true,
        },
      },
      AdministrativeArea: {
        Id: true,
        Name: true,
      },
      Classification: {
        Id: true,
        Name: true,
      },
      PropertyType: {
        Id: true,
        Name: true,
      },
      Evaluations: {
        EvaluationKeyId: true,
        Year: true,
        Value: true,
      },
    },
    where: {
      PID: filter.pid,
      ClassificationId: filter.classificationId,
      AgencyId: filter.agencyId
        ? In(typeof filter.agencyId === 'number' ? [filter.agencyId] : filter.agencyId)
        : undefined,
      AdministrativeAreaId: filter.administrativeAreaId,
      PropertyTypeId: filter.propertyTypeId,
      BuildingConstructionTypeId: filter.buildingConstructionTypeId,
      BuildingPredominateUseId: filter.buildingPredominateUseId,
      BuildingOccupantTypeId: filter.buildingOccupantTypeId,
      IsSensitive: filter.isSensitive,
    },
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    order: filter.sort as FindOptionsOrder<Building>,
  });
  return buildings;
};
