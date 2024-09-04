import { User, UserStatus } from '@/typeorm/Entities/User';
import { AppDataSource } from '@/appDataSource';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { DeepPartial, FindOptionsOrderValue, In } from 'typeorm';
import { Agency } from '@/typeorm/Entities/Agency';
import { randomUUID, UUID } from 'crypto';
import KeycloakService from '@/services/keycloak/keycloakService';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { UserFiltering } from '@/controllers/users/usersSchema';

interface NormalizedKeycloakUser {
  first_name: string;
  last_name: string;
  username: string;
  guid: string;
  email: string;
  display_name: string;
}

export const getUser = async (username: string): Promise<User | null> => {
  const user = await AppDataSource.getRepository(User).findOneBy({
    Username: username,
  });
  return user;
};

/**
 * Normalizes a Keycloak user object to a custom format.
 * @param kcUser - The Keycloak user object to be normalized.
 * @returns An object with normalized user properties including first name, last name, username, email, display name, and GUID.
 */
const normalizeKeycloakUser = (kcUser: SSOUser): NormalizedKeycloakUser => {
  const normalizeUuid = (keycloakUuid: string) =>
    keycloakUuid.toLowerCase().replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/g, '$1-$2-$3-$4-$5');
  return {
    first_name: kcUser.first_name,
    last_name: kcUser.last_name,
    username: kcUser.preferred_username,
    email: kcUser.email,
    display_name: kcUser.display_name,
    guid: normalizeUuid(kcUser.guid),
  };
};

/**
 * Adds a user from Keycloak to the system with 'OnHold' status.
 * @param ssoUser The Keycloak user to be added
 * @param agencyId The ID of the agency the user belongs to
 * @param position The position of the user
 * @param note Additional notes about the user
 * @returns The inserted user
 */
const addKeycloakUserOnHold = async (
  ssoUser: SSOUser,
  agencyId: number,
  position: string,
  note: string,
) => {
  if (agencyId == null) {
    throw new Error('Null argument.');
  }
  //Iterating through agencies and roles no longer necessary here?
  const normalizedKc = normalizeKeycloakUser(ssoUser);
  const systemUser = await AppDataSource.getRepository(User).findOne({
    where: { Username: 'system' },
  });
  const id = randomUUID();
  await AppDataSource.getRepository(User).insert({
    Id: id,
    FirstName: normalizedKc.first_name,
    LastName: normalizedKc.last_name,
    Email: normalizedKc.email,
    DisplayName: normalizedKc.display_name,
    KeycloakUserId: normalizedKc.guid,
    Username: normalizedKc.username,
    Status: UserStatus.OnHold,
    IsDisabled: false,
    AgencyId: agencyId,
    Position: position,
    Note: note,
    CreatedById: systemUser.Id,
    LastLogin: new Date(),
  });
  const newUser = await AppDataSource.getRepository(User).findOne({ where: { Id: id } });
  return newUser;
};

/**
 * Retrieves the IDs of agencies related to the user identified by the given username.
 * If the user does not exist, an empty array is returned.
 * @param {string} username - The username of the user to retrieve agencies for.
 * @returns {Promise<number[]>} An array containing the ID of the user's agency and the IDs of its children agencies.
 */
const getAgencies = async (username: string) => {
  const user = await getUser(username);

  if (!user) {
    return [];
  }

  const userAgencies = await AppDataSource.getRepository(User).findOneOrFail({
    relations: {
      Agency: true,
    },
    where: {
      Id: user.Id,
    },
  });
  const agencyId = userAgencies.Agency.Id;
  const children = await AppDataSource.getRepository(Agency).find({
    where: {
      ParentId: agencyId,
    },
  });
  return [agencyId, ...children.map((c) => c.Id)];
};

/**
 * Check if a user has all specified agencies.
 * @param {string} username - The username of the user to check.
 * @param {number[]} agencies - An array of agency IDs to check against.
 * @returns {Promise<boolean>} A boolean indicating whether the user has all specified agencies.
 */
const hasAgencies = async (username: string, agencies: number[]) => {
  const usersAgencies = await getAgencies(username);
  const result = agencies.every((id) => usersAgencies.includes(id));
  return result;
};

/**
 * Maps the sort key and direction to the corresponding object structure for TypeORM find options.
 * @param sortKey - The key to sort by.
 * @param sortDirection - The direction of sorting.
 * @returns The mapped object structure for TypeORM find options based on the provided sort key and direction.
 */
const sortKeyMapping = (sortKey: string, sortDirection: FindOptionsOrderValue) => {
  switch (sortKey) {
    case 'Agency':
      return { Agency: { Name: sortDirection } };
    case 'Role':
      return { Role: { Name: sortDirection } };
    default:
      return { [sortKey]: sortDirection };
  }
};

