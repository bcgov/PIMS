/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppDataSource } from '@/appDataSource';
import userServices from '@/services/users/usersServices';
import { AccessRequests } from '@/typeorm/Entities/AccessRequests';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { Users } from '@/typeorm/Entities/Users';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { produceAgency, produceRequest, produceUser } from 'tests/testUtils/factories';

const _usersFindOneBy = jest
  .spyOn(AppDataSource.getRepository(Users), 'findOneBy')
  .mockImplementation(async (_where) => produceUser());

const _usersUpdate = jest
  .spyOn(AppDataSource.getRepository(Users), 'update')
  .mockImplementation(async (_where) => ({ raw: {}, generatedMaps: [] }));

const _usersInsert = jest
  .spyOn(AppDataSource.getRepository(Users), 'insert')
  .mockImplementation(async (_where) => ({ raw: {}, generatedMaps: [], identifiers: [] }));

const _requestInsert = jest
  .spyOn(AppDataSource.getRepository(AccessRequests), 'insert')
  .mockImplementation(async (req) => ({ raw: {}, generatedMaps: [{ ...req }], identifiers: [] }));

const _requestUpdate = jest
  .spyOn(AppDataSource.getRepository(AccessRequests), 'update')
  .mockImplementation(async (req) => ({ raw: {}, generatedMaps: [], identifiers: [] }));

const _requestRemove = jest
  .spyOn(AppDataSource.getRepository(AccessRequests), 'remove')
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

const _userQueryGetOne = jest.fn().mockImplementation(() => produceUser());
const _userQueryGetOneOrFail = jest.fn().mockImplementation(() => produceUser());
const _usersQueryGetMany = jest.fn().mockImplementation(() => [produceUser(), produceUser()]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _usersCreateQueryBuilder: any = {
  select: () => _usersCreateQueryBuilder,
  leftJoinAndSelect: () => _usersCreateQueryBuilder,
  where: () => _usersCreateQueryBuilder,
  andWhere: () => _usersCreateQueryBuilder,
  orderBy: () => _usersCreateQueryBuilder,
  getOne: () => _userQueryGetOne(),
  getOneOrFail: () => _userQueryGetOneOrFail(),
  getMany: () => _usersQueryGetMany(),
};

const _agenciesGetMany = jest.fn().mockImplementation(() => [produceAgency(), produceAgency()]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _agenciesCreateQueryBuilder: any = {
  select: () => _agenciesCreateQueryBuilder,
  leftJoinAndSelect: () => _agenciesCreateQueryBuilder,
  where: () => _agenciesCreateQueryBuilder,
  andWhere: () => _agenciesCreateQueryBuilder,
  orderBy: () => _agenciesCreateQueryBuilder,
  getOne: () => {},
  getMany: () => _agenciesGetMany(),
};

jest
  .spyOn(AppDataSource.getRepository(AccessRequests), 'createQueryBuilder')
  .mockImplementation(() => _requestsCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(Users), 'createQueryBuilder')
  .mockImplementation(() => _usersCreateQueryBuilder);

jest
  .spyOn(AppDataSource.getRepository(Agencies), 'createQueryBuilder')
  .mockImplementation(() => _agenciesCreateQueryBuilder);

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
      expect(AppDataSource.getRepository(AccessRequests).createQueryBuilder).toHaveBeenCalledTimes(
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
  });

  describe('getAgencies', () => {
    it('should return an array of agency ids', async () => {
      const agencies = await userServices.getAgencies('test');
      expect(_agenciesGetMany).toHaveBeenCalledTimes(1);
      expect(Array.isArray(agencies)).toBe(true);
    });
  });

  describe('getAdministrators', () => {
    it('should return users that have administrative role in the given agencies', async () => {
      const admins = await userServices.getAdministrators(['123', '456']);
      expect(_usersQueryGetMany).toHaveBeenCalledTimes(1);
      expect(Array.isArray(admins)).toBe(true);
    });
  });
});
