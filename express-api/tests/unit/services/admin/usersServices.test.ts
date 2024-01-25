import { AppDataSource } from '@/appDataSource';
import userServices from '@/services/admin/usersServices';
import { IKeycloakRole } from '@/services/keycloak/IKeycloakRole';
import { Users } from '@/typeorm/Entities/Users';
import { randomUUID } from 'crypto';
import { produceUser } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';
import { z } from 'zod';

const _usersFind = jest
  .spyOn(AppDataSource.getRepository(Users), 'find')
  .mockImplementation(async () => [produceUser()]);

const _usersSave = jest
  .spyOn(AppDataSource.getRepository(Users), 'save')
  .mockImplementation(async (user: DeepPartial<Users> & Users) => user);

const _usersUpdate = jest
  .spyOn(AppDataSource.getRepository(Users), 'update')
  .mockImplementation(async (id, user) => ({ generatedMaps: [user], raw: {} }));

const _usersRemove = jest
  .spyOn(AppDataSource.getRepository(Users), 'remove')
  .mockImplementation(async (user) => user);

jest.mock('@/services/keycloak/keycloakService', () => ({
  getKeycloakRoles: (): IKeycloakRole[] => [{ name: 'abc', id: randomUUID() }],
  getKeycloakUserRoles: (): IKeycloakRole[] => [{ name: 'abc', id: randomUUID() }],
  updateKeycloakUserRoles: (username: string, roles: string[]): IKeycloakRole[] =>
    roles.map((a) => ({ name: a, id: randomUUID() })),
}));

describe('UNIT - admin user services', () => {
  describe('getUsers', () => {
    it('should get a list of all users', async () => {
      const users = await userServices.getUsers({});
      expect(_usersFind).toHaveBeenCalledTimes(1);
      expect(Array.isArray(users)).toBe(true);
    });
  });
  describe('addUser', () => {
    it('should insert and return the added user', async () => {
      const user = produceUser();
      const retUser = await userServices.addUser(user);
      expect(_usersSave).toHaveBeenCalledTimes(1);
      expect(user.Id).toBe(retUser.Id);
    });
  });
  describe('updateUser', () => {
    it('should update and return the added user', async () => {
      const user = produceUser();
      const retUser = await userServices.updateUser(user);
      expect(_usersUpdate).toHaveBeenCalledTimes(1);
      expect(user.Id).toBe(retUser.Id);
    });
  });
  describe('deleteUser', () => {
    it('should delete and return the deleted user', async () => {
      const user = produceUser();
      const retUser = await userServices.deleteUser(user);
      expect(_usersRemove).toHaveBeenCalledTimes(1);
      expect(user.Id).toBe(retUser.Id);
    });
  });
  describe('getRoles', () => {
    it('should get names of roles in keycloak', async () => {
      const roles = await userServices.getRoles();
      expect(z.string().array().safeParse(roles).success).toBe(true);
    });
  });
  describe('getUserRoles', () => {
    it('should get names of users roles in keycloak', async () => {
      const roles = await userServices.getUserRoles('test');
      expect(z.string().array().safeParse(roles).success).toBe(true);
    });
  });
  describe('updateUserRoles', () => {
    it('should update (put style) users roles in keycloak', async () => {
      const newRoles = ['admin', 'test'];
      const roles = await userServices.updateUserRoles('test', newRoles);
      expect(z.string().array().safeParse(roles).success).toBe(true);
      newRoles.forEach((a, i) => expect(a).toBe(newRoles[i]));
    });
  });
});
