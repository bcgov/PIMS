import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { Users } from '@/typeorm/Entities/Users';
import { UserFiltering } from '@/controllers/admin/users/usersSchema';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const {
  addUser,
  //addUserRoleByName,
  getUserById,
  getUserRolesByName,
  getUsers,
  //getUsersSameAgency,
  deleteUserById,
  //deleteUserRoleByName,
  updateUserById,
} = controllers.admin;

const produceUser = (): Users => {
  return {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    CreatedById: undefined,
    Id: faker.string.uuid() as UUID,
    DisplayName: faker.company.name(),
    FirstName: faker.person.firstName(),
    MiddleName: faker.person.middleName(),
    LastName: faker.person.lastName(),
    Email: faker.internet.email(),
    Username: faker.internet.userName(),
    Position: 'Tester',
    IsDisabled: false,
    EmailVerified: false,
    IsSystem: false,
    Note: '',
    LastLogin: faker.date.anytime(),
    ApprovedById: undefined,
    ApprovedOn: undefined,
    KeycloakUserId: faker.string.uuid() as UUID,
    Roles: [],
    Agencies: [],
  };
};

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
  return [roles];
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock('@/services/admin/usersServices', () => ({
  getUsers: () => _getUsers(),
  addUser: () => _addUser(),
  updateUser: () => _updateUser(),
  deleteUser: () => _deleteUser(),
  getRoles: () => _getRoles(),
  getUserRoles: () => _getUserRoles(),
  updateUserRoles: () => _updateUserRoles(),
}));

describe('UNIT - Users Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getUsers', () => {
    it('should return status 200 and a list of users', async () => {
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
    });

    it('should return a list of users based off the filter', async () => {
      mockRequest.body = {
        position: 'Tester',
      } as UserFiltering;
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue)).toBe(true);
      expect(mockResponse.sendValue.length === 1);
    });
  });

  // describe('Controller getUsersSameAgency', () => {
  //   // TODO: remove stub test when controller is complete
  //   it('should return the stub response of 501', async () => {
  //     await getUsersSameAgency(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(501);
  //   });

  //   // TODO: enable other tests when controller is complete
  //   xit('should return status 200 and a list of users', async () => {
  //     await getUsersSameAgency(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(200);
  //   });
  // });

  describe('Controller addUser', () => {
    const user = produceUser();
    beforeEach(() => {
      _addUser.mockImplementationOnce(() => user);
      mockRequest.body = user;
    });

    it('should return status 201 and the new user', async () => {
      await addUser(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
      expect(mockResponse.sendValue.Id).toBe(mockRequest.body.Id);
    });
  });

  describe('Controller getUserById', () => {
    const user = produceUser();
    beforeEach(() => {
      _getUsers.mockImplementationOnce(() => [user]);
    });

    it('should return status 200 and the user info', async () => {
      mockRequest.params.id = user.Id;
      await getUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(user.Id);
    });
  });

  describe('Controller updateUserById', () => {
    const user = produceUser();
    user.Email = 'newEmail@gov.bc.ca';
    beforeEach(() => {
      _updateUser.mockImplementationOnce(() => user);
      mockRequest.params.id = user.Id;
      mockRequest.body = { ...user, Email: 'newEmail@gov.bc.ca' };
    });

    it('should return status 200 and the updated user', async () => {
      await updateUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Email).toBe('newEmail@gov.bc.ca');
    });
  });

  describe('Controller deleteUserById', () => {
    const user = produceUser();
    beforeEach(() => {
      _deleteUser.mockImplementationOnce(() => user);
      mockRequest.params.id = user.Id;
      mockRequest.body = user;
    });

    it('should return status 200', async () => {
      await deleteUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(user.Id);
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
  });

  // describe('Controller addUserRoleByName', () => {
  //   beforeEach(() => {
  //     mockRequest.params.username = `test`;
  //     mockRequest.body = 'new role';
  //   });

  //   it('should return status 201 and the updated user with that role', async () => {
  //     await addUserRoleByName(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(201);
  //     expect(mockResponse.sendValue).toContain('new role');
  //   });
  // });

  // describe('Controller deleteUserRoleByName', () => {
  //   beforeEach(() => {
  //     mockRequest.params.username = `${mockUser.Username}`;
  //     mockRequest.body = 'new role';
  //   });
  //   // TODO: remove stub test when controller is complete
  //   it('should return the stub response of 501', async () => {
  //     await deleteUserRoleByName(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(501);
  //   });

  //   // TODO: enable other tests when controller is complete
  //   xit('should return status 204 and updated user without role', async () => {
  //     await deleteUserRoleByName(mockRequest, mockResponse);
  //     expect(mockResponse.statusValue).toBe(204);
  //     expect(mockResponse.jsonValue.roles).not.toContain('new role');
  //   });
  // });
});
