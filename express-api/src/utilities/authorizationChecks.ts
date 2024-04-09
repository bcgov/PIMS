import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { Roles } from '@/constants/roles';
import { getUser } from '@/services/users/usersServices';
/**
 * @description Function to check if user is an admin
 * @param {KeycloakUser}     user Incoming Keycloak user.
 * @returns {boolean}      A boolean for whether admin or not.
 */
export const isAdmin = (user: KeycloakUser): boolean => {
  // Check if the user has the ADMIN role
  return user.client_roles?.includes(Roles.ADMIN);
};

/**
 * Function to check if user is an auditor (view only role).
 *
 * @param {KeycloakUser} user - The user object containing information about the user.
 * @returns True if the user has the AUDITOR role, false otherwise.
 */
export const isAuditor = (user: KeycloakUser): boolean => {
  // Check if the user has the AUDITOR role
  return user.client_roles?.includes(Roles.AUDITOR);
};

/**
 * Function to check if user can edit.
 *
 * @param user - The user object containing information about the user.
 * @returns A boolean value indicating whether the user can edit or not.
 */
export const canUserEdit = (user: KeycloakUser): boolean => {
  // as they are not an auditor the user can edit
  return (
    user.client_roles?.includes(Roles.GENERAL_USER) || user.client_roles?.includes(Roles.ADMIN)
  );
};

/**
 * Function to check if the user in PIMS is disabled.
 *
 * @param kcUser - The KeycloakUser object representing the user.
 * @returns A Promise that resolves to a boolean indicating whether the user is disabled.
 */
export const isUserDisabled = async (kcUser: KeycloakUser): Promise<boolean> => {
  const user = await getUser(kcUser.preferred_username);
  return user.IsDisabled;
};

/**
 * Function to check if the user in PIMS is active.
 *
 * @param kcUser - The KeycloakUser object representing the user.
 * @returns A Promise that resolves to a boolean indicating if the user is active.
 */
export const isUserActive = async (kcUser: KeycloakUser): Promise<boolean> => {
  const user = await getUser(kcUser.preferred_username);
  return user.Status === 'Active';
};
