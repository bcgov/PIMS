import controllers from '@/controllers';
import { Request, Response } from 'express';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceParcel,
  produceProjectProperty,
  produceUser,
} from '../../../testUtils/factories';
import { DeleteResult } from 'typeorm';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { Roles } from '@/constants/roles';
import { AppDataSource } from '@/appDataSource';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';

const _getParcelById = jest.fn().mockImplementation(() => produceParcel());
const _updateParcel = jest.fn().mockImplementation(() => produceParcel());
const _deleteParcel = jest.fn().mockImplementation((): DeleteResult => ({ raw: {} }));
const _addParcel = jest.fn().mockImplementation(() => produceParcel());
const _getParcels = jest.fn().mockImplementation(() => [produceParcel()]);
const _getParcelsForExcelExport = jest.fn().mockImplementation(() => [produceParcel()]);
const _hasAgencies = jest.fn();
jest.mock('@/services/parcels/parcelServices', () => ({
  getParcelById: () => _getParcelById(),
  updateParcel: () => _updateParcel(),
  deleteParcelById: () => _deleteParcel(),
  getParcels: () => _getParcels(),
  addParcel: () => _addParcel(),
  getParcelsForExcelExport: () => _getParcelsForExcelExport(),
}));
jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn().mockImplementation(() => produceUser()),
  getAgencies: jest.fn().mockResolvedValue([1, 2]),
  hasAgencies: jest.fn(() => _hasAgencies()),
}));
jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'find')
  .mockImplementation(async () => [produceProjectProperty(undefined, true)]);
describe('UNIT - Parcels', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /properties/parcels/:parcelId', () => {
    it('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      // _hasAgencies.mockImplementationOnce(() => true);
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return 400 when ID is incorrect', async () => {
      mockRequest.params.parcelId = 'non-integer';
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should return 404 when resource not found', async () => {
      _getParcelById.mockImplementationOnce(() => null);
      mockRequest.params.parcelId = '1';
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });

    it('should throw an error when getParcelById throws an error due to mis-matched id', async () => {
      _getParcelById.mockImplementationOnce(() => {
        throw new Error();
      });
      mockRequest.params.parcelId = '1';
      expect(async () => await controllers.getParcel(mockRequest, mockResponse)).rejects.toThrow();
    });
    it('should return with status 403 when user doenst have permission to view parcel', async () => {
      mockRequest.params.parcelId = '1';
      mockRequest.setUser({ client_roles: [Roles.GENERAL_USER], hasRoles: () => false });
      _hasAgencies.mockImplementationOnce(() => false);
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(403);
    });
  });

  describe('PUT /properties/parcels/:id', () => {
    it('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      mockRequest.body = produceParcel();
      mockRequest.body.Id = 1;
      await controllers.updateParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return 404 when resource is not found', async () => {
      _updateParcel.mockImplementationOnce(() => null);
      mockRequest.params.parcelId = '1';
      mockRequest.body.Id = 1;
      await controllers.updateParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });

    it('should return 400 if parcel is ID mistmatch', async () => {
      mockRequest.params.parcelId = '1';
      mockRequest.body = produceParcel();
      mockRequest.body.Id = 2;
      await controllers.updateParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should throw an error when updateParcel service throws an error', async () => {
      _updateParcel.mockImplementationOnce(() => {
        throw new Error();
      });
      mockRequest.params.parcelId = '1';
      mockRequest.body = produceParcel();
      mockRequest.body.Id = 1;
      expect(
        async () => await controllers.updateParcel(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('DELETE /properties/parcels/:id', () => {
    it('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      await controllers.deleteParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 400 on incorrect parcelId', async () => {
      mockRequest.params.parcelId = 'non-integer';
      await controllers.deleteParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when deleteParcel throws an error due to mis-matched id', async () => {
      mockRequest.params.parcelId = '1';
      _deleteParcel.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await controllers.deleteParcel(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
    it('should throw an error when deleteParcel throws an error due to missing record', async () => {
      _deleteParcel.mockImplementationOnce(() => {
        throw new ErrorWithCode('', 404);
      });
      mockRequest.params.parcelId = '1';
      expect(
        async () => await controllers.deleteParcel(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /properties/parcels', () => {
    it('should return 200 with an admin user', async () => {
      // Mock an admin user
      const { mockReq, mockRes } = getRequestHandlerMocks();
      mockRequest = mockReq;
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockResponse = mockRes;
      await controllers.getParcels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBeTruthy();
    });
    it('should return 200 with a correct response body', async () => {
      mockRequest.query.pid = '1';
      await controllers.getParcels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBeTruthy();
    });
    it('should return 400 on incorrect filter', async () => {
      mockRequest.query.isSensitive = {};
      await controllers.getParcels(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return 400 on parcel id that is a string', async () => {
      mockRequest.params.parcelId = 'invalidParcelId';
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when getParcels service throws an error', async () => {
      mockRequest.query.pid = '1';
      _getParcels.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await controllers.getParcels(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('POST /properties/parcels', () => {
    it('should return 201 with a correct response body', async () => {
      mockRequest.body = produceParcel();
      await controllers.addParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
    it('should throw an error when addParcel service throws an error', async () => {
      _addParcel.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await controllers.addParcel(mockRequest, mockResponse)).rejects.toThrow();
    });
  });
});
