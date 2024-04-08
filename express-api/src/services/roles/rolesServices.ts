import { AppDataSource } from '@/appDataSource';
import { RolesFilter } from '../../controllers/roles/rolesSchema';
import { DeepPartial } from 'typeorm';
import { Role } from '@/typeorm/Entities/Role';
import { UUID } from 'crypto';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const getRoles = async (filter: RolesFilter) => {
  const roles = AppDataSource.getRepository(Role).find({
    where: {
      Name: filter.name,
      Id: filter.id,
    },
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    take: filter.quantity,
  });
  return roles;
};

const getRoleById = async (roleId: UUID) => {
  return AppDataSource.getRepository(Role).findOne({
    where: { Id: roleId },
  });
};

const getRoleByName = async (roleName: string) => {
  return AppDataSource.getRepository(Role).findOne({
    where: { Name: roleName },
  });
};

const addRole = async (role: Role) => {
  const existing = await getRoleById(role.Id);
  if (existing) {
    throw new ErrorWithCode('Role already exists', 409);
  }
  const retRole = AppDataSource.getRepository(Role).save(role);
  return retRole;
};

const updateRole = async (role: DeepPartial<Role>) => {
  const retRole = await AppDataSource.getRepository(Role).update(role.Id, role);
  if (!retRole.affected) {
    throw new ErrorWithCode('Role was not found.', 404);
  }
  return retRole.generatedMaps[0];
};

const removeRole = async (role: Role) => {
  const existing = await getRoleById(role.Id);
  if (!existing) {
    throw new ErrorWithCode('Role was not found.', 404);
  }
  const retRole = AppDataSource.getRepository(Role).remove(role);
  return retRole;
};

const rolesServices = {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  removeRole,
  getRoleByName,
};

export default rolesServices;
