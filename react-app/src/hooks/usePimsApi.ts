import { ConfigContext } from '@/contexts/configContext';
import { useContext } from 'react';
import useFetch from './useFetch';
import useUsersApi from './api/useUsersApi';

const usePimsApi = () => {
  const config = useContext(ConfigContext);
  const fetch = useFetch(config?.API_HOST);

  const users = useUsersApi(fetch);

  return {
    users,
  };
};

export default usePimsApi;
