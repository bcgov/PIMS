import controllers from '@/controllers';
import { Request, Response } from 'express';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceAgency,
  produceBuilding,
  produceParcel,
  produceUser,
} from '../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';
import { Agency } from '@/typeorm/Entities/Agency';

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

jest.mock('@/services/properties/propertiesServices', () => ({
  propertiesFuzzySearch: () => _propertiesFuzzySearch(),
  getPropertiesForMap: () => _getPropertiesForMap(),
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
});
