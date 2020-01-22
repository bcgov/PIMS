import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useKeycloak } from 'react-keycloak';

interface PrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { keycloak } = useKeycloak();
  let { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        console.log(keycloak);
        return !!keycloak.authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { referer: props.location } }} />
        );
      }}
    />
  );
}

export default PrivateRoute;
