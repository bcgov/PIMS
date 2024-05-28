import { AppDataSource } from '@/appDataSource';
import { Building } from '@/typeorm/Entities/Building';
import {
  produceBuilding,
  produceBuildingEvaluation,
  produceBuildingFiscal,
  produceUser,
} from 'tests/testUtils/factories';
import * as buildingService from '@/services/buildings/buildingServices';
import { BuildingFilter, BuildingFilterSchema } from '@/services/buildings/buildingSchema';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { DeepPartial, UpdateResult } from 'typeorm';
import userServices from '@/services/users/usersServices';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';

const buildingRepo = AppDataSource.getRepository(Building);
jest.spyOn(userServices, 'getUser').mockImplementation(async () => produceUser());
const _buildingSave = jest
  .spyOn(buildingRepo, 'save')
  .mockImplementation(async (building: DeepPartial<Building> & Building) => building);

const _buildingFindOne = jest.spyOn(buildingRepo, 'findOne').mockImplementation(async () => {
  const building = produceBuilding();
  const { Id } = building;
  produceBuildingFiscal(Id);
  return building;
});

// const _buildingFiscalExists = jest
//   .spyOn(AppDataSource.getRepository(BuildingFiscal), 'exists')
//   .mockImplementation(async () => true);

// const _buildingEvaluationExists = jest
//   .spyOn(AppDataSource.getRepository(BuildingEvaluation), 'exists')
//   .mockImplementation(async () => true);
const _buildingFiscalFindOne = jest
  .spyOn(AppDataSource.getRepository(BuildingFiscal), 'findOne')
  .mockImplementation(async () => produceBuildingFiscal(1)[0]);
const _buildingEvaluationFindOne = jest
  .spyOn(AppDataSource.getRepository(BuildingEvaluation), 'findOne')
  .mockImplementation(async () => produceBuildingEvaluation(1)[0]);
// const _buildingFindOne = jest
//   .spyOn(buildingRepo, 'findOne')
//   .mockImplementation(async () => produceBuilding());
jest
  .spyOn(AppDataSource.getRepository(BuildingFiscal), 'find')
  .mockImplementation(async () => produceBuildingFiscal(1));
jest
  .spyOn(AppDataSource.getRepository(BuildingEvaluation), 'find')
  .mockImplementation(async () => produceBuildingEvaluation(1));

const _mockStartTransaction = jest.fn(async () => {});
const _mockRollbackTransaction = jest.fn(async () => {});
const _mockCommitTransaction = jest.fn(async () => {});
const _mockBuildinglUpdate = jest.fn(async (): Promise<UpdateResult> => {
  return {
    raw: {},
    generatedMaps: [],
  };
});
const _mockEntityManager = {
  update: () => _mockBuildinglUpdate(),
};

jest.spyOn(AppDataSource.getRepository(ProjectProperty), 'find').mockImplementation(async () => []);

jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
  ...jest.requireActual('@/appDataSource').createQueryRunner,
  startTransaction: _mockStartTransaction,
  rollbackTransaction: _mockRollbackTransaction,
  commitTransaction: _mockCommitTransaction,
  release: jest.fn(async () => {}),
  manager: _mockEntityManager,
});
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
    await buildingService.deleteBuildingById(buildingToDelete.Id, '');
    expect(_mockBuildinglUpdate).toHaveBeenCalledTimes(3);
  });
  it('should throw a 404 error when the building does not exist', async () => {
    const buildingToDelete = produceBuilding();
    _buildingFindOne.mockResolvedValueOnce(null);
    // Act & Assert
    await expect(buildingService.deleteBuildingById(buildingToDelete.Id, '')).rejects.toThrow();
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

describe('getBuildingsForExcelExport', () => {
  beforeEach(() => jest.clearAllMocks());
  it('should return a list of buildings', async () => {
    const building = await buildingService.getBuildingsForExcelExport({});
    expect(building).toHaveLength(1);
  });
  it('should use the agency filter to return a list of buildings', async () => {
    const filter: BuildingFilter = {
      agencyId: 1, // Assuming the agencyId you want to filter by
    };
    const building = await buildingService.getBuildingsForExcelExport(filter);
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

  it('should update Fiscals and Evaluations when they exist in the building object', async () => {
    const updateBuilding = produceBuilding();
    _buildingFindOne.mockResolvedValueOnce(updateBuilding);

    await buildingService.updateBuildingById(updateBuilding);
    expect(_buildingFiscalFindOne).toHaveBeenCalledTimes(1);
    expect(_buildingEvaluationFindOne).toHaveBeenCalledTimes(1);
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
