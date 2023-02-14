import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

/**
 * IsAuthenticatedRoute wraps other routes to ensure they are authenticated.
 * @param props Component properties.
 * @returns New instance of a component.
 */
export const IsAuthenticatedRoute: React.FC = (props: RouteProps) => {
  const keycloak = useKeycloakWrapper();

  // If authorized, return an outlet that will render child elements
  if (keycloak.obj?.authenticated) return <Outlet />;
  if (props.path !== '/login') {
    return <Navigate to={`/login`} />;
  }
  return <Navigate to="/forbidden" state={{ referer: props.path }} />;
};
