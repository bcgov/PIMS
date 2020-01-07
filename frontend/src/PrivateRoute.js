import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from 'react-keycloak';

function PrivateRoute({ component: Component, ...rest }) {
  const { keycloak } = useKeycloak();
  return (
    <Route
      {...rest}
      render={props => {
        return !!keycloak.authenticated ? (
          <Component {...props} activeUserId={rest.activeUserId} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { referer: props.location } }} />
        );
      }}
    />
  );
}

export default PrivateRoute;
