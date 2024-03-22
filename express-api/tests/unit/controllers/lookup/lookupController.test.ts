import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceClassification,
  produceConstructionType,
  producePredominateUse,
} from '../../../testUtils/factories';
import { AppDataSource } from '@/appDataSource';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { BuildingConstructionType } from '@/typeorm/Entities/BuildingConstructionType';
import {
  lookupBuildingConstructionType,
  lookupBuildingPredominateUse,
} from '@/controllers/lookup/lookupController';

const {
  lookupAgencies,
  lookupAll,
  lookupProjectRisks,
  lookupProjectTierLevels,
  lookupPropertyClassifications,
  lookupRoles,
} = controllers;

const _next = jest.fn();
const _findClassification = jest.fn().mockImplementation(() => [produceClassification({})]);
const _findUses = jest.fn().mockImplementation(() => [producePredominateUse({})]);
const _findConstruction = jest.fn().mockImplementation(() => [produceConstructionType({})]);
jest
  .spyOn(AppDataSource.getRepository(PropertyClassification), 'find')
  .mockImplementation(async () => _findClassification());
jest
  .spyOn(AppDataSource.getRepository(BuildingPredominateUse), 'find')
  .mockImplementation(async () => _findUses());
jest
  .spyOn(AppDataSource.getRepository(BuildingConstructionType), 'find')
  .mockImplementation(async () => _findConstruction());

describe('UNIT - Lookup Controller', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
    _next.mockClear();
  });

  describe('GET /lookup/agencies', () => {
    it('should return the stub response of 501', async () => {
      await lookupAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a list of agencies', async () => {
      await lookupAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /lookup/roles', () => {
    it('should return the stub response of 501', async () => {
      await lookupRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a list of roles', async () => {
      await lookupRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
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

  describe('GET /lookup/project/tier/levels', () => {
    it('should return the stub response of 501', async () => {
      await lookupProjectTierLevels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a list of project tier levels', async () => {
      await lookupProjectTierLevels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /lookup/project/risks', () => {
    it('should return the stub response of 501', async () => {
      await lookupProjectRisks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a list of project risks', async () => {
      await lookupProjectRisks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /lookup/all', () => {
    it('should return the stub response of 501', async () => {
      await lookupAll(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a list all lookup values', async () => {
      await lookupAll(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });
});
