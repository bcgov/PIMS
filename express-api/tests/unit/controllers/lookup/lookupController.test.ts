import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';

const {
  lookupAgencies,
  lookupAll,
  lookupProjectRisks,
  lookupProjectTierLevels,
  lookupPropertyClassifications,
  lookupRoles,
} = controllers;

describe('UNIT - Lookup Controller', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
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
    it('should return the stub response of 501', async () => {
      await lookupPropertyClassifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a list of property classifications', async () => {
      await lookupPropertyClassifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
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
