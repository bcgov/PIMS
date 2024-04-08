/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceKeycloak,
  produceUser,
} from '../../../testUtils/factories';
import { faker } from '@faker-js/faker';
import { KeycloakIdirUser, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { Roles } from '@/constants/roles';
import { UUID } from 'crypto';

const {
  addUser,
  //addUserRoleByName,
  getUserById,
  getUserRolesByName,
  getAllRoles,
  getUsers,
  //getUsersSameAgency,
  deleteUserById,
  //deleteUserRoleByName,
  updateUserById,
  updateUserRolesByName,
  getUserInfo,
  submitUserAccessRequest,
  getUserAgencies,
  getSelf,
} = controllers;

const _activateUser = jest.fn();
const _addKeycloakUserOnHold = jest
  .fn()
  .mockImplementation((kc: KeycloakUser, agencyId: string, position: string, note: string) => ({
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

jest.mock('@/services/users/usersServices', () => ({
  activateUser: () => _activateUser(),
  addKeycloakUserOnHold: (kc: KeycloakUser, agencyId: string, position: string, note: string) =>
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
}));

describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('getUserInfo', () => {
    it('should return status 200 and keycloak info', async () => {
      const header = { a: faker.string.alphanumeric() };
      const payload = { b: faker.string.alphanumeric() };
      mockRequest.token = btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload));
      await getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.b).toBe(payload.b);
    });

    it('should return 400 when an invalid JWT is sent', async () => {
      mockRequest.token = 'hello';
      await getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should return 400 when no JWT is sent', async () => {
      await getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    // FIXME: I don't think we should be throwing errors from controllers
    // it('should throw an error when either side of the jwt cannot be parsed', () => {
    //   mockRequest.token = 'hello.goodbye';
    //   expect(() => {getUserInfo(mockRequest, mockResponse)}).toThrow();
    // })
  });

  // describe('getUserAccessRequestLatest', () => {
  //   it('should return status 200 and an access request', async () => {
  //     await getUserAccessRequestLatest(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(200);
  //     expect(mockResponse.sendValue.Id).toBeDefined();
  //   });

  //   it('should return status 204 if no requests', async () => {
  //     _getAccessRequest.mockImplementationOnce(() => null);
  //     await getUserAccessRequestLatest(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(204);
  //     expect(mockResponse.sendValue.Id).toBeUndefined();
  //   });

  //   it('should return status 400 if userService.getAccessRequest throws an error', async () => {
  //     _getAccessRequest.mockImplementationOnce(() => {
  //       throw new Error();
  //     });
  //     await getUserAccessRequestLatest(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(400);
  //   });
  // });

  // describe('getUserAccessRequestById', () => {
  //   const request = produceRequest();

  //   it('should return status 200 and an access request', async () => {
  //     _getAccessRequestById.mockImplementationOnce(() => request);
  //     mockRequest.params.requestId = String(request.Id);
  //     await getUserAccessRequestById(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(200);
  //     expect(mockResponse.sendValue.Id).toBe(request.Id);
  //   });

  //   it('should return status 404 if no request found', async () => {
  //     _getAccessRequestById.mockImplementationOnce(() => null);
  //     mockRequest.params.requestId = '-1';
  //     await getUserAccessRequestById(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(404);
  //   });
  // });

  // describe('updateUserAccessRequest', () => {
  //   it('should return status 200 and an access request', async () => {
  //     const request = produceRequest();
  //     mockRequest.params.requestId = '1';
  //     mockRequest.body = request;
  //     await updateUserAccessRequest(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(200);
  //     expect(mockResponse.sendValue.Id).toBe(request.Id);
  //   });

  //   it('should return status 400 if malformed', async () => {
  //     mockRequest.params.requestId = '1';
  //     mockRequest.body = {};
  //     _updateAccessRequest.mockImplementationOnce(() => {
  //       throw Error();
  //     });
  //     await updateUserAccessRequest(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(400);
  //   });
  // });

  describe('submitUserAccessRequest', () => {
    it('should return status 201 and an access request', async () => {
      mockRequest.user = produceKeycloak();
      mockRequest.body = { agencyId: 'bch' };
      await submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
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
      const kcUser = produceKeycloak();
      _normalizeKeycloakUser.mockImplementationOnce(() => ({
        guid: (kcUser as KeycloakIdirUser).idir_user_guid,
      }));
      mockRequest.user = kcUser;
      await getSelf(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return no data', async () => {
      const kcUser = produceKeycloak();
      _normalizeKeycloakUser.mockImplementationOnce(() => ({
        guid: (kcUser as KeycloakIdirUser).idir_user_guid,
      }));
      _getUser.mockImplementationOnce(() => null);
      mockRequest.user = kcUser;
      await getSelf(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });

    it('should throw an error if normalizeKeycloakUser throws an error', async () => {
      const kcUser = produceKeycloak();
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

  describe('Controller addUser', () => {
    const user = produceUser();
    beforeEach(() => {
      _addUser.mockImplementation(() => user);
      mockRequest.body = user;
    });

    it('should return status 201 and the new user', async () => {
      await addUser(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
      expect(mockResponse.sendValue.Id).toBe(mockRequest.body.Id);
    });

    it('should return status 400 when the userService.addUser throws an error', async () => {
      _addUser.mockImplementationOnce(() => {
        throw new Error();
      });
      await addUser(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
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

  describe('Controller deleteUserById', () => {
    const user = produceUser();
    beforeEach(() => {
      _deleteUser.mockImplementation(() => user);
      mockRequest.params.id = user.Id;
      mockRequest.body = user;
    });

    it('should return status 200', async () => {
      await deleteUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(user.Id);
    });

    it('should return status 400 if the param ID does not match the body ID', async () => {
      mockRequest.params.id = faker.string.uuid() as UUID;
      await deleteUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('The param ID does not match the request body.');
    });

    it('should throw an error if userService.deleteUser throws an error', async () => {
      _deleteUser.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await deleteUserById(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('Controller getUserRolesByName', () => {
    beforeEach(() => {
      mockRequest.params.username = 'test';
    });

    it('should return status 200 and a list of their roles', async () => {
      await getUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      // Only role is Admin
      expect(mockResponse.sendValue).toHaveLength(1);
      expect(mockResponse.sendValue.at(0)).toBe('admin');
    });

    it('should return status 400 if params.username is not provided', async () => {
      mockRequest.params = {};
      await getUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Username was empty.');
    });
  });

  describe('Controller getAllRoles', () => {
    it('should return status 200 and a list of roles assigned to a user', async () => {
      await getAllRoles(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.at(0)).toBe('admin');
    });

    it('should throw an error when internal service throws', async () => {
      _getRoles.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(async () => await getAllRoles(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('Controller updateUserRolesByName', () => {
    const user = produceUser();
    beforeEach(() => {
      _updateUserRoles.mockImplementation((username, roles) => roles);
      mockRequest.params = {
        username: user.Username,
      };
      mockRequest.body = ['admin', 'auditor'];
    });
    it('should return status 200 and a list of updated roles', async () => {
      await updateUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      // TODO: Check the return value. It's currently undefined for some reason.
    });

    it('should return status 400 if the request body was not parsed successfully', async () => {
      mockRequest.body = {
        notGood: true,
      };
      await updateUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Request body was wrong format.');
    });

    it('should return 400 if params.username was not provided', async () => {
      mockRequest.params = {};
      await updateUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('Username was empty.');
    });
  });
});
