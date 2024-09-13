import { IKeycloakUser, IKeycloakUsersResponse } from '@/services/keycloak/IKeycloakUser';
import { keycloakUserSchema } from '@/services/keycloak/keycloakSchemas';
import { getIDIRUsers, getBothBCeIDUser, IDIRUserQuery } from '@bcgov/citz-imb-kc-css-api';

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

const KeycloakService = {
  getKeycloakUser,
  getKeycloakUsers,
};

export default KeycloakService;
