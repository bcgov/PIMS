import EventEmitter from 'events';
class MockWorker extends EventEmitter {
  postMessage: unknown;
  constructor() {
    super();
    this.on = jest.fn();
    this.postMessage = jest.fn((message) => {
      // Simulate worker processing
      process.nextTick(() => {
        this.emit('message', message + ' processed');
      });
    });
  }
}

jest.mock('worker_threads', () => ({
  Worker: MockWorker,
}));

import controllers from '@/controllers';
import { Request, Response } from 'express';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceAgency,
  produceBuilding,
  produceImportResult,
  produceParcel,
  producePropertyUnion,
  produceSSO,
  produceUser,
} from '../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';
import { Agency } from '@/typeorm/Entities/Agency';
import {
  getImportResults,
  getPropertyUnion,
  importProperties,
} from '@/controllers/properties/propertiesController';

const {
  getProperties,
  getPropertiesFuzzySearch,
  getPropertiesFilter,
  getPropertiesForMap,
  getPropertiesPaged,
  getPropertiesPagedFilter,
} = controllers;

const _propertiesFuzzySearch = jest
  .fn()
  .mockImplementation(() => ({ Parcels: [produceParcel()], Buildings: [produceBuilding()] }));

const _getPropertiesForMap = jest.fn().mockImplementation(async () => [
  {
    Id: 1,
    Location: {
      x: -122.873862825,
      y: 49.212751465,
    },
    PropertyTypeId: 0,
    ClassificationId: 3,
  },
]);

const _getPropertyUnion = jest.fn().mockImplementation(async () => [producePropertyUnion()]);

const _getImportResults = jest.fn().mockImplementation(async () => [produceImportResult()]);

jest.mock('@/services/properties/propertiesServices', () => ({
  propertiesFuzzySearch: () => _propertiesFuzzySearch(),
  getPropertiesForMap: () => _getPropertiesForMap(),
  getPropertiesUnion: () => _getPropertyUnion(),
  getImportResults: () => _getImportResults(),
}));

const _getAgencies = jest.fn().mockImplementation(async () => [1, 2, 3]);

jest.mock('@/services/users/usersServices', () => ({
  getAgencies: () => _getAgencies(),
  getUser: () => produceUser(),
}));

describe('UNIT - Properties', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /properties/search', () => {
    it('should return the stub response of 501', async () => {
      await getProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a list of properties', async () => {
      await getProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/search/fuzzy', () => {
    it('should return 200 with a list of properties', async () => {
      mockRequest.query.keyword = '123';
      mockRequest.query.take = '3';
      await getPropertiesFuzzySearch(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue.Parcels)).toBe(true);
      expect(Array.isArray(mockResponse.sendValue.Buildings)).toBe(true);
    });
    it('should return 200 with a list of properties', async () => {
      mockRequest.query.keyword = '123';
      await getPropertiesFuzzySearch(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue.Parcels)).toBe(true);
      expect(Array.isArray(mockResponse.sendValue.Buildings)).toBe(true);
    });
  });

  describe('POST /properties/search/filter', () => {
    it('should return the stub response of 501', async () => {
      await getPropertiesFilter(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a list of properties', async () => {
      mockRequest.body = {}; // Add filter parameters
      await getPropertiesFilter(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/search/geo', () => {
    const _checkUserAgencyPermission = jest.fn().mockImplementation(async () => true);
    jest.mock('@/utilities/authorizationChecks', () => ({
      checkUserAgencyPermission: _checkUserAgencyPermission,
    }));
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 with a list of properties', async () => {
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      await getPropertiesForMap(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.length).toBeGreaterThanOrEqual(1);
      expect(_checkUserAgencyPermission).toHaveBeenCalledTimes(0);
    });

    it('should return 200 with a list of properties when filtered by the array fields', async () => {
      mockRequest.setUser({ client_roles: [Roles.AUDITOR] });
      mockRequest.query = {
        AgencyIds: '12,13',
        ClassificationIds: '1,2',
        PropertyTypeIds: '1,2',
        AdministrativeAreaIds: '1,2',
      };
      await getPropertiesForMap(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.length).toBeGreaterThanOrEqual(1);
      expect(_checkUserAgencyPermission).toHaveBeenCalledTimes(0);
    });

    it('should return 400 if the query params do not pass the schema', async () => {
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockRequest.query = {
        AgencyIds: ['h'],
      };
      await getPropertiesForMap(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should follow the path to restrict filter agency if user is not an admin', async () => {
      jest
        .spyOn(AppDataSource.getRepository(User), 'findOneBy')
        .mockImplementation(async () => produceUser());
      jest
        .spyOn(AppDataSource.getRepository(User), 'findOneOrFail')
        .mockImplementation(async () => produceUser());
      jest
        .spyOn(AppDataSource.getRepository(Agency), 'find')
        .mockImplementation(async () => [produceAgency()]);
      await getPropertiesForMap(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/search/page', () => {
    it('should return the stub response of 501', async () => {
      await getPropertiesPaged(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a list of properties', async () => {
      await getPropertiesPaged(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('POST /properties/search/page/filter', () => {
    it('should return the stub response of 501', async () => {
      await getPropertiesPagedFilter(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a list of properties', async () => {
      mockRequest.body = {}; // Add filter parameters
      await getPropertiesPagedFilter(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/', () => {
    it('should return status 200', async () => {
      await getPropertyUnion(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });
  });

  describe('POST /properties/import', () => {
    it('should return status 200', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockRequest.file = { path: '/a/b', filename: 'aaa' } as any;
      mockRequest.user = produceSSO();
      await importProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /properties/import/results', () => {
    it('should return status 200', async () => {
      mockRequest.query = { quantity: '1' };
      mockRequest.user = produceSSO();
      await getImportResults(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 400', async () => {
      mockRequest.query = { quantity: [{}] };
      mockRequest.user = produceSSO();
      await getImportResults(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
