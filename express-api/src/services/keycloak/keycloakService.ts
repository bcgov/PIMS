import { IKeycloakErrorResponse } from '@/services/keycloak/IKeycloakErrorResponse';
import { IKeycloakRole, IKeycloakRolesResponse } from '@/services/keycloak/IKeycloakRole';
import { IKeycloakUser, IKeycloakUsersResponse } from '@/services/keycloak/IKeycloakUser';
import {
  keycloakRoleSchema,
  keycloakUserRolesSchema,
  keycloakUserSchema,
} from '@/services/keycloak/keycloakSchemas';
import logger from '@/utilities/winstonLogger';

import {
  getRoles,
  getRole,
  updateRole,
  createRole,
  getIDIRUsers,
  getBothBCeIDUser,
  getUserRoles,
  assignUserRoles,
  unassignUserRole,
  IDIRUserQuery,
} from '@bcgov/citz-imb-kc-css-api';
import rolesServices from '@/services/roles/rolesServices';
import { randomUUID } from 'crypto';
import { AppDataSource } from '@/appDataSource';
import { DeepPartial, In, Not } from 'typeorm';
import userServices from '@/services/users/usersServices';
import { Role } from '@/typeorm/Entities/Role';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';
import { User } from '@/typeorm/Entities/User';

/**
 * @description Sync keycloak roles into PIMS roles.
 */
const syncKeycloakRoles = async () => {
  // Gets roles from keycloak
  // For each role
  // If role is in PIMS, update it
  // If not in PIMS, add it
  // If PIMS has roles that aren't in Keycloak, remove them.
  const systemUser = await userServices.getUsers({ username: 'system' });
  if (systemUser?.length !== 1) {
    throw new ErrorWithCode('System user was missing.', 500);
  }
  const systemId = systemUser[0].Id;
  const roles = await KeycloakService.getKeycloakRoles();
  for (const role of roles) {
    const internalRole = await rolesServices.getRoles({ name: role.name });
    if (internalRole.length == 0) {
      const newRole: Role = {
        Id: randomUUID(),
        Name: role.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: null,
        Description: undefined,
        IsPublic: false,
        CreatedById: systemId,
        CreatedBy: undefined,
        CreatedOn: undefined,
        UpdatedById: undefined,
        UpdatedBy: undefined,
        UpdatedOn: undefined,
        Users: [],
      };
      await rolesServices.addRole(newRole);
    } else {
      const overwriteRole: DeepPartial<Role> = {
        Id: internalRole[0].Id,
        Name: role.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: null,
        Description: undefined,
        IsPublic: false,
        CreatedById: undefined,
        CreatedOn: undefined,
        UpdatedById: systemId,
        UpdatedOn: new Date(),
      };
      await rolesServices.updateRole(overwriteRole);
    }
  }
  //This deletion section is somewhat clunky. Could consider delete cascade on the schema to avoid some of this.
  const internalRolesForDeletion = await AppDataSource.getRepository(Role).findBy({
    Name: Not(In(roles.map((a) => a.name))),
  });

  if (internalRolesForDeletion.length) {
    const roleIdsForDeletion = internalRolesForDeletion.map((role) => role.Id);
    await AppDataSource.getRepository(User)
      .createQueryBuilder()
      .update(User)
      .set({ RoleId: null })
      .where('RoleId IN (:...ids)', { ids: roleIdsForDeletion })
      .execute();
    await AppDataSource.getRepository(Role).delete({
      Id: In(roleIdsForDeletion),
    });
  }
  return roles;
};

/**
 * @description Fetch a list of groups from Keycloak and their associated role within PIMS
 * @returns {IKeycloakRoles[]}  A list of roles from Keycloak.
 */
const getKeycloakRoles = async () => {
  try {
    // Get roles available in Keycloak
    const keycloakRoles: IKeycloakRolesResponse = await getRoles();
    // Return the list of roles
    return keycloakRoles.data;
  } catch (e) {
    throw new ErrorWithCode('Something went wrong getting Keycloak roles.');
  }
};

/**
 * @description Get information on a single Keycloak role from the role name.
 * @param   {string}   roleName String name of role in Keycloak
 * @returns {IKeycloakRole}  A single role object.
 * @throws If the role does not exist in Keycloak.
 */
const getKeycloakRole = async (roleName: string) => {
  // Get single role
  const response: IKeycloakRole | IKeycloakErrorResponse = await getRole(roleName);
  // Did the role exist? If not, it will be of type IKeycloakErrorResponse.
  if (!keycloakRoleSchema.safeParse(response).success) {
    const message = `keycloakService.getKeycloakRole: ${
      (response as IKeycloakErrorResponse).message
    }`;
    logger.warn(message);
    throw new Error(message);
  }
  // Return role info
  return response;
};

/**
 * @description Update a role that exists in Keycloak. Create it if it does not exist.
 * @param   {string}   roleName String name of role in Keycloak
 * @param   {string}   newRoleName The name to change the role name to.
 * @returns {IKeycloakRole} The updated role information. Existing role info if cannot be updated.
 * @throws  {Error} If the newRoleName already exists.
 */
const updateKeycloakRole = async (roleName: string, newRoleName: string) => {
  const roleWithNameAlready: IKeycloakRole = await getRole(newRoleName);
  // If it already exists, log the error and return existing role
  if (keycloakRoleSchema.safeParse(roleWithNameAlready).success) {
    const message = `keycloakService.updateKeycloakRole: Role ${newRoleName} already exists`;
    logger.warn(message);
    throw new Error(message);
  }
  const response: IKeycloakRole = await getRole(roleName);
  // Did the role to be changed exist? If not, it will be of type IKeycloakErrorResponse.
  let role: IKeycloakRole;
  if (keycloakRoleSchema.safeParse(response).success) {
    // Already existed. Update the role.
    role = await updateRole(roleName, newRoleName);
  } else {
    // Didn't exist already. Add the role.
    role = await createRole(newRoleName);
  }

  // Return role info
  return role;
};

