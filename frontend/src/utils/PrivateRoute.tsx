import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';

interface IPrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  layout?: React.ComponentType<any>;
  role?: string | Array<string>;
  claim?: string | Array<string>;
  componentProps?: any;
}

/**
 * A PrivateRoute only allows a user who is authenticated and has the appropriate role(s) or claim(s).
 * @param props - Properties to pass { component, role, claim }
 */
export const PrivateRoute = ({
  component: Component,
  layout: Layout,
  ...rest
}: IPrivateRouteProps) => {
  const location = useLocation();
  const keycloak = useKeycloakWrapper();
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
            return !!Layout ? (
              <Layout>
                <Component {...props} {...rest.componentProps} />
              </Layout>
            ) : (
              <Component {...props} {...rest.componentProps} />
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
