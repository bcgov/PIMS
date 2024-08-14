import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A helper hook wrapping some of the built in react-router-dom functions
 * which lets you set the location (preserving search params) before navigating away from a route,
 * and then lets you return to this same location and search params at a later time.
 * @returns {Function} goToFromStateOrSetRoute -- will navigate to the location set in "from", otherwise the route in the argument.
 * @returns {Function} navigateAndSetFrom -- navigate as per usual, but always set the current location in the "from" state.
 */
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
