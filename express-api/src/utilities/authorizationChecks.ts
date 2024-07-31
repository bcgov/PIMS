import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { Roles } from '@/constants/roles';
import userServices, { getUser } from '@/services/users/usersServices';
/**
 * @description Function to check if user is an admin
 * @param {SSOUser}     user Incoming Keycloak user.
 * @returns {boolean}      A boolean for whether admin or not.
 */
export const isAdmin = (user: SSOUser): boolean => {
  // Check if the user has the ADMIN role
  return user.client_roles?.includes(Roles.ADMIN);
};

/**
 * Function to check if user is an auditor (view only role).
 *
 * @param {SSOUser} user - The user object containing information about the user.
 * @returns True if the user has the AUDITOR role, false otherwise.
 */
export const isAuditor = (user: SSOUser): boolean => {
  // Check if the user has the AUDITOR role
  return user.client_roles?.includes(Roles.AUDITOR);
};

/**
 * Function to check if user can edit.
 *
 * @param user - The user object containing information about the user.
 * @returns A boolean value indicating whether the user can edit or not.
 */
export const canUserEdit = (user: SSOUser): boolean => {
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
export const isUserDisabled = async (kcUser: SSOUser): Promise<boolean> => {
  const user = await getUser(kcUser.preferred_username);
  return user.IsDisabled;
};

/**
 * Function to check if the user in PIMS is active.
 *
 * @param kcUser - The KeycloakUser object representing the user.
 * @returns A Promise that resolves to a boolean indicating if the user is active.
 */
export const isUserActive = async (kcUser: SSOUser): Promise<boolean> => {
  const user = await getUser(kcUser.preferred_username);
  return user.Status === 'Active';
};

/**
 * Checks if a user has read permission based on their role and agency membership.
 *
 * @param kcUser - The KeycloakUser object representing the user.
 * @param agencyIds - An array of agency IDs to check against the user's membership.
 * @returns A Promise that resolves to a boolean indicating whether the user has read permission.
 */
export const checkUserAgencyPermission = async (
  kcUser: SSOUser,
  agencyIds: number[],
  permittedRoles: Roles[],
): Promise<boolean> => {
  // Check if undefined, has length of 0, or if the only element is undefined
  if (!agencyIds || agencyIds.length === 0 || !agencyIds.at(0)) {
    return false;
  }
  const userRolePermission = kcUser?.hasRoles(permittedRoles, {requireAllRoles: false});
  console.log("in checkuseragencypermission: ", userRolePermission)
  // if the user is not an admin, nor has a permitted role scope results
  if (!isAdmin(kcUser) && !userRolePermission) {
    // check if current user belongs to any of the specified agencies
    const userAgencies = await userServices.hasAgencies(kcUser.preferred_username, agencyIds);
    return userAgencies;
  }
  // Admins have permission by default
  return true;
};
