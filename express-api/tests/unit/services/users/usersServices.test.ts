/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppDataSource } from '@/appDataSource';
import { IKeycloakRole } from '@/services/keycloak/IKeycloakRole';
import userServices from '@/services/users/usersServices';
import { Agency } from '@/typeorm/Entities/Agency';
import { User } from '@/typeorm/Entities/User';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { faker } from '@faker-js/faker';
import { produceAgency, produceUser, produceSSO } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';
import { z } from 'zod';

const _usersFindOneBy = jest
  .spyOn(AppDataSource.getRepository(User), 'findOneBy')
  .mockImplementation(async (_where) => produceUser());

const _usersUpdate = jest
  .spyOn(AppDataSource.getRepository(User), 'update')
  .mockImplementation(async (id, user) => ({ raw: {}, generatedMaps: [user] }));

const _usersInsert = jest
  .spyOn(AppDataSource.getRepository(User), 'insert')
  .mockImplementation(async (_where) => ({ raw: {}, generatedMaps: [], identifiers: [] }));

const _usersFind = jest
  .spyOn(AppDataSource.getRepository(User), 'find')
  .mockImplementation(async () => [produceUser()]);

const _usersFindOne = jest
  .spyOn(AppDataSource.getRepository(User), 'findOne')
  .mockImplementation(async () => produceUser());

const _usersSave = jest
  .spyOn(AppDataSource.getRepository(User), 'save')
  .mockImplementation(async (user: DeepPartial<User> & User) => user);

const _usersRemove = jest
  .spyOn(AppDataSource.getRepository(User), 'remove')
  .mockImplementation(async (user) => user);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _requestsCreateQueryBuilder: any = {
  select: () => _requestsCreateQueryBuilder,
  leftJoinAndSelect: () => _requestsCreateQueryBuilder,
  where: () => _requestsCreateQueryBuilder,
  andWhere: () => _requestsCreateQueryBuilder,
  orderBy: () => _requestsCreateQueryBuilder,
};

jest.mock('@/services/keycloak/keycloakService', () => ({
  getKeycloakRoles: (): IKeycloakRole[] => [{ name: 'abc' }],
  getKeycloakUserRoles: (): IKeycloakRole[] => [{ name: 'abc' }],
  updateKeycloakUserRoles: (username: string, roles: string[]): IKeycloakRole[] =>
    roles.map((a) => ({ name: a })),
  syncKeycloakUser: (username: string) => ({ ...produceUser(), Username: username }),
}));

jest
  .spyOn(AppDataSource.getRepository(User), 'find')
  .mockImplementation(async () => [produceUser()]);

jest
  .spyOn(AppDataSource.getRepository(User), 'findOne')
  .mockImplementation(async () => produceUser());

jest
  .spyOn(AppDataSource.getRepository(User), 'findOneOrFail')
  .mockImplementation(async () => produceUser());

jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOne')
  .mockImplementation(async () => produceAgency());

jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOneOrFail')
  .mockImplementation(async () => produceAgency());

const _agenciesFind = jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency({ Id: 100 })]);

