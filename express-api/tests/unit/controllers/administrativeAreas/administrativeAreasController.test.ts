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
  getAdministrativeAreaById,
  updateAdministrativeAreaById,
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
      mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
      await getAdministrativeAreas(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 400 when parse fails', async () => {
      mockRequest.query = { name: ['a'] };
      await getAdministrativeAreas(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error if the service does', async () => {
      _getAdminAreas.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await getAdministrativeAreas(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('Controller addAdministrativeArea', () => {
    it('should return status 201 and the new administrative area ', async () => {
      mockRequest.body = produceAdminArea({});
      await addAdministrativeArea(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Controller getAdministrativeAreaById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockAdministrativeArea.id}`;
    });
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
});
