import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceAdminArea,
  produceAgency,
  produceClassification,
  produceConstructionType,
  produceMonetaryType,
  produceNoteType,
  producePredominateUse,
  produceProjectStatus,
  producePropertyType,
  produceRegionalDistrict,
  produceRisk,
  produceRole,
  produceTask,
  produceTierLevel,
  produceTimestampType,
} from '../../../testUtils/factories';
import { AppDataSource } from '@/appDataSource';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import {
  lookupBuildingConstructionType,
  lookupBuildingPredominateUse,
  lookupMonetaryTypes,
  lookupNoteTypes,
  lookupRegionalDistricts,
  lookupTasks,
  lookupTimestampTypes,
} from '@/controllers/lookup/lookupController';
import { RegionalDistrict } from '@/typeorm/Entities/RegionalDistrict';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { Task } from '@/typeorm/Entities/Task';
import { NoteType } from '@/typeorm/Entities/NoteType';
import { TimestampType } from '@/typeorm/Entities/TimestampType';
import { MonetaryType } from '@/typeorm/Entities/MonetaryType';
import { ProjectRisk } from '@/typeorm/Entities/ProjectRisk';
import { PropertyType } from '@/typeorm/Entities/PropertyType';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { Role } from '@/typeorm/Entities/Role';
import { Agency } from '@/typeorm/Entities/Agency';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';

const { lookupAll, lookupProjectTierLevels, lookupPropertyClassifications } = controllers;

const _next = jest.fn();
const _findClassification = jest.fn().mockImplementation(() => [produceClassification({})]);
const _findUses = jest.fn().mockImplementation(() => [producePredominateUse({})]);
const _findConstruction = jest.fn().mockImplementation(() => [produceConstructionType({})]);
const _findRegionalDistricts = jest.fn().mockImplementation(() => [produceRegionalDistrict({})]);
const _findTierLevel = jest.fn().mockImplementation(() => [produceTierLevel()]);
const _findTasks = jest.fn().mockImplementation(() => [produceTask()]);
const _findNoteTypes = jest.fn().mockImplementation(() => [produceNoteType()]);
const _findTimestampTypes = jest.fn().mockImplementation(() => [produceTimestampType()]);
const _findMonetaryTypes = jest.fn().mockImplementation(() => [produceMonetaryType()]);
const _findProjectRisks = jest.fn().mockImplementation(() => [produceRisk()]);
const _findPropertyTypes = jest.fn().mockImplementation(() => [producePropertyType()]);
const _findProjectStatuses = jest.fn().mockImplementation(() => [produceProjectStatus]);
const _findRoles = jest.fn().mockImplementation(() => [produceRole()]);
const _findAgencies = jest.fn().mockImplementation(() => [produceAgency()]);
const _findAdminAreas = jest.fn().mockImplementation(() => [produceAdminArea()]);

jest
  .spyOn(AppDataSource.getRepository(AdministrativeArea), 'find')
  .mockImplementation(async () => _findAdminAreas());
jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => _findAgencies());
jest.spyOn(AppDataSource.getRepository(Role), 'find').mockImplementation(async () => _findRoles());
jest
  .spyOn(AppDataSource.getRepository(ProjectStatus), 'find')
  .mockImplementation(async () => _findProjectStatuses());
jest
  .spyOn(AppDataSource.getRepository(PropertyType), 'find')
  .mockImplementation(async () => _findPropertyTypes());
jest
  .spyOn(AppDataSource.getRepository(ProjectRisk), 'find')
  .mockImplementation(async () => _findProjectRisks());
jest
  .spyOn(AppDataSource.getRepository(PropertyClassification), 'find')
  .mockImplementation(async () => _findClassification());
jest
  .spyOn(AppDataSource.getRepository(BuildingPredominateUse), 'find')
  .mockImplementation(async () => _findUses());
jest
  .spyOn(AppDataSource.getRepository(BuildingConstructionType), 'find')
  .mockImplementation(async () => _findConstruction());
jest
  .spyOn(AppDataSource.getRepository(RegionalDistrict), 'find')
  .mockImplementation(() => _findRegionalDistricts());

jest
  .spyOn(AppDataSource.getRepository(TierLevel), 'find')
  .mockImplementation(() => _findTierLevel());

jest.spyOn(AppDataSource.getRepository(Task), 'find').mockImplementation(() => _findTasks());

