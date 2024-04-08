import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { Roles } from '@/constants/roles';
import { getUser } from '@/services/users/usersServices';
/**
 * @description
 * @param {KeycloakUser}     user Incoming Keycloak user.
 * @returns {boolean}      A boolean for whether admin or not.
 */

// Function to check if user is an admin
export const isAdmin = (user: KeycloakUser): boolean => {
  // Check if the user has the ADMIN role
  return !!user.client_roles?.includes(Roles.ADMIN);
};

// Function to check if user is an auditor
export const isAuditor = (user: KeycloakUser): boolean => {
  // Check if the user has the ADMIN role
  return !!user.client_roles?.includes(Roles.AUDITOR);
};

// Function to check if user can view, edit, delete
export const isViewOnly = (user: KeycloakUser): boolean => {
  //
  return !!user.client_roles?.includes(Roles.AUDITOR);
};

// Function to check if user can edit
export const canUserEdit = (user: KeycloakUser): boolean => {
  //
  return !!user.client_roles?.includes(Roles.ADMIN);
};

// Function to check if the user in PIMS is disabled
export const isUserDisabled = async (kcUser: KeycloakUser): Promise<boolean> => {
  const user = await getUser(kcUser.preferred_username);

  return user.IsDisabled;
};

// Function to check if the user in PIMS is not active
export const isUserNotActive = async (kcUser: KeycloakUser): Promise<boolean> => {
  const user = await getUser(kcUser.preferred_username);

  return user.Status !== 'Active';
};
