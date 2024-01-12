import { IKeycloakErrorResponse } from '@/services/keycloak/IKeycloakErrorResponse';
import { IKeycloakRole, IKeycloakRolesResponse } from '@/services/keycloak/IKeycloakRole';
import { IKeycloakUser, IKeycloakUsersResponse } from '@/services/keycloak/IKeycloakUser';
import { keycloakRoleSchema, keycloakUserRolesSchema } from '@/services/keycloak/keycloakSchemas';
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
} from '@bcgov/citz-imb-kc-css-api';
import { z } from 'zod';

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
 */
const getKeycloakRole = async (roleName: string) => {
  // Get single role
  const response: IKeycloakRole | IKeycloakErrorResponse = await getRole(roleName);
  // Did the role exist? If not, it will be of type IKeycloakErrorResponse.
  if (!keycloakRoleSchema.safeParse(response).success) {
    logger.warn(`keycloakService.getKeycloakRole: ${(response as IKeycloakErrorResponse).message}`);
    return undefined;
  }
  // Return role info
  return response;
};

/**
 * @description Update a role that exists in Keycloak. Create it if it does not exist.
 * @param   {string}   roleName String name of role in Keycloak
 * @param   {string}   newRoleName The name to change the role name to.
 * @returns {IKeycloakRole} The updated role information.
 */
const updateKeycloakRole = async (roleName: string, newRoleName: string) => {
  const response: IKeycloakRole = await getRole(roleName);
  // Did the role exist? If not, it will be of type IKeycloakErrorResponse.
  let role: IKeycloakRole;
  if (keycloakRoleSchema.safeParse(response).success) {
    // Already existed. Update the role.
    role = await updateRole(roleName, newRoleName);
  } else {
    // Didn't exist already. Add the role.
    role = await createRole(newRoleName);
    // If it already exists, log the error and return existing role
    if (!keycloakRoleSchema.safeParse(role).success) {
      logger.warn(
        `Failed to create role. ${
          (JSON.parse(role as unknown as string) as IKeycloakErrorResponse).message
        }`,
      );
      return await getRole(newRoleName);
    }
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

interface IKeycloakUsersFilter {
  lastName?: string;
  firstName: string; // Currently required. Asked for changes in CSS repo.
  email?: string;
  guid?: string;
}
const getKeycloakUsers = async (filter: IKeycloakUsersFilter) => {
  // Get all users from Keycloak for IDIR
  // CSS API returns an empty list if no match.
  const users: IKeycloakUser[] = ((await getIDIRUsers(filter)) as IKeycloakUsersResponse).data;
  // Add BCeID if GUID was included.
  if (filter.guid) {
    users.concat(((await getBothBCeIDUser(filter.guid)) as IKeycloakUsersResponse).data);
  }
  // Return list of users
  return users;
};

const getKeycloakUser = (guidOrEmail: string) => {
  // Should be by ID or email. Only way to guarantee uniqueness.
  const emailSchema = z.string().email();
  if (emailSchema.safeParse(guidOrEmail).success) {
    return getKeycloakUsers({ email: guidOrEmail, firstName: '' }); // TODO: Remove firstName after fix is applied to package.
  } else {
    return getKeycloakUsers({ guid: guidOrEmail, firstName: '' }); // TODO: Remove firstName after fix is applied to package.
  }
};

const updateKeycloakUserRoles = async (username: string, roles: string[]) => {
  const existingRolesResponse: IKeycloakRolesResponse | IKeycloakErrorResponse =
    await getUserRoles(username);
  // Did that user exist? If not, it will be of type IKeycloakErrorResponse.
  if (!keycloakUserRolesSchema.safeParse(existingRolesResponse).success) {
    logger.warn(
      `keycloakService.updateKeycloakUserRoles: ${
        (existingRolesResponse as IKeycloakErrorResponse).message
      }`,
    );
    return undefined;
  }

  // User is found in Keycloak.
  const existingRoles: string[] = (existingRolesResponse as IKeycloakRolesResponse).data.map(
    (role) => role.name,
  );

  // Find roles that are in Keycloak but are not in new user info.
  const rolesToRemove = existingRoles.filter((existingRole) => !roles.includes(existingRole));
  // Remove old roles
  // No call to remove all as list, so have to loop.
  rolesToRemove.forEach(async (role) => {
    await unassignUserRole(username, role);
  });

  // Find new roles that aren't in Keycloak already.
  const rolesToAdd = roles.filter((newrole) => !existingRoles.includes(newrole));
  // Add new roles
  // FIXME: There's a bug with the package code here. I've opened an issue. Might open a PR just to get it through.
  const updatedRoles: IKeycloakRolesResponse = await assignUserRoles(username, rolesToAdd);

  // Return updated list of roles
  return updatedRoles.data;
};

const KeycloakService = {
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
