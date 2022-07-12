import queryString from 'querystring';
import { useLocation } from 'react-router';

export const useQuery = () => {
  const location = useLocation();
  // Updating dependencies has impacted everything related to react-router.
  return queryString.parse(`${location.search}`.replace('?', '')) as any;
};
