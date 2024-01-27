import { AppDataSource } from '@/appDataSource';
import { RolesFilter } from '../../controllers/admin/roles/rolesSchema';
import { DeepPartial } from 'typeorm';
import { Roles } from '@/typeorm/Entities/Users_Agencies_Roles_Claims';

const getRoles = async (filter: RolesFilter) => {
  const roles = AppDataSource.getRepository(Roles).find({
    relations: {
      RoleClaims: { Claim: true },
    },
    where: {
      Name: filter.name,
      Id: filter.id,
    },
    skip: filter.page,
    take: filter.quantity,
  });
  return roles;
};

const addRole = async (role: Roles) => {
  const retRole = AppDataSource.getRepository(Roles).save(role);
  return retRole;
};

const updateRole = async (role: DeepPartial<Roles>) => {
  const retRole = await AppDataSource.getRepository(Roles).update(role.Id, role);
  return retRole.generatedMaps[0];
};

const removeRole = async (role: Roles) => {
  const retRole = AppDataSource.getRepository(Roles).remove(role);
  return retRole;
};

const rolesServices = {
  getRoles,
  addRole,
  updateRole,
  removeRole,
};

export default rolesServices;
