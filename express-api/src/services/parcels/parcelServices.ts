import { Parcel } from '@/typeorm/Entities/Parcel';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { ParcelFilter } from '@/services/parcels/parcelSchema';
import { DeepPartial, FindOptionsOrder, In } from 'typeorm';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import userServices from '../users/usersServices';
import logger from '@/utilities/winstonLogger';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';

const parcelRepo = AppDataSource.getRepository(Parcel);

/**
 * @description          Adds a new parcel to the datasource.
 * @param   parcel       Incoming parcel data to be added to the database
 * @returns {Parcel}     The new Parcel added.
 * @throws ErrorWithCode If the parcel already exists or is unable to be added.
 */
const addParcel = async (parcel: DeepPartial<Parcel>) => {
  const numberPID = Number(parcel.PID);

  const stringPID = numberPID.toString();
  if (parcel.PID != null && (stringPID.length > 9 || isNaN(numberPID))) {
    throw new ErrorWithCode('PID must be a number and in the format #########');
  }

  const existingParcel = parcel.PID != null ? await getParcelByPid(numberPID) : undefined;

  if (existingParcel) {
    throw new ErrorWithCode('Parcel already exists.', 409);
  }
  const newParcel = await parcelRepo.save(parcel);
  return newParcel;
};

/**
 * @description Remove a parcel from the database based on incoming internal ID
 * @param parcelId Incoming ID of parcel to be removed
 * @returns object with data on number of rows affected.
 * @throws ErrorWithCode if no parcels have the ID sent in
 */
const deleteParcelById = async (parcelId: number, username: string) => {
  const existingParcel = await getParcelById(parcelId);
  if (!existingParcel) {
    throw new ErrorWithCode('Parcel PID was not found.', 404);
  }
  const linkedProjects = await AppDataSource.getRepository(ProjectProperty).find({
    where: { ParcelId: parcelId },
  });
  if (linkedProjects.length) {
    throw new ErrorWithCode(
      `Parcel is involved in one or more projects with ID(s) ${linkedProjects.map((proj) => proj.ProjectId).join(', ')}`,
      403,
    );
  }
  const user = await userServices.getUser(username);
  const queryRunner = await AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const removeParcel = await queryRunner.manager.update(Parcel, existingParcel.Id, {
      DeletedById: user.Id,
      DeletedOn: new Date(),
    });
    await queryRunner.manager.update(
      ParcelEvaluation,
      { ParcelId: existingParcel.Id },
      {
        DeletedById: user.Id,
        DeletedOn: new Date(),
      },
    );
    await queryRunner.manager.update(
      ParcelFiscal,
      { ParcelId: existingParcel.Id },
      {
        DeletedById: user.Id,
        DeletedOn: new Date(),
      },
    );
    await queryRunner.commitTransaction();
    return removeParcel;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    logger.warn(e.message);
    if (e instanceof ErrorWithCode) throw e;
    throw new ErrorWithCode(`Error updating project: ${e.message}`, 500);
  } finally {
    await queryRunner.release();
  }
};

/**
 * @description Retrieves parcels based on the provided filter.
 * @param filter - The filter object used to specify the criteria for retrieving parcels.
 * @returns {Parcel[]} An array of parcels that match the filter criteria.
 */
const getParcels = async (filter: ParcelFilter, includeRelations: boolean = false) => {
  const parcels = await parcelRepo.find({
    relations: {
      ParentParcel: includeRelations,
      Agency: includeRelations,
      AdministrativeArea: includeRelations,
      Classification: includeRelations,
      PropertyType: includeRelations,
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
      ParentParcel: {
        Id: true,
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
      IsSensitive: filter.isSensitive,
    },
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    order: filter.sort as FindOptionsOrder<Parcel>,
  });
  return parcels;
};

/**
 * @description Finds and updates parcel based on the incoming PID
 * @param incomingParcel incoming parcel information to be updated
 * @returns updated parcel information and status
 * @throws Error with code if parcel is not found or if an unexpected error is hit on update
 */
const updateParcel = async (incomingParcel: DeepPartial<Parcel>) => {
  if (incomingParcel.PID == null && incomingParcel.PIN == null) {
    throw new ErrorWithCode('Must include PID or PIN in parcel data.', 400);
  }
  const findParcel = await getParcelById(incomingParcel.Id);
  if (findParcel == null || findParcel.Id !== incomingParcel.Id) {
    throw new ErrorWithCode('Parcel not found', 404);
  }
  if (incomingParcel.Fiscals && incomingParcel.Fiscals.length) {
    incomingParcel.Fiscals = await Promise.all(
      incomingParcel.Fiscals.map(async (fiscal) => {
        const exists = await AppDataSource.getRepository(ParcelFiscal).findOne({
          where: {
            ParcelId: incomingParcel.Id,
            FiscalYear: fiscal.FiscalYear,
            FiscalKeyId: fiscal.FiscalKeyId,
          },
        });
        const fiscalEntity: DeepPartial<ParcelFiscal> = {
          ...fiscal,
          CreatedById: exists ? exists.CreatedById : incomingParcel.UpdatedById,
          UpdatedById: exists ? incomingParcel.UpdatedById : undefined,
        };
        return fiscalEntity;
      }),
    );
  }
  if (incomingParcel.Evaluations && incomingParcel.Evaluations.length) {
    incomingParcel.Evaluations = await Promise.all(
      incomingParcel.Evaluations.map(async (evaluation) => {
        const exists = await AppDataSource.getRepository(ParcelEvaluation).findOne({
          where: {
            ParcelId: incomingParcel.Id,
            Year: evaluation.Year,
            EvaluationKeyId: evaluation.EvaluationKeyId,
          },
        });
        const fiscalEntity: DeepPartial<ParcelFiscal> = {
          ...evaluation,
          CreatedById: exists ? exists.CreatedById : incomingParcel.UpdatedById,
          UpdatedById: exists ? incomingParcel.UpdatedById : undefined,
        };
        return fiscalEntity;
      }),
    );
  }

  return parcelRepo.save(incomingParcel);
};

/**
 * @description Finds and returns a parcel with matching PID
 * @param       parcelPID The PID of the parcel.
 * @returns     findParcel Parcel data matching PID passed in.
 */
const getParcelByPid = async (parcelPid: number) => {
  return await parcelRepo.findOne({
    where: { PID: parcelPid },
  });
};

/**
 * @description Finds and returns a parcel with matching internal ID
 * @param       parcelId The primary generated ID of the parcel.
 * @returns     findParcel Parcel data matching ID passed in.
 */
const getParcelById = async (parcelId: number) => {
  const evaluations = await AppDataSource.getRepository(ParcelEvaluation).find({
    where: { ParcelId: parcelId, EvaluationKeyId: 0 },
  });
  const fiscals = await AppDataSource.getRepository(ParcelFiscal).find({
    where: { ParcelId: parcelId },
  });
  const parcel = await parcelRepo.findOne({
    where: { Id: parcelId },
  });
  if (parcel) {
    return {
      ...parcel,
      Evaluations: evaluations,
      Fiscals: fiscals,
    };
  } else {
    return null;
  }
};

const parcelServices = {
  getParcelById,
  getParcelByPid,
  getParcels,
  updateParcel,
  deleteParcelById,
  addParcel,
};

export default parcelServices;
