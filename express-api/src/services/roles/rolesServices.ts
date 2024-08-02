import { AppDataSource } from '@/appDataSource';
import { RolesFilter } from '../../controllers/roles/rolesSchema';
import { DeepPartial } from 'typeorm';
import { Role } from '@/typeorm/Entities/Role';
import { UUID } from 'crypto';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

/**
 * Collects and constructs find options based on the provided RolesFilter.
 * @param filter - The filter object containing criteria for finding roles.
 * @returns Role data matching filter.
 */
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

/**
 * @description Finds and returns a role with a given id.
 * @param {number} roleId Id of the role to retrieve.
 * @returns {Role} The found role or null.
 */
const getRoleById = async (roleId: UUID) => {
  return AppDataSource.getRepository(Role).findOne({
    where: { Id: roleId },
  });
};

/**
 * @description Finds and returns a role with a given name.
 * @param {number} roleName Id of the role to retrieve.
 * @returns {Role} The found role or null.
 */
const getRoleByName = async (roleName: string) => {
  return AppDataSource.getRepository(Role).findOne({
    where: { Name: roleName },
  });
};

/**
 * @description Creates a new role in the database.
 * @param {Role} role Information on role to be created.
 * @returns {Role} The added role
 * @throws ErrorWithCode if role already exists
 */
const addRole = async (role: Role) => {
  const existing = await getRoleById(role.Id);
  if (existing) {
    throw new ErrorWithCode('Role already exists', 409);
  }
  const retRole = AppDataSource.getRepository(Role).save(role);
  return retRole;
};

/**
 * @description Finds and updates a role with any changes.
 * @param {DeepPartial<Role>} role A deep partial role object used to update existing role.
 * @returns {Role} Status and information on updated role.
 */
const updateRole = async (role: DeepPartial<Role>) => {
  const retRole = await AppDataSource.getRepository(Role).update(role.Id, role);
  if (!retRole.affected) {
    throw new ErrorWithCode('Role was not found.', 404);
  }
  return retRole.generatedMaps[0];
};

/**
 * @description Finds and removes the given role.
 * @param {Role} role The roll to delete.
 * @returns {Result} The result of the remove action.
 */
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