jest
  .spyOn(AppDataSource.getRepository(NoteType), 'find')
  .mockImplementation(() => _findNoteTypes());

jest
  .spyOn(AppDataSource.getRepository(TimestampType), 'find')
  .mockImplementation(() => _findTimestampTypes());

jest
  .spyOn(AppDataSource.getRepository(MonetaryType), 'find')
  .mockImplementation(() => _findMonetaryTypes());

describe('UNIT - Lookup Controller', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
    _next.mockClear();
  });

  describe('GET /lookup/property/classifications', () => {
    it('should return status 200 and a list of property classifications', async () => {
      await lookupPropertyClassifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 200 and a list of trimmed classifications', async () => {
      mockRequest.setUser({ client_roles: [] });
      await lookupPropertyClassifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.CreatedOn).toBeUndefined();
    });
    it('should return 400 on bad parse', async () => {
      _findClassification.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupPropertyClassifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when findClassification throws an error', async () => {
      _findClassification.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await lookupPropertyClassifications(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /lookup/regionalDistricts', () => {
    it('should return status 200 and a list of regionalDistricts', async () => {
      await lookupRegionalDistricts(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on bad parse', async () => {
      _findRegionalDistricts.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupRegionalDistricts(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /lookup/property/predominateUses', () => {
    it('should return status 200 and a list of property classifications', async () => {
      await lookupBuildingPredominateUse(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 200 and a list of trimmed classifications', async () => {
      mockRequest.setUser({ client_roles: [] });
      await lookupBuildingPredominateUse(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.CreatedOn).toBeUndefined();
    });
    it('should return 400 on bad parse', async () => {
      _findUses.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupBuildingPredominateUse(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when findUses throws an error', async () => {
      _findUses.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await lookupBuildingPredominateUse(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /lookup/property/constructionTypes', () => {
    it('should return status 200 and a list of property classifications', async () => {
      await lookupBuildingConstructionType(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 200 and a list of trimmed classifications', async () => {
      mockRequest.setUser({ client_roles: [] });
      await lookupBuildingConstructionType(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.CreatedOn).toBeUndefined();
    });
    it('should return 400 on bad parse', async () => {
      _findConstruction.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupBuildingConstructionType(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when findConstruction throws an error', async () => {
      _findConstruction.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await lookupBuildingConstructionType(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /lookup/project/tierLevels', () => {
    it('should return status 200 and a list of project tier levels', async () => {
      await lookupProjectTierLevels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 200 and a list of trimmed project tier levels', async () => {
      mockRequest.setUser({ client_roles: [] });
      await lookupProjectTierLevels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.CreatedOn).toBeUndefined();
    });
    it('should return 400 on bad parse', async () => {
      _findTierLevel.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupProjectTierLevels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when findTierLevel throws an error', async () => {
      _findTierLevel.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await lookupProjectTierLevels(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /lookup/tasks', () => {
    it('should return status 200 and a list of tasks', async () => {
      await lookupTasks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on bad parse', async () => {
      _findTasks.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupTasks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /lookup/noteTypes', () => {
    it('should return status 200 and a list of note types', async () => {
      await lookupNoteTypes(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on bad parse', async () => {
      _findNoteTypes.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupNoteTypes(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /lookup/timestampTypes', () => {
    it('should return status 200 and a list of note types', async () => {
      await lookupTimestampTypes(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on bad parse', async () => {
      _findTimestampTypes.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupTimestampTypes(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /lookup/monetaryTypes', () => {
    it('should return status 200 and a list of note types', async () => {
      await lookupMonetaryTypes(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on bad parse', async () => {
      _findMonetaryTypes.mockImplementationOnce(() => [{ Name: [] }]);
      await lookupMonetaryTypes(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /lookup/all', () => {
    it('should return status 200 and a list all lookup values', async () => {
      await lookupAll(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      // Check that something was returned
      expect(mockResponse.sendValue.AdministrativeAreas).toHaveLength(1);
      expect(mockResponse.sendValue.Roles).toHaveLength(1);
      expect(mockResponse.sendValue.Agencies).toHaveLength(1);
      expect(mockResponse.sendValue.Classifications).toHaveLength(1);
      expect(mockResponse.sendValue.Tasks).toHaveLength(1);
    });
  });
});
