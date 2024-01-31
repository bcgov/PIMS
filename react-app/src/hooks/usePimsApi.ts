import { ConfigContext } from '@/contexts/configContext';
import { useContext } from 'react';
import useFetch from './useFetch';

const usePimsApi = () => {
  const config = useContext(ConfigContext);
  const fetchFunc = useFetch(config.API_HOST);
  const users = useUsersApi();
};

export default usePimsApi;
