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

  describe('addRole', () => {
    it('should save a role and return it', async () => {
      _roleFindOne.mockResolvedValueOnce(null);
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
