import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

interface IPrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
  role?: string | Array<string>;
  claim?: string | Array<string>;
}

/**
 * A PrivateRoute only allows a user who is authenticated and has the appropriate role(s) or claim(s).
 * @param props - Properties to pass { component, role, claim }
 */
const PrivateRoute = (props: IPrivateRouteProps) => {
  const keycloak = useKeycloakWrapper();
  let { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        if (!!keycloak.obj?.authenticated) {
          if (keycloak.hasRole(rest.role) || keycloak.hasClaim(rest.claim)) {
            return <Component {...props} />;
          } else {
            return (
              <Redirect to={{ pathname: '/accessdenied', state: { referer: props.location } }} />
            );
          }
        } else {
          if (props.location.pathname !== '/login') {
            return <Redirect to={{ pathname: '/login', state: { referer: props.location } }} />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
