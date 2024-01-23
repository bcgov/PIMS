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
import rolesServices from '../admin/rolesServices';
import { Roles } from '@/typeorm/Entities/Roles';
import { randomUUID } from 'crypto';
import { AppDataSource } from '@/appDataSource';
import { In, Not } from 'typeorm';

/**
 * @description Sync keycloak roles into PIMS roles.
 */
// TODO: Complete when role service is complete.
const syncKeycloakRoles = async () => {
  // Gets roles from keycloak
  // For each role
  // If role is in PIMS, update it
  // If not in PIMS, add it
  // If PIMS has roles that aren't in Keycloak, remove them.
  const roles = await KeycloakService.getKeycloakRoles();
  for (const role of roles) {
    const internalRole = await rolesServices.getRoles({ name: role.name });

    if (internalRole.length == 0) {
      const newRole: Roles = {
        Id: randomUUID(),
        Name: role.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: role.id,
        Description: '',
        IsPublic: false,
        Users: [],
        Claims: [],
        CreatedById: undefined,
        CreatedOn: undefined,
        UpdatedById: undefined,
        UpdatedOn: undefined,
      };
      rolesServices.addRole(newRole);
    } else {
      const overwriteRole: Roles = {
        Id: internalRole[0].Id,
        Name: role.name,
        IsDisabled: false,
        SortOrder: 0,
        KeycloakGroupId: role.id,
        Description: '',
        IsPublic: false,
        Users: [],
        Claims: [],
        CreatedById: undefined,
        CreatedOn: undefined,
        UpdatedById: undefined,
        UpdatedOn: undefined,
      };
      rolesServices.updateRole(overwriteRole);
    }

    await AppDataSource.getRepository(Roles).delete({
      Name: Not(In(roles.map((a) => a.name))),
    });

    return roles;
  }
};

/**
 * @description Fetch a list of groups from Keycloak and their associated role within PIMS
 * @returns {IKeycloakRoles[]}  A list of roles from Keycloak.
 */
const getKeycloakRoles = async () => {
  // Get roles available in Keycloak
  const keycloakRoles: IKeycloakRolesResponse = await getRoles();
  // Return the list of roles
  return keycloakRoles.data;
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

// TODO: Complete when user and role services are complete.
const syncKeycloakUser = async () => {
  // Does user exist in Keycloak?
  // Get their existing roles.
  // Does user exist in PIMS
  // If user exists in PIMS...
  // Update the roles in PIMS to match their Keycloak roles
  // If they don't exist in PIMS...
  // Add user and assign their roles
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

const getKeycloakUserRoles = async (username: string) => {
  const existingRolesResponse: IKeycloakRolesResponse | IKeycloakErrorResponse =
    await getUserRoles(username);
  if (!keycloakUserRolesSchema.safeParse(existingRolesResponse).success) {
    const message = `keycloakService.updateKeycloakUserRoles: ${
      (existingRolesResponse as IKeycloakErrorResponse).message
    }`;
    logger.warn(message);
    throw new Error(message);
  }
  return (existingRolesResponse as IKeycloakRolesResponse).data;
};

/**
 * @description Updates a user's roles in Keycloak.
 * @param {string} username The user's username.
 * @param {string[]} roles A list of roles that the user should have.
 * @returns {IKeycloakRole[]} A list of Keycloak roles.
 * @throws If the user does not exist.
 */
const updateKeycloakUserRoles = async (username: string, roles: string[]) => {
  const existingRolesResponse = await getKeycloakUserRoles(username);

  // User is found in Keycloak.
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
