import { useLocation, useNavigate } from 'react-router-dom';

const useHistoryAwareNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const goToFromStateOrSetRoute = (setRoute: string) => {
    const previousLocation = location.state?.from;
    if (previousLocation) {
      navigate(previousLocation.pathname + previousLocation.search);
    } else {
      navigate(setRoute);
    }
  };
  const navigateAndSetFrom = (route: string) => {
    navigate(route, { state: { from: location } });
  };

  return { goToFromStateOrSetRoute, navigateAndSetFrom };
};

export default useHistoryAwareNavigate;
