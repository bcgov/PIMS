import { AppDataSource } from '@/appDataSource';
import rolesServices from '@/services/admin/rolesServices';
import { Roles } from '@/typeorm/Entities/Roles';
import { produceRole } from 'tests/testUtils/factories';
import { DeepPartial } from 'typeorm';

const _rolesFind = jest
  .spyOn(AppDataSource.getRepository(Roles), 'find')
  .mockImplementation(async () => [produceRole()]);
const _rolesSave = jest
  .spyOn(AppDataSource.getRepository(Roles), 'save')
  .mockImplementation(async (role: DeepPartial<Roles> & Roles) => role);
const _rolesUpdate = jest
  .spyOn(AppDataSource.getRepository(Roles), 'update')
  .mockImplementation(async (id, role) => ({ raw: {}, generatedMaps: [role] }));
const _rolesRemove = jest
  .spyOn(AppDataSource.getRepository(Roles), 'remove')
  .mockImplementation(async (role) => role);

describe('UNIT - Admin roles services', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getRoles', () => {
    it('should get all roles', async () => {
      const roles = await rolesServices.getRoles({});
      expect(_rolesFind).toHaveBeenCalledTimes(1);
      expect(Array.isArray(roles)).toBe(true);
    });
  });

  describe('addRole', () => {
    it('should save a role and return it', async () => {
      const role = produceRole();
      const ret = await rolesServices.addRole(role);
      expect(_rolesSave).toHaveBeenCalledTimes(1);
      expect(role.Id).toBe(ret.Id);
    });
  });

  describe('updateRole', () => {
    it('should update a role and return it', async () => {
      const role = produceRole();
      const ret = await rolesServices.updateRole(role);
      expect(_rolesUpdate).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(role.Id);
    });
  });

  describe('removeRole', () => {
    it('remove a role and return it', async () => {
      const role = produceRole();
      const ret = await rolesServices.removeRole(role);
      expect(_rolesRemove).toHaveBeenCalledTimes(1);
      expect(ret.Id).toBe(role.Id);
    });
  });
});
