import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

interface IPrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
  role?: string;
}

const PrivateRoute = (props: IPrivateRouteProps) => {
  const keycloak = useKeycloakWrapper();
  let { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        if (!!keycloak.obj?.authenticated) {
          if (keycloak.hasRole(rest.role)) {
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
