import { AppDataSource } from '@/appDataSource';
import { RolesFilter } from '../../controllers/admin/roles/rolesSchema';
import { DeepPartial } from 'typeorm';
import { Roles } from '@/typeorm/Entities/Users_Roles_Claims';
import { UUID } from 'crypto';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

const getRoles = async (filter: RolesFilter) => {
  const roles = AppDataSource.getRepository(Roles).find({
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
  return AppDataSource.getRepository(Roles).findOne({
    where: { Id: roleId },
  });
};

const addRole = async (role: Roles) => {
  const existing = await getRoleById(role.Id);
  if (existing) {
    throw new ErrorWithCode('Role already exists', 409);
  }
  const retRole = AppDataSource.getRepository(Roles).save(role);
  return retRole;
};

const updateRole = async (role: DeepPartial<Roles>) => {
  const retRole = await AppDataSource.getRepository(Roles).update(role.Id, role);
  if (!retRole.affected) {
    throw new ErrorWithCode('Role was not found.', 404);
  }
  return retRole.generatedMaps[0];
};

const removeRole = async (role: Roles) => {
  const existing = await getRoleById(role.Id);
  if (!existing) {
    throw new ErrorWithCode('Role was not found.', 404);
  }
  const retRole = AppDataSource.getRepository(Roles).remove(role);
  return retRole;
};

const rolesServices = {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  removeRole,
};

export default rolesServices;
