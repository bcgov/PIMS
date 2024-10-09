import { useSSO } from '@bcgov/citz-imb-sso-react';
import usePimsApi from './usePimsApi';
import useDataLoader from './useDataLoader';
import { User } from './api/useUsersApi';
import { Roles } from '@/constants/roles';

export interface IPimsUser {
  data?: User;
  refreshData: () => Promise<User>;
  isLoading: boolean;
  hasOneOfRoles: (requiredRoles: Roles[]) => boolean;
}

/**
 * A hook that retrieves the active user's info from the database.
 * It uses the username provided by Keycloak to find the corresponding user.
 * It includes a function `hasOneOfRoles` to allow for role-based permissions checks.
 * @returns Object containing the user's database record and functions related to the loading of this data.
 */
const usePimsUser = () => {
  const sso = useSSO();
  const api = usePimsApi();
  const { data, refreshData, isLoading, loadOnce } = useDataLoader(api.users.getSelf, () => {});

  if (!data && sso.isAuthenticated) {
    loadOnce();
  }

  /**
   * Checks the user's roles and returns a boolean if they have the given required roles.
   * @param {Roles[]} requiredRoles An array of required Roles.
   * @returns True|False depending on user role and required roles.
   */
  const hasOneOfRoles = (requiredRoles: Roles[]): boolean => {
    if (!data || !data.RoleId || !requiredRoles || !requiredRoles.length) return false;
    return requiredRoles.includes(data.RoleId as Roles);
  };

  return {
    data,
    refreshData,
    isLoading,
    hasOneOfRoles,
  };
};

export default usePimsUser;
