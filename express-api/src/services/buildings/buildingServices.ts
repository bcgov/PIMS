import { Building } from '@/typeorm/Entities/Building';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { DeepPartial, FindOptionsOrder } from 'typeorm';
import { BuildingFilter } from '@/services/buildings/buildingSchema';

const buildingRepo = AppDataSource.getRepository(Building);

/**
 * @description          Adds a new building to the datasource.
 * @param   building     Incoming building data to be added to the database.
 * @returns {Response}   A 201 status and the building data added.
 * @throws ErrorWithCode If the building already exists or is unable to be added.
 */
export const addBuilding = async (building: Building) => {
  const existingBuilding = await getBuildingById(building.Id);
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
  try {
    const findBuilding = await buildingRepo.findOne({
      where: { Id: buildingId },
    });
    return findBuilding;
  } catch (e) {
    throw new ErrorWithCode(e.message, e.status);
  }
};

/**
 * @description Update a building with matching Id
 * @param       buildingId  - Number representing building we want to update.
 * @returns     findBuilding - Building data matching Id passed in.
 */
export const updateBuildingById = async (building: Building) => {
  const existingBuilding = await getBuildingById(building.Id);
  if (!existingBuilding) {
    throw new ErrorWithCode('Building does not exists.', 404);
  }
  const retBuilding = await buildingRepo.update(building.Id, building);
  return retBuilding;
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
      Agency: includeRelations,
      AdministrativeArea: includeRelations,
      Classification: includeRelations,
      PropertyType: includeRelations,
      BuildingConstructionType: includeRelations,
      BuildingPredominateUse: includeRelations,
      BuildingOccupantType: includeRelations,
    },
    where: {
      PID: filter.pid,
      ClassificationId: filter.classificationId,
      AgencyId: filter.agencyId,
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

/**
 * @description Finds and updates building based on the Building Id
 * @param incomingBuilding incoming building information to be updated
 * @returns updated building information and status
 * @throws Error with code if building is not found or if an unexpected error is hit on update
 */
export const updateBuilding = async (incomingBuilding: DeepPartial<Building>) => {
  const findBuilding = await getBuildingById(incomingBuilding.Id);
  if (findBuilding == null) {
    throw new ErrorWithCode('Building not found', 404);
  }
  try {
    await buildingRepo.update({ Id: findBuilding.Id }, incomingBuilding);
    // update function doesn't return data on the row changed. Have to get the changed row again
    const newBuilding = await getBuildingById(incomingBuilding.Id);
    return newBuilding;
  } catch (e) {
    throw new ErrorWithCode(e.message);
  }
};
