import { AppDataSource } from '@/appDataSource';
import rolesServices from '@/services/roles/rolesServices';
import { Role } from '@/typeorm/Entities/Role';
import { produceRole } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';

const _rolesFind = jest
  .spyOn(AppDataSource.getRepository(Role), 'find')
  .mockImplementation(async () => [produceRole()]);
const _rolesSave = jest
  .spyOn(AppDataSource.getRepository(Role), 'save')
  .mockImplementation(async (role: DeepPartial<Role> & Role) => role);
const _rolesUpdate = jest
  .spyOn(AppDataSource.getRepository(Role), 'update')
  .mockImplementation(async (id, role) => ({ raw: {}, generatedMaps: [role], affected: 1 }));
const _rolesRemove = jest
  .spyOn(AppDataSource.getRepository(Role), 'remove')
  .mockImplementation(async (role) => role);

const _roleFindOne = jest
  .spyOn(AppDataSource.getRepository(Role), 'findOne')
  .mockImplementation(async () => produceRole());

describe('UNIT - Admin roles services', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getRoles', () => {
    it('should get all roles', async () => {
      const roles = await rolesServices.getRoles({});
      expect(_rolesFind).toHaveBeenCalledTimes(1);
      expect(Array.isArray(roles)).toBe(true);
    });
  });

  describe('getRoleByName', () => {
    it('should get a single role by name', async () => {
      const role = await rolesServices.getRoleByName('TEST');
      expect(role).toBeDefined();
    });
  });

  describe('addRole', () => {
    it('should save a role and return it', async () => {
      _roleFindOne.mockResolvedValueOnce(null);
      const role = produceRole();
      const ret = await rolesServices.addRole(role);
      expect(_rolesSave).toHaveBeenCalledTimes(1);
      expect(role.Id).toBe(ret.Id);
    });
    it('should reject if one exists', async () => {
      const role = produceRole();
      expect(async () => await rolesServices.addRole(role)).rejects.toThrow();
    });
  });

  describe('updateRole', () => {
    it('should update a role and return it', async () => {
      const role = produceRole();
      const ret = await rolesServices.updateRole(role);
      expect(_rolesUpdate).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(role.Id);
    });
    it('should update a role and return it', async () => {
      const role = produceRole();
      _rolesUpdate.mockImplementationOnce(async () => ({
        affected: 0,
        raw: {},
        generatedMaps: [],
      }));
      expect(async () => await rolesServices.updateRole(role)).rejects.toThrow();
    });
  });

  describe('removeRole', () => {
    it('remove a role and return it', async () => {
      const role = produceRole();
      const ret = await rolesServices.removeRole(role);
      expect(_rolesRemove).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(role.Id);
    });
    it('remove a role and return it', async () => {
      const role = produceRole();
      _roleFindOne.mockResolvedValueOnce(null);
      expect(async () => await rolesServices.removeRole(role)).rejects.toThrow();
    });
  });
});
