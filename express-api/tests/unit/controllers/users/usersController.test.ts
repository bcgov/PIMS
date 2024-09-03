/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceSSO,
  produceUser,
} from '../../../testUtils/factories';
import { faker } from '@faker-js/faker';
import { SSOIdirUser, SSOUser } from '@bcgov/citz-imb-sso-express';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { Roles } from '@/constants/roles';
import { UUID } from 'crypto';

const { getUserById, getUsers, updateUserById, submitUserAccessRequest, getUserAgencies, getSelf } =
  controllers;

const _activateUser = jest.fn();
const _addKeycloakUserOnHold = jest
  .fn()
  .mockImplementation((kc: SSOUser, agencyId: string, position: string, note: string) => ({
    ...produceUser(),
    AgencyId: agencyId,
    Position: position,
    Note: note,
  }));
const _updateAccessRequest = jest.fn().mockImplementation((req) => req);
const _getAgencies = jest.fn().mockImplementation(() => ['1', '2', '3']);
const _getAdministrators = jest.fn();
const _getUser = jest
  .fn()
  .mockImplementation((guid: string) => ({ ...produceUser(), KeycloakUserId: guid }));
const _normalizeKeycloakUser = jest.fn().mockImplementation(() => {});
const _getUsers = jest.fn().mockImplementation(() => {
  return [produceUser()];
});
const _addUser = jest.fn().mockImplementation((user) => {
  return user;
});
const _updateUser = jest.fn().mockImplementation((user) => {
  return user;
});
const _deleteUser = jest.fn().mockImplementation((user) => {
  return user;
});
const _getRoles = jest.fn().mockImplementation(() => {
  return ['admin', 'test'];
});
const _getUserRoles = jest.fn().mockImplementation(() => {
  return ['admin'];
});
const _updateUserRoles = jest.fn().mockImplementation((username, roles) => {
  return roles;
});
const _getUserById = jest.fn().mockImplementation(() => produceUser());
const _hasAgencies = jest.fn().mockImplementation(() => true);

jest.mock('@/services/users/usersServices', () => ({
  activateUser: () => _activateUser(),
  addKeycloakUserOnHold: (kc: SSOUser, agencyId: string, position: string, note: string) =>
    _addKeycloakUserOnHold(kc, agencyId, position, note),
  getAgencies: () => _getAgencies(),
  getAdministrators: () => _getAdministrators(),
  getUser: (guid: string) => _getUser(guid),
  normalizeKeycloakUser: () => _normalizeKeycloakUser(),
  getUsers: () => _getUsers(),
  addUser: () => _addUser(),
  updateUser: () => _updateUser(),
  deleteUser: () => _deleteUser(),
  getKeycloakRoles: () => _getRoles(),
  getKeycloakUserRoles: () => _getUserRoles(),
  updateKeycloakUserRoles: () => _updateUserRoles(),
  getUserById: () => _getUserById(),
  hasAgencies: () => _hasAgencies(),
}));

describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('submitUserAccessRequest', () => {
    it('should return status 201 and an access request', async () => {
      mockRequest.user = produceSSO();
      mockRequest.body = { agencyId: 'bch' };
      await submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });

    it('should throw an error if addKeycloakUserOnHold throws an error', async () => {
      mockRequest.body = {};
      _addKeycloakUserOnHold.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await submitUserAccessRequest(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('getUserAgencies', () => {
    it('should return status 200 and an int array', async () => {
      mockRequest.params.username = 'john';
      await getUserAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue));
    });

    it('should throw an error if getAgencies throws an error', async () => {
      mockRequest.params.username = '11111';
      _getAgencies.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await getUserAgencies(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('getSelf', () => {
    it('should return the internal user corresponding to this keycloak', async () => {
      const kcUser = produceSSO();
      _normalizeKeycloakUser.mockImplementationOnce(() => ({
        guid: (kcUser as SSOIdirUser).idir_user_guid,
      }));
      mockRequest.user = kcUser;
      await getSelf(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return no data', async () => {
      const kcUser = produceSSO();
      _normalizeKeycloakUser.mockImplementationOnce(() => ({
        guid: (kcUser as SSOIdirUser).idir_user_guid,
      }));
      _getUser.mockImplementationOnce(() => null);
      mockRequest.user = kcUser;
      await getSelf(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });

    it('should throw an error if normalizeKeycloakUser throws an error', async () => {
      const kcUser = produceSSO();
      _normalizeKeycloakUser.mockImplementationOnce(() => {
        throw new Error();
      });
      mockRequest.user = kcUser;
      expect(async () => await getSelf(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('Controller getUsers', () => {
    it('should return status 200 and a list of users', async () => {
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });

    it('should return a list of users based off the filter', async () => {
      mockRequest.query = {
        position: 'Tester',
      };
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
      expect(mockResponse.sendValue.length === 1);
    });

    it('should return status 400 when given a filter that fails to parse', async () => {
      mockRequest.query = {
        page: 'hi',
      };
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Failed to parse filter query.');
    });
  });

  describe('Controller getUserById', () => {
    const user = produceUser();
    beforeEach(() => {
      _getUserById.mockImplementation(() => user);
    });

    it('should return status 200 and the user info', async () => {
      mockRequest.params.id = user.Id;
      await getUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(user.Id);
    });

    it('should return status 400 if the uuid cannot be parsed', async () => {
      mockRequest.params.id = 'hello';
      await getUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Could not parse UUID.');
    });

    it('should return status 404 userService.getUserById does not find a user', async () => {
      mockRequest.params.id = user.Id;
      _getUserById.mockImplementationOnce(() => undefined);
      await getUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });
});

describe('UNIT - Users Admin', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller updateUserById', () => {
    const user = produceUser();
    user.Email = 'newEmail@gov.bc.ca';
    beforeEach(() => {
      _updateUser.mockImplementation(() => user);
      mockRequest.params.id = user.Id;
      mockRequest.body = { ...user, Email: 'newEmail@gov.bc.ca' };
    });

    it('should return status 200 and the updated user', async () => {
      await updateUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Email).toBe('newEmail@gov.bc.ca');
    });

    it('should return status 400 if the param ID does not match the body ID', async () => {
      mockRequest.params.id = faker.string.uuid() as UUID;
      await updateUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('The param ID does not match the request body.');
    });

    it('should throw an error if userService.updateUser throws an error', async () => {
      _updateUser.mockImplementation(() => {
        throw new Error();
      });
      expect(async () => await updateUserById(mockRequest, mockResponse)).rejects.toThrow();
    });
  });
});
