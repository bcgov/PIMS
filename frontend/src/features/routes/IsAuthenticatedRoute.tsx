import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Navigate, Outlet, RouteProps, useLocation } from 'react-router-dom';

/**
 * IsAuthenticatedRoute wraps other routes to ensure they are authenticated.
 * @param props Component properties.
 * @returns New instance of a component.
 */
export const IsAuthenticatedRoute: React.FC = (props: RouteProps) => {
  const keycloak = useKeycloakWrapper();
  const location = useLocation();

  // If authorized, return an outlet that will render child elements
  if (keycloak.obj?.authenticated) return <Outlet />;
  if (props.path !== '/login') {
    const redirectTo = encodeURI(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirectTo}`} />;
  }
  return <Navigate to="/forbidden" state={{ referer: props.path }} />;
};
