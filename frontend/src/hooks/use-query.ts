import { useLocation } from 'react-router';
import queryString from 'querystring';

export const useQuery = () => {
  const location = useLocation();
  return queryString.parse(location.search.replace('?', '')) as any;
};
