import { Request, Response } from 'express';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceAdminArea,
  produceUser,
} from '../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { IAdministrativeArea } from '@/controllers/administrativeAreas/IAdministrativeArea';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import {
  getAdministrativeAreas,
  addAdministrativeArea,
  getAdministrativeAreasFiltered,
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
  deleteAdministrativeAreaById,
} from '@/controllers/administrativeAreas/administrativeAreasController';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const mockAdministrativeArea: IAdministrativeArea = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedById: faker.string.uuid() as UUID,
  createdById: faker.string.uuid() as UUID,
  id: faker.string.uuid() as UUID,
  name: faker.location.city(),
  isDisabled: false,
  isVisible: true,
  sortOrder: 0,
  abbreviation: '',
  boundaryType: '',
  regionalDistrict: 'CPRD',
};

const _getAdminAreas = jest.fn().mockImplementation(() => [produceAdminArea({})]);
const _getAdminAreaById = jest.fn().mockImplementation(() => produceAdminArea({}));
const _updateAdminAreaById = jest.fn().mockImplementation(() => produceAdminArea({}));
const _addAdminArea = jest.fn().mockImplementation(() => produceAdminArea({}));
const _next = jest.fn();
jest.mock('@/services/administrativeAreas/administrativeAreasServices', () => ({
  getAdministrativeAreas: () => _getAdminAreas(),
  getAdministrativeAreaById: () => _getAdminAreaById(),
  updateAdministrativeArea: () => _updateAdminAreaById(),
  addAdministrativeArea: () => _addAdminArea(),
}));

jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn().mockImplementation(() => produceUser()),
}));

describe('UNIT - Administrative Areas Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });
  describe('Controller getAdministrativeAreas', () => {
    // TODO: enable other tests when controller is complete
    it('should return status 200 and a list of administrative areas', async () => {
      await getAdministrativeAreas(mockRequest, mockResponse, _next);
      expect(mockResponse.statusValue).toBe(200);
    });
    // it('should return status 200 and a list of administrative areas, lacks metadata', async () => {
    //   mockRequest.setUser({ client_roles: [] });
    //   await getAdministrativeAreas(mockRequest, mockResponse, _next);
    //   expect(mockResponse.statusValue).toBe(200);
    //   expect(mockResponse.sendValue.CreatedOn).toBeUndefined();
    // });
    it('should return status 400 when parse fails', async () => {
      mockRequest.query = { name: ['a'] };
      await getAdministrativeAreas(mockRequest, mockResponse, _next);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return status 400 when parse fails', async () => {
      _getAdminAreas.mockImplementationOnce(() => {
        throw Error();
      });
      await getAdministrativeAreas(mockRequest, mockResponse, _next);
      expect(_next).toHaveBeenCalled();
    });
  });

  describe('Controller addAdministrativeArea', () => {
    it('should return status 201 and the new administrative area ', async () => {
      mockRequest.body = produceAdminArea({});
      await addAdministrativeArea(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Controller getAdministrativeAreasFiltered', () => {
    beforeEach(() => {
      mockRequest.body = {
        page: 0,
        quantity: 0,
        boundaryType: mockAdministrativeArea.boundaryType,
        name: mockAdministrativeArea.name,
        abbreviation: mockAdministrativeArea.abbreviation,
      };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAdministrativeAreasFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the administrative area ', async () => {
      await getAdministrativeAreasFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await getAdministrativeAreasFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('Controller getAdministrativeAreaById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockAdministrativeArea.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return 200', async () => {
      mockRequest.params.id = '1';
      await getAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller updateAdministrativeAreaById', () => {
    beforeEach(() => {
      mockRequest.body = { ...mockAdministrativeArea, name: 'new name' };
      mockRequest.params.id = `${mockAdministrativeArea.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return 200', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = produceAdminArea({ Id: 1 });
      await updateAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 400 on mismatched id', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = produceAdminArea({ Id: 2 });
      await updateAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('Controller deleteAdministrativeAreaById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockAdministrativeArea.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204', async () => {
      await deleteAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await deleteAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
