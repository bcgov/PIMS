import { Building } from '@/typeorm/Entities/Building';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { DeepPartial, FindOptionsOrder, In } from 'typeorm';
import { BuildingFilter } from '@/services/buildings/buildingSchema';

const buildingRepo = AppDataSource.getRepository(Building);

/**
 * @description          Adds a new building to the datasource.
 * @param   building     Incoming building data to be added to the database.
 * @returns {Response}   New Building added.
 * @throws ErrorWithCode If the building already exists or is unable to be added.
 */
export const addBuilding = async (building: DeepPartial<Building>) => {
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
  const findBuilding = await buildingRepo.findOne({
    relations: {
      Agency: {
        Parent: true,
      },
      AdministrativeArea: {
        RegionalDistrict: true,
      },
      Classification: true,
      PropertyType: true,
      BuildingConstructionType: true,
      BuildingPredominateUse: true,
      BuildingOccupantType: true,
      Evaluations: true,
      Fiscals: true,
    },
    where: { Id: buildingId },
  });
  return findBuilding;
};

/**
 * @description Update a building with matching Id
 * @param       buildingId  - Number representing building we want to update.
 * @returns     findBuilding - Building data matching Id passed in.
 */
export const updateBuildingById = async (building: DeepPartial<Building>) => {
  const existingBuilding = await getBuildingById(building.Id);
  if (!existingBuilding) {
    throw new ErrorWithCode('Building does not exists.', 404);
  }
  // Rebuild metadata to avoid overwriting the whole field.
  if (existingBuilding.LeasedLandMetadata) {
    building.LeasedLandMetadata = {
      ...existingBuilding.LeasedLandMetadata,
      ...building.LeasedLandMetadata,
    };
  }
  await buildingRepo.save(building);
  //update function doesn't return data on the row changed. Have to get the changed row again
  const newBuilding = await getBuildingById(building.Id);
  return newBuilding;
};

/**
 * @description Delete a building with matching Id
 * @param       buildingId  - Number representing building we want to delete.
 * @returns     findBuilding - Building data matching Id passed in.
 */
export const deleteBuildingById = async (buildingId: number) => {
  const existingBuilding = await getBuildingById(buildingId);
  if (!existingBuilding) {
    throw new ErrorWithCode('Building does not exists.', 404);
  }
  const removeBuilding = await buildingRepo.delete(existingBuilding.Id);
  return removeBuilding;
};

/**
 * @description Retrieves buildings based on the provided filter.
 * @param filter - The filter object used to specify the criteria for retrieving buildings.
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

export const getBuildingsForExcelExport = async (
  filter: BuildingFilter,
  includeRelations: boolean = false,
) => {
  const buildings = await buildingRepo.find({
    relations: {
      Agency: {
        Parent: includeRelations,
      },
      AdministrativeArea: includeRelations,
      Classification: includeRelations,
      PropertyType: includeRelations,
      BuildingConstructionType: includeRelations,
      BuildingPredominateUse: includeRelations,
      BuildingOccupantType: includeRelations,
      Evaluations: includeRelations,
      Fiscals: includeRelations,
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
      BuildingConstructionType: {
        Id: true,
        Name: true,
      },
      BuildingOccupantType: {
        Id: true,
        Name: true,
      },
      BuildingPredominateUse: {
        Id: true,
        Name: true,
      },
      Evaluations: {
        Year: true,
        Value: true,
      },
      Fiscals: {
        FiscalYear: true,
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
