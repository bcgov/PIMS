import { IKeycloakRole } from "@/services/keycloak/IKeycloakRole";

/**
 * @description Sync keycloak roles into PIMS roles.
 */
const syncKeycloakRoles = async () => {
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
  // Return the list of roles
};

/**
 * @description Get information on a single Keycloak role from the role name.
 * @param   {string}   roleName String name of role in Keycloak
 * @returns {IKeycloakRole}  A single role object.
 */
const getKeycloakRole = async (roleName: string) => {
  // Get single role
  // Return role info
};

/**
 * @description Update a role that exists in Keycloak. Create it if it does not exist.
 * @param   {string}   roleName String name of role in Keycloak
 * @returns {IKeycloakRole} The updated role information.
 */
const updateKeycloakRole = async (roleName: string) => {
  // Does role exist?
  // Either add or update based on outcome
  // Return role info
};

const syncKeycloakUsers = async () => {
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
}

const getKeycloakUser = async (guidOrEmail: string) => {
  // Should be by ID or email. Only way to guarantee uniqueness.
  // Check both IDIR and BCeID.
  // Return user info
}

const updateKeycloakUserRoles = async (roles: IKeycloakRole[]) => {
  // Find roles new roles that aren't in Keycloak already.
  // Find roles that are in Keycloak but are not in new user info.
  // Add new roles
  // Remove old roles
  // Return updated list of roles
}

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
