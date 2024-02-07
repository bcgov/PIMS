/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppDataSource } from '@/appDataSource';
import userServices from '@/services/users/usersServices';
import { AccessRequest } from '@/typeorm/Entities/AccessRequest';
import { Agency } from '@/typeorm/Entities/Agency';
import { User } from '@/typeorm/Entities/User';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { produceAgency, produceRequest, produceUser } from 'tests/testUtils/factories';

const _usersFindOneBy = jest
  .spyOn(AppDataSource.getRepository(User), 'findOneBy')
  .mockImplementation(async (_where) => produceUser());

const _usersUpdate = jest
  .spyOn(AppDataSource.getRepository(User), 'update')
  .mockImplementation(async (_where) => ({ raw: {}, generatedMaps: [] }));

const _usersInsert = jest
  .spyOn(AppDataSource.getRepository(User), 'insert')
  .mockImplementation(async (_where) => ({ raw: {}, generatedMaps: [], identifiers: [] }));

const _requestInsert = jest
  .spyOn(AppDataSource.getRepository(AccessRequest), 'insert')
  .mockImplementation(async (req) => ({ raw: {}, generatedMaps: [{ ...req }], identifiers: [] }));

const _requestUpdate = jest
  .spyOn(AppDataSource.getRepository(AccessRequest), 'update')
  .mockImplementation(async (id, req) => ({
    raw: {},
    generatedMaps: [req],
    identifiers: [],
    affected: 1,
  }));

const _requestRemove = jest
  .spyOn(AppDataSource.getRepository(AccessRequest), 'remove')
  .mockImplementation(async (req) => req);
const _requestQueryGetOne = jest.fn().mockImplementation(() => produceRequest());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _requestsCreateQueryBuilder: any = {
  select: () => _requestsCreateQueryBuilder,
  leftJoinAndSelect: () => _requestsCreateQueryBuilder,
  where: () => _requestsCreateQueryBuilder,
  andWhere: () => _requestsCreateQueryBuilder,
  orderBy: () => _requestsCreateQueryBuilder,
  getOne: () => _requestQueryGetOne(),
};

jest
  .spyOn(AppDataSource.getRepository(AccessRequest), 'createQueryBuilder')
  .mockImplementation(() => _requestsCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(User), 'find')
  .mockImplementation(async () => [produceUser()]);

jest
  .spyOn(AppDataSource.getRepository(User), 'findOneOrFail')
  .mockImplementation(async () => produceUser());

jest
  .spyOn(AppDataSource.getRepository(AccessRequest), 'findOne')
  .mockImplementation(async () => produceRequest());

jest
  .spyOn(AppDataSource.getRepository(AccessRequest), 'findOneOrFail')
  .mockImplementation(async () => produceRequest());

jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOne')
  .mockImplementation(async () => produceAgency());

jest
  .spyOn(AppDataSource.getRepository(Agency), 'findOneOrFail')
  .mockImplementation(async () => produceAgency());

jest
  .spyOn(AppDataSource.getRepository(Agency), 'find')
  .mockImplementation(async () => [produceAgency()]);

describe('UNIT - User services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const kcUser: KeycloakUser = {
    preferred_username: 'test',
    email: 'test@gov.bc.ca',
    display_name: 'test',
    identity_provider: 'idir',
    idir_user_guid: 'test',
    idir_username: 'test',
    given_name: 'test',
    family_name: 'test',
  };

  describe('getUser', () => {
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

  describe('activateUser', () => {
    it('updates a user based off the kc username', async () => {
      const found = produceUser();
      found.Username = 'test';
      _usersFindOneBy.mockResolvedValueOnce(found);
      const user = await userServices.activateUser(kcUser);
      expect(_usersFindOneBy).toHaveBeenCalledTimes(1);
      expect(_usersUpdate).toHaveBeenCalledTimes(1);
    });
    it('adds a new user based off the kc username', async () => {
      _usersFindOneBy.mockResolvedValueOnce(null);
      const user = await userServices.activateUser(kcUser);
      expect(_usersFindOneBy).toHaveBeenCalledTimes(1);
      expect(_usersInsert).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAccessRequest', () => {
    it('should get the latest accessRequest', async () => {
      const request = await userServices.getAccessRequest(kcUser);
      expect(AppDataSource.getRepository(AccessRequest).createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getAccessRequestById', () => {
    it('should get the accessRequest at the id specified', async () => {
      const user = produceUser();
      const req = produceRequest();
      req.UserId = user;
      _usersFindOneBy.mockResolvedValueOnce(user);
      _requestQueryGetOne.mockImplementationOnce(() => req);
      const request = await userServices.getAccessRequestById(req.Id, kcUser);
    });
  });

  describe('deleteAccessRequest', () => {
    it('should return a deleted access request', async () => {
      const req = await userServices.deleteAccessRequest(produceRequest());
      expect(_requestRemove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the access request does not exist', () => {
      jest
        .spyOn(AppDataSource.getRepository(AccessRequest), 'findOne')
        .mockImplementationOnce(() => undefined);
      expect(
        async () => await userServices.deleteAccessRequest(produceRequest()),
      ).rejects.toThrow();
    });
  });

  describe('addAccessRequest', () => {
    it('should add and return an access request', async () => {
      const request = produceRequest();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request.AgencyId = {} as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      request.RoleId = {} as any;
      const req = await userServices.addAccessRequest(request, kcUser);
      expect(_requestInsert).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the provided access request is null', () => {
      expect(async () => await userServices.addAccessRequest(null, kcUser)).rejects.toThrow();
    });
  });

  describe('updateAccessRequest', () => {
    it('should update and return the access request', async () => {
      const req = produceRequest();
      _usersFindOneBy.mockResolvedValueOnce(req.UserId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req.RoleId = {} as any;
      const request = await userServices.updateAccessRequest(req, kcUser);
      expect(_requestUpdate).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the provided access request is null', () => {
      expect(async () => await userServices.updateAccessRequest(null, kcUser)).rejects.toThrow();
    });
  });

  describe('getAgencies', () => {
    it('should return an array of agency ids', async () => {
      const agencies = await userServices.getAgencies('test');
      expect(AppDataSource.getRepository(User).findOneOrFail).toHaveBeenCalledTimes(1);
      expect(AppDataSource.getRepository(Agency).find).toHaveBeenCalledTimes(1);
      expect(Array.isArray(agencies)).toBe(true);
    });
  });

  describe('getAdministrators', () => {
    it('should return users that have administrative role in the given agencies', async () => {
      const admins = await userServices.getAdministrators(['123', '456']);
      expect(AppDataSource.getRepository(User).find).toHaveBeenCalledTimes(1);
      expect(Array.isArray(admins)).toBe(true);
    });
  });

  describe('normalizeKeycloakUser', () => {
    it('should return a normalized user from IDIR', () => {
      const result = userServices.normalizeKeycloakUser(kcUser);
      expect(result.given_name).toBe(kcUser.given_name);
      expect(result.family_name).toBe(kcUser.family_name);
      expect(result.username).toBe(kcUser.preferred_username);
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
});
