import { IKeycloakUser } from '@/services/keycloak/IKeycloakUser';
import KeycloakService from '../../../../src/services/keycloak/keycloakService';
import { getIDIRUsers, getBothBCeIDUser } from '@bcgov/citz-imb-kc-css-api';
import { faker } from '@faker-js/faker';
import { produceRole, produceUser } from 'tests/testUtils/factories';
import { AppDataSource } from '@/appDataSource';
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
});
