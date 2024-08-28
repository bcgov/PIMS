import { IKeycloakUser } from '@/services/keycloak/IKeycloakUser';
import KeycloakService from '../../../../src/services/keycloak/keycloakService';
import {
  getRoles,
  getRole,
  updateRole,
  createRole,
  getIDIRUsers,
  getBothBCeIDUser,
  getUserRoles,
  assignUserRoles,
  unassignUserRole,
} from '@bcgov/citz-imb-kc-css-api';
import { faker } from '@faker-js/faker';
import { produceRole, produceUser } from 'tests/testUtils/factories';
import { AppDataSource } from '@/appDataSource';
import { Role } from '@/typeorm/Entities/Role';
import { User } from '@/typeorm/Entities/User';
import { DeepPartial } from 'typeorm';

jest.mock('@bcgov/citz-imb-kc-css-api');

const mockUser: IKeycloakUser = {
  email: faker.internet.email(),
  username: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  attributes: {
    display_name: [faker.person.fullName()],
  },
};
const _updateUser = jest.fn().mockImplementation((_user: DeepPartial<User>) => ({ raw: {} }));

jest.mock('@/services/users/usersServices', () => ({
  getUsers: () => [produceUser()],
  getUserById: () => produceUser(),
  updateUser: (user: DeepPartial<User>) => _updateUser(user),
}));

const _getRoles = jest.fn().mockImplementation(async () => []);
const _addRole = jest.fn();
const _updateRole = jest.fn();
const _getRoleByName = jest.fn().mockImplementation(async () => produceRole());

jest.mock('@/services/roles/rolesServices', () => ({
  getRoles: () => _getRoles(),
  addRole: () => _addRole(),
  updateRole: () => _updateRole(),
  getRoleByName: () => _getRoleByName(),
}));

const _getKeycloakUserRoles = jest.spyOn(KeycloakService, 'getKeycloakUserRoles');