/**
 * Retrieves users based on the provided filtering criteria.
 * @param filter - The filtering criteria to apply when fetching users.
 * @returns A list of users matching the specified criteria.
 */
const getUsers = async (filter: UserFiltering) => {
  const users = await AppDataSource.getRepository(User).find({
    relations: {
      Agency: true,
      Role: true,
    },
    where: {
      Id: filter.id,
      Username: filter.username,
      DisplayName: filter.displayName,
      LastName: filter.lastName,
      Email: filter.email,
      KeycloakUserId: filter.guid,
      AgencyId: filter.agencyId
        ? In(typeof filter.agencyId === 'number' ? [filter.agencyId] : filter.agencyId)
        : undefined,
      Agency: {
        Name: filter.agency,
      },
      Role: {
        Name: filter.role,
      },
      Position: filter.position,
    },
    take: filter.quantity,
    skip: (filter.page ?? 0) * (filter.quantity ?? 0),
    order: sortKeyMapping(filter.sortKey, filter.sortOrder as FindOptionsOrderValue),
  });
  return users;
};

/**
 * Retrieves a user by their ID from the database.
 * @param id - The ID of the user to retrieve.
 * @returns A promise that resolves to the user object with associated Agency and Role.
 */
const getUserById = async (id: string) => {
  return AppDataSource.getRepository(User).findOne({
    relations: {
      Agency: true,
      Role: true,
    },
    where: {
      Id: id as UUID,
    },
  });
};

/**
 * Adds a new user to the database.
 * @param {User} user - The user object to be added.
 * @returns {Promise<User>} The user object that was added.
 * @throws {ErrorWithCode} Throws an error if the user already exists in the database.
 */
const addUser = async (user: User) => {
  const resource = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  if (resource) {
    throw new ErrorWithCode('Resource already exists.', 409);
  }
  const retUser = await AppDataSource.getRepository(User).save(user);
  return retUser;
};

/**
 * Updates a user's information in the database and optionally updates the user's role in Keycloak.
 * @param user - The partial user object containing the updated information.
 * @returns {Promise<User>} The updated user object with the new display name.
 * @throws {ErrorWithCode} If the user resource does not exist in the database.
 */
const updateUser = async (user: DeepPartial<User>) => {
  const roleName = user.Role?.Name;
  const resource = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  if (!resource) {
    throw new ErrorWithCode('Resource does not exist.', 404);
  }
  await AppDataSource.getRepository(User).update(user.Id, {
    ...user,
    DisplayName: `${user.LastName}, ${user.FirstName}`,
  });
  if (roleName) {
    await KeycloakService.updateKeycloakUserRoles(resource.Username, [roleName]);
  }
  const retUser = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  return retUser;
};

/**
 * Deletes a user from the database.
 * @param user - The user to be deleted.
 * @returns {Promise<User>} The deleted user.
 * @throws {ErrorWithCode} Error if the user does not exist.
 */
const deleteUser = async (user: User) => {
  const resource = await AppDataSource.getRepository(User).findOne({ where: { Id: user.Id } });
  if (!resource) {
    throw new ErrorWithCode('Resource does not exist.', 404);
  }
  const retUser = await AppDataSource.getRepository(User).remove(user);
  return retUser;
};

/**
 * Asynchronously retrieves roles from Keycloak using the KeycloakService.
 * @returns {Promise<string[]>} An array of role names.
 */
const getKeycloakRoles = async () => {
  const roles = await KeycloakService.getKeycloakRoles();
  return roles.map((a) => a.name);
};

/**
 * Retrieves the roles of a user from Keycloak.
 * @param {string} username - The username of the user to retrieve roles for.
 * @returns {Promise<string[]>} An array of role names associated with the user.
 */
const getKeycloakUserRoles = async (username: string) => {
  const keycloakRoles = await KeycloakService.getKeycloakUserRoles(username);
  return keycloakRoles.map((a) => a.name);
};

/**
 * Updates the roles of a user in Keycloak.
 * @param {string} username - The username of the user whose roles are to be updated.
 * @param {string[]} roleNames - An array of role names to assign to the user.
 * @returns {Promise<string[]>} An array of role names assigned to the user after the update.
 */
const updateKeycloakUserRoles = async (username: string, roleNames: string[]) => {
  const keycloakRoles = await KeycloakService.updateKeycloakUserRoles(username, roleNames);
  await KeycloakService.syncKeycloakUser(username);
  return keycloakRoles.map((a) => a.name);
};

const userServices = {
  getUser,
  addKeycloakUserOnHold,
  hasAgencies,
  getAgencies,
  normalizeKeycloakUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getKeycloakRoles,
  getKeycloakUserRoles,
  updateKeycloakUserRoles,
  getUserById,
};

export default userServices;
