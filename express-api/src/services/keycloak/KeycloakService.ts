import { IKeycloakErrorResponse } from '@/services/keycloak/IKeycloakErrorResponse';
import { IKeycloakRole, IKeycloakRolesResponse } from '@/services/keycloak/IKeycloakRole';
import { keycloakRoleSchema } from '@/services/keycloak/keycloakSchemas';
import logger from '@/utilities/winstonLogger';

import { getRoles, getRole, updateRole, createRole } from '@bcgov/citz-imb-kc-css-api';

/**
 * @description Sync keycloak roles into PIMS roles.
 */
const syncKeycloakRoles = async () => {
  // TODO: Implement after typeorm entities exist
  // Gets groups from keycloak
  // For each group, gets associated roles
  // If role is in PIMS, update it
  // If not in PIMS, add it
  // If PIMS has roles that aren't in Keycloak, remove them.
};

/**
 * @description Fetch a list of groups from Keycloak and their associated role within PIMS
 * @returns {IKeycloakRolesResponse}  A list of roles from Keycloak.
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
    logger.warn(`KeycloakService.getKeycloakRole: ${(response as IKeycloakErrorResponse).message}`);
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
  const response = await getRole(roleName);
  // Did the role exist? If not, it will be of type IKeycloakErrorResponse.
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

const syncKeycloakUsers = async () => {
  // TODO: Implement after typeorm entities exist
  // Get users from Keycloak
  // For each user
  // If they don't exist in PIMS, insert them with their Keycloak roles
  // If they do, update their PIMS info
};

interface IKeycloakUsersFilter {
  lastName: string;
  firstName: string;
  email: string;
  guid: string;
}
const getKeycloakUsers = async (filter: IKeycloakUsersFilter) => {
  // Get all users from Keycloak, need to repeat for BCeID and IDIR
  // Return list of users
};

const getKeycloakUser = async (guidOrEmail: string) => {
  // Should be by ID or email. Only way to guarantee uniqueness.
  // Check both IDIR and BCeID.
  // Return user info
};

const updateKeycloakUserRoles = async (roles: IKeycloakRole[]) => {
  // Find roles new roles that aren't in Keycloak already.
  // Find roles that are in Keycloak but are not in new user info.
  // Add new roles
  // Remove old roles
  // Return updated list of roles
};

const KeycloakService = {
  syncKeycloakRoles,
  getKeycloakRole,
  getKeycloakRoles,
  updateKeycloakRole,
  syncKeycloakUsers,
  getKeycloakUser,
  getKeycloakUsers,
  updateKeycloakUserRoles,
};

export default KeycloakService;
