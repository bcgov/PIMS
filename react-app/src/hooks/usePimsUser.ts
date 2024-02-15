import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import usePimsApi from './usePimsApi';
import useDataLoader from './useDataLoader';
import { User } from './api/useUsersApi';

export interface IPimsUser {
  data?: User;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const usePimsUser = () => {
  const keycloak = useKeycloak();
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