const syncKeycloakUser = async (username: string) => {
  const users = await userServices.getUsers({ username: username });
  if (users?.length !== 1) {
    throw new ErrorWithCode('User not found in database during Keycloak role sync.', 404);
  }
  const user = users[0];
  // Get existing keycloak roles.
  const kroles = await KeycloakService.getKeycloakUserRoles(user.Username);
  if (kroles.length > 1) {
    logger.warn(
      `User ${user.Username} was assigned multiple roles in Keycloak. This is not fully supported internally. A single role will be assigned arbitrarily.`,
    );
  }
  const krole = kroles?.[0];
  if (krole) {
    // If keycloak role, update database role.
    const internalRole = await rolesServices.getRoleByName(krole.name);
    await userServices.updateUser({ Id: user.Id, RoleId: internalRole.Id });
  } else if (user.RoleId != null) {
    // If no keycloak role, but database role present, set keycloak role
    logger.info(
      `User ${user.Username} has no roles in Keycloak. Back-populating Keycloak from database.`,
    );
    // Role is also joined here. Use role name to update Keycloak.
    await KeycloakService.updateKeycloakUserRoles(user.Username, [user.Role.Name]);
  } else {
    logger.warn(`User ${user.Username} has no roles in database or Keycloak.`);
  }

  // If no keycloak role and no database roll, do nothing.

  return userServices.getUserById(user.Id);
};

/**
 * @description Retrieves Keycloak users based on the provided filter.
 * @param {IKeycloakUsersFilter} filter The filter to apply when retrieving users.
 * @returns {IKeycloakUser[]} A list of Keycloak users.
 */
const getKeycloakUsers = async (filter: IDIRUserQuery) => {
  // Get all users from Keycloak for IDIR
  // CSS API returns an empty list if no match.
  let users: IKeycloakUser[] = ((await getIDIRUsers(filter)) as IKeycloakUsersResponse).data;
  // Add BCeID if GUID was included.
  if (filter.guid) {
    users = users.concat(((await getBothBCeIDUser(filter.guid)) as IKeycloakUsersResponse).data);
  }
  // Return list of users
  return users;
};

/**
 * @description Retrieves a Keycloak user that matches the provided guid.
 * @param {string} guid The guid of the desired user.
 * @returns {IKeycloakUser} A single Keycloak user.
 * @throws If the user is not found.
 */
const getKeycloakUser = async (guid: string) => {
  // Should be by guid. Only way to guarantee uniqueness.
  const user: IKeycloakUser = (await getKeycloakUsers({ guid: guid }))?.at(0);
  if (keycloakUserSchema.safeParse(user).success) {
    // User found
    return user;
  } else {
    // User not found
    throw new Error(`keycloakService.getKeycloakUser: User ${guid} not found.`);
  }
};

/**
 * @description Retrieves a Keycloak user's roles.
 * @param {string} username The user's username.
 * @returns {IKeycloakRole[]} A list of the user's roles.
 * @throws If the user is not found.
 */
const getKeycloakUserRoles = async (username: string): Promise<IKeycloakRole[]> => {
  const existingRolesResponse: IKeycloakRolesResponse | IKeycloakErrorResponse =
    await getUserRoles(username);

  if (!keycloakUserRolesSchema.safeParse(existingRolesResponse).success) {
    const message = `keycloakService.getKeycloakUserRoles: ${(existingRolesResponse as IKeycloakErrorResponse).message}`;
    logger.warn(message);
    throw new Error(message);
  }
  // Ensure the response always returns an array of roles
  return (existingRolesResponse as IKeycloakRolesResponse).data || [];
};

/**
 * @description Updates a user's roles in Keycloak.
 * @param {string} username The user's username.
 * @param {string[]} roles A list of roles that the user should have.
 * @returns {IKeycloakRole[]} A list of the updated Keycloak roles.
 * @throws If the user does not exist.
 */
const updateKeycloakUserRoles = async (username: string, roles: string[]) => {
  try {
    const existingRolesResponse = await getKeycloakUserRoles(username);

    // User is found in Keycloak, so map roles to just the names.
    const existingRoles: string[] = existingRolesResponse.map((role) => role.name);

    // Find roles that are in Keycloak but are not in new user info.
    const rolesToRemove = existingRoles.filter((existingRole) => !roles.includes(existingRole));
    // Remove old roles
    // No call to remove all as list, so have to loop.
    rolesToRemove.forEach(async (role) => {
      await unassignUserRole(username, role);
    });

    // Find new roles that aren't in Keycloak already.
    const rolesToAdd = roles.filter((newRole) => !existingRoles.includes(newRole));
    // Add new roles
    const updatedRoles: IKeycloakRolesResponse = await assignUserRoles(username, rolesToAdd);

    // Return updated list of roles
    return updatedRoles.data;
  } catch (e: unknown) {
    const message = `keycloakService.updateKeycloakUserRoles: ${
      (e as IKeycloakErrorResponse).message
    }`;
    logger.warn(message);
    throw new ErrorWithCode(
      `Failed to update user ${username}'s Keycloak roles. User's Keycloak account may not be active.`,
      500,
    );
  }
};

const KeycloakService = {
  getKeycloakUserRoles,
  syncKeycloakRoles,
  getKeycloakRole,
  getKeycloakRoles,
  updateKeycloakRole,
  syncKeycloakUser,
  getKeycloakUser,
  getKeycloakUsers,
  updateKeycloakUserRoles,
};

export default KeycloakService;
