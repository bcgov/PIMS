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

const usePimsUser = () => {
  const keycloak = useSSO();
  const api = usePimsApi();
  const { data, refreshData, isLoading, loadOnce } = useDataLoader(api.users.getSelf, () => {});

  if (!data && keycloak.isAuthenticated) {
    loadOnce();
  }

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