describe('UNIT - User services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const ssoUser: SSOUser = produceSSO();

  describe('getUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const user = produceUser();
    it('should return a user when called with a UUID', async () => {
      jest
        .spyOn(AppDataSource.getRepository(User), 'findOneBy')
        .mockImplementationOnce(async () => user);
      const result = await userServices.getUser(user.Id);
      expect(result.FirstName).toBe(user.FirstName);
    });

    it('should return a user when called with a username', async () => {
      jest
        .spyOn(AppDataSource.getRepository(User), 'findOneBy')
        .mockImplementationOnce(async () => user);
      const result = await userServices.getUser(user.Username);
      expect(result.FirstName).toBe(user.FirstName);
    });
  });

  describe('getUserById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return a user assuming one is found', async () => {
      const user = produceUser();
      _usersFindOne.mockImplementationOnce(async () => user);
      const result = await userServices.getUserById('123');
      expect(result).toEqual(user);
    });

    it('should return null when no user is found', async () => {
      _usersFindOne.mockImplementationOnce(async () => null);
      const result = await userServices.getUserById('123');
      expect(result).toEqual(null);
    });
  });

  describe('addKeycloakUserOnHold', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should add and return an access request', async () => {
      const agencyId = faker.number.int();
      const req = await userServices.addKeycloakUserOnHold(
        ssoUser,
        agencyId,
        '',
        '',
        'email@email.com',
      );
      expect(_usersInsert).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the agency is null', () => {
      expect(
        async () =>
          await userServices.addKeycloakUserOnHold(ssoUser, null, '', '', 'email@email.com'),
      ).rejects.toThrow('Null argument.');
    });

    it('should throw an error if the email is invalid', () => {
      const agencyId = faker.number.int();
      expect(
        async () =>
          await userServices.addKeycloakUserOnHold(ssoUser, agencyId, '', '', 'email.com'),
      ).rejects.toThrow('Invalid email.');
    });
  });

  describe('getAgencies', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return an array of agency ids', async () => {
      const agencies = await userServices.getAgencies('test');
      expect(AppDataSource.getRepository(Agency).find).toHaveBeenCalledTimes(1);
      expect(Array.isArray(agencies)).toBe(true);
    });

    it('should return an empty array if the user is not found', async () => {
      _usersFindOneBy.mockImplementationOnce(async () => null);
      const agencies = await userServices.getAgencies('test');
      expect(Array.isArray(agencies)).toBe(true);
      expect(agencies).toHaveLength(0);
    });
  });

  describe('hasAgencies', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return true if the user has the corresponding agencies', async () => {
      _agenciesFind.mockImplementationOnce(async () => [produceAgency({ Id: 1 })]);
      const result = await userServices.hasAgencies('test', [1]);
      expect(result).toEqual(true);
    });

    it('should return false if the user does not have the corresponding agencies', async () => {
      _agenciesFind.mockImplementationOnce(async () => [produceAgency({ Id: 2 })]);
      const result = await userServices.hasAgencies('test', [1]);
      expect(result).toEqual(false);
    });
  });

  describe('normalizeKeycloakUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should return a normalized user from IDIR', () => {
      const result = userServices.normalizeKeycloakUser(ssoUser);
      expect(result.first_name).toBe(ssoUser.first_name);
      expect(result.last_name).toBe(ssoUser.last_name);
      expect(result.username).toBe(ssoUser.preferred_username);
    });

    // TODO: This function looks like it should handle BCeID users, but the param type doesn't fit
    // It should also allow business and basic bceid users, not just basic
    // it('should return a normalized BCeID user', () => {
    //   const bceidUser = {
    //     identity_provider: 'bciedbasic',
    //     preferred_username: 'Test',
    //     bceid_user_guid: '00000000000000000000000000000000',
    //     bceid_username: 'test',
    //     display_name: 'Test',
    //     email: 'test@gov.bc.ca'
    //   }
    //   const result = userServices.normalizeKeycloakUser(bceidUser);
    //   expect(result.given_name).toBe('');
    //   expect(result.family_name).toBe('');
    //   expect(result.username).toBe(bceidUser.preferred_username);
    //   expect(result.guid).toBe('00000000-0000-0000-0000-000000000000')
    // })
  });

  describe('getUsers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should get a list of all users', async () => {
      const users = await userServices.getUsers({});
      expect(_usersFind).toHaveBeenCalledTimes(1);
      expect(Array.isArray(users)).toBe(true);
    });
  });
  describe('addUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should insert and return the added user', async () => {
      const user = produceUser();
      _usersFindOne.mockResolvedValueOnce(null);
      const retUser = await userServices.addUser(user);
      expect(_usersSave).toHaveBeenCalledTimes(1);
      expect(user.Id).toBe(retUser.Id);
    });

    it('should throw an error if the user already exists', async () => {
      const user = produceUser();
      _usersFindOne.mockResolvedValueOnce(user);
      expect(async () => await userServices.addUser(user)).rejects.toThrow(
        'Resource already exists.',
      );
    });

    it('should throw an error if the email is invalid', async () => {
      const user = produceUser({ Email: 'blah' });
      _usersFindOne.mockResolvedValueOnce(null);
      expect(async () => await userServices.addUser(user)).rejects.toThrow('Invalid email.');
    });
  });
  describe('updateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should update and return the added user', async () => {
      const user = produceUser();
      // Mocked once for the initial get and again for the return.
      jest
        .spyOn(AppDataSource.getRepository(User), 'findOne')
        .mockImplementationOnce(async () => produceUser({ ...user }))
        .mockImplementationOnce(async () => produceUser({ ...user }));
      const retUser = await userServices.updateUser(user);
      expect(_usersUpdate).toHaveBeenCalledTimes(1);
      expect(user.Id).toBe(retUser.Id);
    });

    it('should throw an error if the user does not exist', () => {
      const user = produceUser();
      _usersFindOne.mockResolvedValueOnce(undefined);
      expect(async () => await userServices.updateUser(user)).rejects.toThrow(
        'Resource does not exist.',
      );
    });

    it('should throw an error if the email is invalid does not exist', () => {
      const user = produceUser({ Email: 'blah' });
      expect(async () => await userServices.updateUser(user)).rejects.toThrow('Invalid email.');
    });
  });
  describe('deleteUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should delete and return the deleted user', async () => {
      const user = produceUser();
      const retUser = await userServices.deleteUser(user);
      expect(_usersRemove).toHaveBeenCalledTimes(1);
      expect(user.Id).toBe(retUser.Id);
    });

    it('should throw an error if the user does not exist', () => {
      const user = produceUser();
      _usersFindOne.mockResolvedValueOnce(undefined);
      expect(async () => await userServices.deleteUser(user)).rejects.toThrow();
    });
  });
});
