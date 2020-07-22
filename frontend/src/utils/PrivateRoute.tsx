import React from 'react';
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';

interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  layout: React.ComponentType<any>;
  role?: string | Array<string>;
  claim?: string | Array<string>;
  componentProps?: any;
}

/**
 * A PrivateRoute only allows a user who is authenticated and has the appropriate role(s) or claim(s).
 * @param props - Properties to pass { component, role, claim }
 */
const PrivateRoute = (props: IPrivateRouteProps) => {
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
  let { component: Component, layout: Layout, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        if (!!keycloak.obj?.authenticated) {
          if (
            (!rest.role && !rest.claim) ||
            keycloak.hasRole(rest.role) ||
            keycloak.hasClaim(rest.claim)
          ) {
            return (
              <Layout>
                <Component {...props} {...rest.componentProps} />
              </Layout>
            );
          } else {
            return <Redirect to={{ pathname: '/forbidden', state: { referer: props.location } }} />;
          }
        } else {
          if (props.location.pathname !== '/login') {
            const redirectTo = encodeURI(`${location.pathname}${location.search}`);
            return <Redirect to={`/login?redirect=${redirectTo}`} />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
