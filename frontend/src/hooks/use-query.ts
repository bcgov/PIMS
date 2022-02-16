import queryString from 'querystring';
import { useLocation } from 'react-router';

export const useQuery = () => {
  const location = useLocation();
  return queryString.parse(location.search.replace('?', '')) as any;
};
