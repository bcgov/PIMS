import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { IRole } from '@/controllers/admin/roles/IRole';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const { addRole, getRoleById, getRoleByName, getRoles, deleteRoleById, updateRoleById } =
  controllers.admin;

const mockRole: IRole = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedByName: faker.person.firstName(),
  updatedByEmail: faker.internet.email(),
  id: faker.string.uuid() as UUID,
  name: faker.company.name(),
  isDisabled: false,
  description: '',
  type: '',
  sortOrder: 0,
  isVisible: true,
};

describe('UNIT - Roles Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getRoles', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of roles', async () => {
      await getRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller addRole', () => {
    beforeEach(() => {
      mockRequest.body = mockRole;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await addRole(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 201 and the new role', async () => {
      await addRole(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Controller getRoleById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockRole.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the role info', async () => {
      await getRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller getRoleByName', () => {
    beforeEach(() => {
      mockRequest.params.name = `${mockRole.name}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getRoleByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the role info', async () => {
      await getRoleByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller updateRoleById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockRole.id}`;
      mockRequest.body = { ...mockRole, name: 'new name' };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await updateRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the updated role', async () => {
      await updateRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller deleteRoleById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockRole.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204', async () => {
      await deleteRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });
  });
});
