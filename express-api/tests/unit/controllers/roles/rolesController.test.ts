import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceRole,
} from '../../../testUtils/factories';
import { Role as RolesEntity } from '@/typeorm/Entities/Role';
import { Roles as RolesConstant } from '@/constants/roles';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const { addRole, getRoleById, getRoles, deleteRoleById, updateRoleById } = controllers;

const _getRoles = jest.fn().mockImplementation(() => [produceRole()]);
const _addRole = jest.fn().mockImplementation((role) => role);
const _updateRole = jest.fn().mockImplementation((role) => role);
const _deleteRole = jest.fn().mockImplementation((role) => role);
const _getRole = jest.fn().mockImplementation(() => produceRole());

jest.mock('@/services/roles/rolesServices', () => ({
  getRoles: () => _getRoles(),
  addRole: (role: RolesEntity) => _addRole(role),
  getRoleById: () => _getRole(),
  updateRole: (role: RolesEntity) => _updateRole(role),
  removeRole: (role: RolesEntity) => _deleteRole(role),
}));

const _syncKeycloakRoles = jest.fn().mockImplementation(() => {});

jest.mock('@/services/keycloak/keycloakService', () => ({
  syncKeycloakRoles: () => _syncKeycloakRoles(),
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
      mockRequest.query = { name: 'big name' };
      const role = produceRole();
      role.Name = 'big name';
      await getRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });

    it('should return status 400 if incorrect query params are sent', async () => {
      mockRequest.query = {
        page: 'not good',
      };
      await getRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Could not parse filter.');
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

    it('should return a 400 status code if adding a user is unsuccessful', async () => {
      _addRole.mockImplementationOnce((role) => {
        throw new Error(role.name);
      });
      expect(async () => await addRole(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('Controller getRoleById', () => {
    const role = produceRole();
    beforeEach(() => {
      _getRole.mockImplementation(() => role);
      mockRequest.params.id = role.Id;
    });

    it('should return status 200 and the role info', async () => {
      await getRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(role.Id);
    });

    it('should return status 404 if the role cannot be found', async () => {
      _getRole.mockImplementationOnce(() => undefined);
      await getRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
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

    it('should return status 400 if body id and param id do not match', async () => {
      mockRequest.params.id = '9999';
      await updateRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Request param id did not match request body id.');
    });
  });

  describe('Controller deleteRoleById', () => {
    const role = produceRole();
    beforeEach(() => {
      mockRequest.params.id = role.Id;
      mockRequest.body = role;
    });

    it('should return status 204', async () => {
      await deleteRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(role.Id);
    });

    it('should return status 400 if body id and param id do not match', async () => {
      mockRequest.params.id = '9999';
      await deleteRoleById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Request param id did not match request body id.');
    });

    it('should return status 400 if the rolesService.removeRole throws an error', async () => {
      _deleteRole.mockImplementationOnce((role) => {
        throw new Error(role.name);
      });
      expect(async () => await deleteRoleById(mockRequest, mockResponse)).rejects.toThrow();
    });
  });
});
