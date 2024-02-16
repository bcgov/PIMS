import { ConfigContext } from '@/contexts/configContext';
import { useContext } from 'react';
import useFetch from './useFetch';
import useUsersApi from './api/useUsersApi';
import useAgencyApi from './api/useAgencyApi';
import useRolesApi from './api/useRolesApi';

/**
 * usePimsApi - This stores all the sub-hooks we need to make calls to our API and helps manage authentication state for them.
 * @returns
 */
const usePimsApi = () => {
  const config = useContext(ConfigContext);
  const fetch = useFetch(config?.API_HOST);

  const users = useUsersApi(fetch);
  const agencies = useAgencyApi(fetch);
  const roles = useRolesApi(fetch);

  return {
    users,
    agencies,
    roles,
  };
};

export default usePimsApi;
