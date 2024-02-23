import { Building } from '@/typeorm/Entities/Building';
import { AppDataSource } from '@/appDataSource';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

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
  const newBuilding = buildingRepo.save(building);
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
export const deleteBuildingById = async (building: Building) => {
  const existingBuilding = await getBuildingById(building.Id);
  if (!existingBuilding) {
    throw new ErrorWithCode('Building does not exists.', 404);
  }
  const retBuilding = await buildingRepo.remove(building);
  return retBuilding;
};
