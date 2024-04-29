import controllers from '@/controllers';
import { Request, Response } from 'express';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceBuilding,
  produceUser,
} from '../../../testUtils/factories';
import { DeleteResult } from 'typeorm';
import { Roles } from '@/constants/roles';

const _getBuildingById = jest.fn().mockImplementation(() => produceBuilding());
const _getBuildings = jest.fn().mockImplementation(() => [produceBuilding()]);
const _addBuilding = jest.fn().mockImplementation(() => produceBuilding());
const _deleteBuilding = jest.fn().mockImplementation((): DeleteResult => ({ raw: {} }));
const _updateBuilding = jest.fn().mockImplementation(() => produceBuilding());

jest.mock('@/services/buildings/buildingServices', () => ({
  getBuildingById: () => _getBuildingById(),
  getBuildings: () => _getBuildings(),
  addBuilding: () => _addBuilding(),
  updateBuildingById: () => _updateBuilding(),
  deleteBuildingById: () => _deleteBuilding(),
}));

jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn().mockImplementation(() => produceUser()),
  getAgencies: jest.fn().mockResolvedValue([1, 2]),
}));

describe('UNIT - Buildings', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /properties/buildings/:buildingId', () => {
    it('should return 200 with a correct response body', async () => {
      const buildingWithAgencyId1 = {
        AgencyId: 1,
      };
      mockRequest.params.buildingId = '1';
      _getBuildingById.mockImplementationOnce(() => buildingWithAgencyId1);
      await controllers.getBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return 400 on bad id', async () => {
      mockRequest.params.buildingId = 'non-integer';
      await controllers.getBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should return 404 on resource not found', async () => {
      mockRequest.params.buildingId = '1';
      _getBuildingById.mockImplementationOnce(() => null);
      await controllers.getBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /properties/buildings/:buildingId', () => {
    it('should return 200 with a correct response body', async () => {
      mockRequest.params.buildingId = '1';
      mockRequest.body = { Id: 1, Name: 'a' };
      await controllers.updateBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return 400 on bad id', async () => {
      mockRequest.params.buildingId = 'non-integer';
      await controllers.updateBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('DELETE /properties/buildings/:id', () => {
    it('should return 200 with a correct response body', async () => {
      mockRequest.params.buildingId = '1';
      await controllers.deleteBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return 400 on bad id', async () => {
      mockRequest.params.buildingId = 'non-integer';
      await controllers.deleteBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /properties/buildings', () => {
    it('should return 200 and a list of buildings', async () => {
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on bad filter', async () => {
      mockRequest.query.pid = [{ a: 'a' }];
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return 200 with an admin user', async () => {
      // Mock an admin user
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBeTruthy();
    });
  });

  describe('POST /properties/buildings', () => {
    it('should return 201 with a correct response body', async () => {
      mockRequest.body = produceBuilding();
      delete mockRequest.body.Id;
      await controllers.addBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });
});
