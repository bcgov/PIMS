import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { Roles } from '@/constants/roles';
import userServices, { getUser } from '@/services/users/usersServices';
import { PimsRequestUser } from '@/middleware/userAuthCheck';

/**
 * Function to check if user can edit.
 *
 * @param user - The user object containing information about the user.
 * @returns A boolean value indicating whether the user can edit or not.
 */
export const canUserEdit = (user: PimsRequestUser): boolean => {
  // as they are not an auditor the user can edit
  return user.hasOneOfRoles([Roles.GENERAL_USER, Roles.ADMIN]);
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
  user: PimsRequestUser,
  agencyIds: number[],
  permittedRoles: Roles[],
): Promise<boolean> => {
  // Check if undefined, has length of 0, or if the only element is undefined
  if (!agencyIds || agencyIds.length === 0 || !agencyIds.at(0)) {
    return false;
  }
  // if the user is not an admin, nor has a permitted role scope results
  if (!user.hasOneOfRoles([Roles.ADMIN, ...permittedRoles])) {
    // check if current user belongs to any of the specified agencies
    const userAgencies = await userServices.hasAgencies(user.Username, agencyIds);
    return userAgencies;
  }
  // Admins have permission by default
  return true;
};
