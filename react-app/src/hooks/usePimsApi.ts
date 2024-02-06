import { ConfigContext } from '@/contexts/configContext';
import { useContext } from 'react';
import useFetch from './useFetch';
import useUsersApi from './api/useUsersApi';

/**
 * usePimsApi - This stores all the sub-hooks we need to make calls to our API and helps manage authentication state for them.
 * @returns
 */
const usePimsApi = () => {
  const config = useContext(ConfigContext);
  const fetch = useFetch(config?.API_HOST);

  const users = useUsersApi(fetch);

  return {
    users,
  };
};

export default usePimsApi;