const _repoFindBy = jest.spyOn(AppDataSource.getRepository(Role), 'findBy');
const _repoDelete = jest
  .spyOn(AppDataSource.getRepository(Role), 'delete')
  .mockImplementation(async () => ({ raw: {} }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userCreateQueryBuilder: any = {
  update: () => userCreateQueryBuilder,
  set: () => userCreateQueryBuilder,
  where: () => userCreateQueryBuilder,
  execute: () => {},
};
jest
  .spyOn(AppDataSource.getRepository(User), 'createQueryBuilder')
  .mockImplementation(() => userCreateQueryBuilder);

describe('UNIT - KeycloakService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncKeycloakRoles', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should add roles to PIMS if they do not already exist', async () => {
      const _getKeycloakRoles = jest.spyOn(KeycloakService, 'getKeycloakRoles');
      _getKeycloakRoles.mockImplementationOnce(async () => [{ name: 'Administrator' }]);
      _getRoles.mockImplementationOnce(async () => {
        return [];
      });
      _addRole.mockImplementationOnce(async (role) => role);
      _repoFindBy.mockImplementationOnce(async () => []);
      await KeycloakService.syncKeycloakRoles();

      expect(_addRole).toHaveBeenCalledTimes(1);
      expect(_repoDelete).toHaveBeenCalledTimes(0);
    });
    it('should remove roles from PIMS if they do not exist in Keycloak', async () => {
      const _getKeycloakRoles = jest.spyOn(KeycloakService, 'getKeycloakRoles');
      _getKeycloakRoles.mockImplementationOnce(async () => []);
      _repoFindBy.mockImplementationOnce(async () => {
        return [{ ...produceRole(), Name: 'OldRole' }];
      });
      await KeycloakService.syncKeycloakRoles();

      expect(_addRole).toHaveBeenCalledTimes(0);
      expect(_repoDelete).toHaveBeenCalledTimes(1);
    });
    it('should update roles in PIMS if they do not match what is in Keycloak', async () => {
      const _getKeycloakRoles = jest.spyOn(KeycloakService, 'getKeycloakRoles');
      _getKeycloakRoles.mockImplementationOnce(async () => [{ name: 'Administrator' }]);
      _getRoles.mockImplementationOnce(() =>
        Promise.resolve([{ ...produceRole(), Name: 'Administrator' }]),
      );
      _updateRole.mockImplementationOnce(async (role) => role);
      _repoFindBy.mockImplementationOnce(async () => []);

      await KeycloakService.syncKeycloakRoles();

      expect(_updateRole).toHaveBeenCalledTimes(1);
      expect(_repoDelete).toHaveBeenCalledTimes(0);
    });
  });

  describe('getKeycloakRoles', () => {
    it('should return a list of possible roles', async () => {
      // Mock the call to Keycloak
      const expectedRoles = { data: ['role1', 'role2'] };
      (getRoles as jest.Mock).mockResolvedValue(expectedRoles);
      //_getKeycloakRoles.mockRestore();
      const roles = await KeycloakService.getKeycloakRoles();
      expect(getRoles).toHaveBeenCalledTimes(1);
      expect(roles).toEqual(expectedRoles.data);
    });
  });

  describe('getKeycloakRole', () => {
    it('should return the role information when it exists', async () => {
      // Mock the call to Keycloak
      const expectedRole = { name: 'role1' };
      (getRole as jest.Mock).mockResolvedValue(expectedRole);

      const role = await KeycloakService.getKeycloakRole('role1');
      expect(getRole).toHaveBeenCalledTimes(1);
      expect(role).toEqual(expectedRole);
    });

    it('should throw an error when the role does not exist', async () => {
      // Mock the call to Keycloak
      const expectedResponse = { message: 'role does not exist' };
      (getRole as jest.Mock).mockResolvedValue(expectedResponse);

      expect(KeycloakService.getKeycloakRole('role1')).rejects.toThrow(
        `keycloakService.getKeycloakRole: role does not exist`,
      );
      expect(getRole).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateKeycloakRole', () => {
    it('should return the updated role when the original role already exists', async () => {
      // Mock the call to Keycloak
      const existingRole = { name: 'role1' };
      const newRole = { name: 'newRoleName' };
      (getRole as jest.Mock)
        .mockResolvedValueOnce({ message: 'error' })
        .mockResolvedValueOnce(existingRole);
      (updateRole as jest.Mock).mockResolvedValue(newRole);

      const response = await KeycloakService.updateKeycloakRole('role1', 'newRoleName');
      expect(getRole).toHaveBeenCalledTimes(2);
      expect(updateRole).toHaveBeenCalledTimes(1);
      expect(response).toEqual(newRole);
    });

    it('should return the created role when neither original or new role exists', async () => {
      // Mock the call to Keycloak
      const newRole = { name: 'newRoleName' };
      (getRole as jest.Mock).mockResolvedValue({ message: 'error' });
      (createRole as jest.Mock).mockResolvedValue(newRole);

      const response = await KeycloakService.updateKeycloakRole('role1', 'newRoleName');
      expect(getRole).toHaveBeenCalledTimes(2);
      expect(createRole).toHaveBeenCalledTimes(1);
      expect(response).toEqual(newRole);
    });

    it('should throw an error if the new role name already exists', async () => {
      // Mock the call to Keycloak
      (getRole as jest.Mock).mockResolvedValue({ name: 'newRoleName' });

      expect(KeycloakService.updateKeycloakRole('role1', 'newRoleName')).rejects.toThrow(
        `keycloakService.updateKeycloakRole: Role newRoleName already exists`,
      );
      expect(getRole).toHaveBeenCalledTimes(1);
      expect(getRole).toHaveBeenCalledWith('newRoleName');
    });
  });

  describe('syncKeycloakUser', () => {
    // TODO: finish tests when function is implemented
    it('should add update user roles in PIMS', async () => {
      _getKeycloakUserRoles.mockImplementationOnce(async () => [{ name: 'Test' }]);
      await KeycloakService.syncKeycloakUser('test');
      expect(_updateUser.mock.calls[0][0].RoleId).toBeTruthy();
    });
    it('should null role if no role is present', async () => {
      _getKeycloakUserRoles.mockImplementationOnce(async () => []);
      await KeycloakService.syncKeycloakUser('test');
      expect(_updateUser.mock.calls[0][0].RoleId).toBeNull();
    });
  });

  describe('getKeycloakUsers', () => {
    it('should return a list of users', async () => {
      (getIDIRUsers as jest.Mock).mockResolvedValue({ data: [mockUser] });
      (getBothBCeIDUser as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const response = await KeycloakService.getKeycloakUsers({
        firstName: mockUser.firstName,
        guid: mockUser.username,
      });
      expect(getIDIRUsers).toHaveBeenCalledTimes(1);
      expect(getBothBCeIDUser).toHaveBeenCalledTimes(1);
      expect(response).toEqual([mockUser, mockUser]);
    });
  });

  describe('getKeycloakUser', () => {
    it('should return a single user by guid', async () => {
      (getIDIRUsers as jest.Mock).mockResolvedValue({ data: [] });
      (getBothBCeIDUser as jest.Mock).mockResolvedValue({ data: [mockUser] });

      const response = await KeycloakService.getKeycloakUser(mockUser.username);
      expect(getIDIRUsers).toHaveBeenCalledTimes(1);
      expect(getBothBCeIDUser).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockUser);
    });

    it('should throw an error when no user is found', async () => {
      (getIDIRUsers as jest.Mock).mockResolvedValue({ data: [] });
      (getBothBCeIDUser as jest.Mock).mockResolvedValue({ data: [] });

      expect(KeycloakService.getKeycloakUser(mockUser.username)).rejects.toThrow(
        `keycloakService.getKeycloakUser: User ${mockUser.username} not found.`,
      );
      expect(getIDIRUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateKeycloakUserRoles', () => {
    it('should throw an error when no user is found', async () => {
      (getUserRoles as jest.Mock).mockResolvedValueOnce({ message: 'no user found' });

      expect(KeycloakService.updateKeycloakUserRoles(mockUser.username, ['role1'])).rejects.toThrow(
        /^Failed to update user/,
      );
      expect(getUserRoles).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if requested roles match existing roles', async () => {
      const role = {
        name: 'role1',
      };
      (getUserRoles as jest.Mock).mockResolvedValueOnce({ data: [role] });
      (assignUserRoles as jest.Mock).mockResolvedValue({ data: [role] });

      const response = await KeycloakService.updateKeycloakUserRoles(mockUser.username, ['role1']);
      expect(response).toEqual([role]);
      expect(getUserRoles).toHaveBeenCalledTimes(1);
      expect(assignUserRoles).toHaveBeenCalledTimes(1);
    });

    it('should add requested roles to user and remove existing roles not in requested roles', async () => {
      const existingRoles = [
        {
          name: 'role1',
        },
        {
          name: 'role2',
        },
      ];
      const newRoles = [
        {
          name: 'role2',
        },
        {
          name: 'role3',
        },
      ];
      (getUserRoles as jest.Mock).mockResolvedValueOnce({ data: existingRoles });
      (assignUserRoles as jest.Mock).mockResolvedValue({ data: newRoles });
      (unassignUserRole as jest.Mock).mockResolvedValue({});

      const response = await KeycloakService.updateKeycloakUserRoles(
        mockUser.username,
        newRoles.map((role) => role.name),
      );
      expect(response).toEqual(newRoles);
      expect(getUserRoles).toHaveBeenCalledTimes(1);
      expect(unassignUserRole).toHaveBeenCalledTimes(1);
      expect(assignUserRoles).toHaveBeenCalledTimes(1);
      expect(assignUserRoles).toHaveBeenCalledWith(mockUser.username, ['role3']);
    });
  });
});
