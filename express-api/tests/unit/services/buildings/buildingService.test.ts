import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import { produceBuilding } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';
import * as buildingService from '@/services/buildings/buildingServices';
import { BuildingFilter, BuildingFilterSchema } from '@/services/buildings/buildingSchema';

const buildingRepo = AppDataSource.getRepository(Building);

const _buildingSave = jest
  .spyOn(buildingRepo, 'save')
  .mockImplementation(async (building: DeepPartial<Building> & Building) => building);

const _buildingDelete = jest
  .spyOn(buildingRepo, 'delete')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

const _buildingFindOne = jest
  .spyOn(buildingRepo, 'findOne')
  .mockImplementation(async () => produceBuilding());

// const _buildingUpdate = jest
//   .spyOn(buildingRepo, 'update')
//   .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

jest.spyOn(buildingRepo, 'find').mockImplementation(async () => [produceBuilding()]);

describe('UNIT - Building Services', () => {
  describe('addBuilding', () => {
    beforeEach(() => jest.clearAllMocks());
    it('should add a new building and return it', async () => {
      _buildingFindOne.mockResolvedValueOnce(null);
      const building = produceBuilding();
      const ret = await buildingService.addBuilding(building);
      expect(_buildingSave).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(building.Id);
    });
    it('should throw an error if the building already exists', () => {
      const building = produceBuilding();
      _buildingFindOne.mockResolvedValueOnce(building);
      expect(async () => await buildingService.addBuilding(building)).rejects.toThrow();
    });
  });
});
describe('deleteBuildingById', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should delete a building and return a 204 status code', async () => {
    const buildingToDelete = produceBuilding();
    _buildingFindOne.mockResolvedValueOnce(buildingToDelete);
    await buildingService.deleteBuildingById(buildingToDelete.Id);
    expect(_buildingDelete).toHaveBeenCalledTimes(1);
  });
});
describe('getBuildingById', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should get one building with the specified Id and return a 204 status code', async () => {
    const getbuilding = produceBuilding();
    _buildingFindOne.mockResolvedValueOnce(getbuilding);
    await buildingService.getBuildingById(getbuilding.Id);
    expect(_buildingFindOne).toHaveBeenCalledTimes(1);
  });
});
describe('getBuildings', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should return a list of buildings', async () => {
    const building = await buildingService.getBuildings({});
    expect(building).toHaveLength(1);
  });
  it('should use the agency filter to return a list of buildings', async () => {
    const filter: BuildingFilter = {
      agencyId: 1, // Assuming the agencyId you want to filter by
    };
    const building = await buildingService.getBuildings(filter);
    expect(building).toHaveLength(1);
  });
});

describe('updateBuildingById', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should update an existing building', async () => {
    const updateBuilding = produceBuilding();
    await buildingService.updateBuildingById(updateBuilding);
    expect(_buildingSave).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if the building is not found.', async () => {
    const updateBuilding = produceBuilding();
    _buildingFindOne.mockResolvedValueOnce(null);
    expect(async () => await buildingService.updateBuildingById(updateBuilding)).rejects.toThrow();
  });
});

describe('UNIT - BuildingFilterSchema', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should validate partial or complete filters', () => {
    // Empty filter
    expect(() => BuildingFilterSchema.parse({})).not.toThrow();
    // Partial filter
    expect(() =>
      BuildingFilterSchema.parse({
        buildingConstructionTypeId: 4,
      }),
    ).not.toThrow();
    // Filter with only page
    expect(() =>
      BuildingFilterSchema.parse({
        page: 2,
        quantity: 25,
      }),
    ).not.toThrow();
  });
  it('should throw an error when invalid filters are given', () => {
    expect(() =>
      BuildingFilterSchema.parse({
        buildingConstructionTypeId: 'hello',
      }),
    ).toThrow();
  });
});
