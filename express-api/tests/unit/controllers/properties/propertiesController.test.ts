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
  getLinkedProjects,
} from '@/controllers/properties/propertiesController';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import xlsx, { WorkBook } from 'xlsx';

const { getPropertiesFuzzySearch, getPropertiesForMap } = controllers;

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

const _findLinkedProjectsForProperty = jest.fn().mockImplementation(async () => {
  return [{ id: 1, name: 'Linked Project 1', buildingId: 1 }];
});

jest.spyOn(xlsx, 'readFile').mockImplementation(() => {
  const wb: WorkBook = {
    Sheets: {},
    SheetNames: [],
  };
  return wb;
});

jest
  .spyOn(AppDataSource.getRepository(ImportResult), 'save')
  .mockImplementation(async () => produceImportResult());

jest.mock('@/services/properties/propertiesServices', () => ({
  propertiesFuzzySearch: () => _propertiesFuzzySearch(),
  getPropertiesForMap: () => _getPropertiesForMap(),
  getPropertiesUnion: () => _getPropertyUnion(),
  getImportResults: () => _getImportResults(),
  findLinkedProjectsForProperty: () => _findLinkedProjectsForProperty(),
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

  describe('GET /properties/search/fuzzy', () => {
    it('should return 200 with a list of properties', async () => {
      mockRequest.query.keyword = '123';
      mockRequest.query.take = '3';
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getPropertiesFuzzySearch(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue.Parcels)).toBe(true);
      expect(Array.isArray(mockResponse.sendValue.Buildings)).toBe(true);
    });
    it('should return 200 with a list of properties', async () => {
      mockRequest.query.keyword = '123';
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getPropertiesFuzzySearch(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue.Parcels)).toBe(true);
      expect(Array.isArray(mockResponse.sendValue.Buildings)).toBe(true);
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
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getPropertiesForMap(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.length).toBeGreaterThanOrEqual(1);
      expect(_checkUserAgencyPermission).toHaveBeenCalledTimes(0);
    });

    it('should return 200 with a list of properties when filtered by the array fields', async () => {
      mockRequest.setUser({ client_roles: [Roles.AUDITOR] });
      mockRequest.setPimsUser({ RoleId: Roles.AUDITOR });
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
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
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
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getPropertiesForMap(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/', () => {
    it('should return status 200', async () => {
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getPropertyUnion(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });

    it('should return status 400 if the filter fails', async () => {
      mockRequest.query = {
        page: 'bad query',
      };
      await getPropertyUnion(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /properties/import', () => {
    it('should return status 200', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockRequest.file = { path: '/a/b', filename: 'aaa' } as any;
      mockRequest.user = produceSSO();
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await importProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /properties/import/results', () => {
    it('should return status 200', async () => {
      mockRequest.query = { quantity: '1' };
      mockRequest.user = produceSSO();
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getImportResults(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 400', async () => {
      mockRequest.query = { quantity: [{}] };
      mockRequest.user = produceSSO();
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getImportResults(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /properties/search/linkedProjects', () => {
    it('should return 200 with linked projects for a building ID', async () => {
      mockRequest.query.buildingId = '1';
      await getLinkedProjects(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue).toEqual([{ id: 1, name: 'Linked Project 1', buildingId: 1 }]);
    });
  });
});
