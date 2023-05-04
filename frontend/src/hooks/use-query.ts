import { useLocation } from 'react-router';

export const useQuery = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // Updating dependencies has impacted everything related to react-router.
  return queryParams.toString();
};
