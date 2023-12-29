import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { IUser } from '@/controllers/admin/users/IUser';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const {
  addUser,
  addUserRoleByName,
  getUserById,
  getUserRolesByName,
  getUsers,
  getUsersByFilter,
  getUsersSameAgency,
  deleteUserById,
  deleteUserRoleByName,
  updateUserById,
} = controllers.admin;

const mockUser: IUser = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedByName: faker.person.firstName(),
  updatedByEmail: faker.internet.email(),
  id: faker.string.uuid() as UUID,
  displayName: faker.company.name(),
  firstName: faker.person.firstName(),
  middleName: faker.person.middleName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  position: 'Tester',
};

describe('UNIT - Users Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getUsers', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of users', async () => {
      await getUsers(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller getUsersByFilter', () => {
    beforeEach(() => {
      mockRequest.body = {
        page: 0,
        quantity: 0,
        position: 'Tester',
        sort: [''],
      };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getUsersByFilter(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of users', async () => {
      await getUsersByFilter(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller getUsersSameAgency', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getUsersSameAgency(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of users', async () => {
      await getUsersSameAgency(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller addUser', () => {
    beforeEach(() => {
      mockRequest.body = mockUser;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await addUser(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 201 and the new user', async () => {
      await addUser(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Controller getUserById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockUser.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the user info', async () => {
      await getUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller updateUserById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockUser.id}`;
      mockRequest.body = { ...mockUser, email: 'newEmail@gov.bc.ca' };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await updateUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the updated user', async () => {
      await updateUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.email).toBe('newEmail@gov.bc.ca');
    });
  });

  describe('Controller deleteUserById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockUser.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204', async () => {
      await deleteUserById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });
  });

  describe('Controller getUserRolesByName', () => {
    beforeEach(() => {
      mockRequest.params.username = `${mockUser.username}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of their roles', async () => {
      await getUserRolesByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      // Only role is Admin
      expect(mockResponse.jsonValue.roles).toHaveLength(1);
      expect(mockResponse.jsonValue.roles.at(0)).toBe('Admin');
    });
  });

  describe('Controller addUserRoleByName', () => {
    beforeEach(() => {
      mockRequest.params.username = `${mockUser.username}`;
      mockRequest.body = 'new role';
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await addUserRoleByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 201 and the updated user with that role', async () => {
      await addUserRoleByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
      expect(mockResponse.jsonValue.roles).toContain('new role');
    });
  });

  describe('Controller deleteUserRoleByName', () => {
    beforeEach(() => {
      mockRequest.params.username = `${mockUser.username}`;
      mockRequest.body = 'new role';
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteUserRoleByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204 and updated user without role', async () => {
      await deleteUserRoleByName(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
      expect(mockResponse.jsonValue.roles).not.toContain('new role');
    });
  });
});
