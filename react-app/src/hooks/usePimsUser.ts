//import { useSSO } from '@bcgov/citz-imb-sso-react';
import usePimsApi from './usePimsApi';
import useDataLoader from './useDataLoader';
import { User } from './api/useUsersApi';
import { useAuth } from 'react-oidc-context';

export interface IPimsUser {
  data?: User;
  refreshData: () => Promise<User>;
  isLoading: boolean;
}

const usePimsUser = () => {
  const keycloak = useAuth();
  const api = usePimsApi();
  const { data, refreshData, isLoading, loadOnce } = useDataLoader(api.users.getSelf, () => {});

  if (!data && keycloak.isAuthenticated) {
    loadOnce();
  }

  return {
    data,
    refreshData,
    isLoading,
  };
};

export default usePimsUser;
