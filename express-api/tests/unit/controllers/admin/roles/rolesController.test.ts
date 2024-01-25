import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceRole,
} from '../../../../testUtils/factories';
import { Roles as RolesEntity } from '@/typeorm/Entities/Roles';
import { Roles as RolesConstant } from '@/constants/roles';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const { addRole, getRoleById, getRoles, deleteRoleById, updateRoleById } = controllers.admin;

const _getRoles = jest.fn().mockImplementation(() => [produceRole()]);
const _addRole = jest.fn().mockImplementation((role) => role);
const _updateRole = jest.fn().mockImplementation((role) => role);
const _deleteRole = jest.fn().mockImplementation((role) => role);

jest.mock('@/services/admin/rolesServices', () => ({
  getRoles: () => _getRoles(),
  addRole: (role: RolesEntity) => _addRole(role),
  updateRole: (role: RolesEntity) => _updateRole(role),
  removeRole: (role: RolesEntity) => _deleteRole(role),
}));

describe('UNIT - Roles Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [RolesConstant.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getRoles', () => {
    it('should return status 200 and a list of roles', async () => {
      await getRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });

    it('should return status 200 and a filtered roles', async () => {
      mockRequest.body.filter = { name: 'big name' };
      const role = produceRole();
      role.Name = 'big name';
      await getRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });
  });

  describe('Controller addRole', () => {
    const role = produceRole();
    beforeEach(() => {
      mockRequest.body = role;
    });

    it('should return status 201 and the new role', async () => {
      await addRole(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
      expect(role.Id).toBe(mockResponse.sendValue.Id);
    });
  });

  describe('Controller getRoleById', () => {
    const role = produceRole();
    beforeEach(() => {
      _getRoles.mockImplementationOnce(() => [role]);
      mockRequest.params.id = role.Id;
    });

    it('should return status 200 and the role info', async () => {
      await getRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(role.Id);
    });
  });

  describe('Controller updateRoleById', () => {
    const role = produceRole();
    beforeEach(() => {
      role.Name = 'new name';
      mockRequest.params.id = role.Id;
      mockRequest.body = role;
    });

    it('should return status 200 and the updated role', async () => {
      await updateRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Name).toBe('new name');
    });
  });

  describe('Controller deleteRoleById', () => {
    const role = produceRole();
    beforeEach(() => {
      mockRequest.params.id = role.Id;
    });

    it('should return status 204', async () => {
      mockRequest.body = role;
      await deleteRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(role.Id);
    });
  });
});
