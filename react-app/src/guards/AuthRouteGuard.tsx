import { Roles } from '@/constants/roles';
import { AuthContext } from '@/contexts/authContext';
import { CircularProgress } from '@mui/material';
import { PropsWithChildren, useContext, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface AuthGuardProps extends PropsWithChildren {
  permittedRoles?: Roles[];
  redirectRoute?: string;
  ignoreStatus?: boolean;
}

/**
 * AuthRouteGuard - Use this to wrap any component you don't want being rendered until the keycloak authentication state has resolved.
 * @param props
 * @returns
 */
const AuthRouteGuard = (props: AuthGuardProps) => {
  const { permittedRoles, redirectRoute, ignoreStatus } = props;
  const authStateContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!authStateContext.keycloak.isLoading && !authStateContext.keycloak.isAuthenticated) {
    //   authStateContext.keycloak.login({ postLoginRedirectURL: window.location.pathname });
    // }
    if (authStateContext.pimsUser?.data && authStateContext.keycloak?.isAuthenticated) {
      // Redirect from page if lacking roles

      // if (
      //   permittedRoles &&
      //   !authStateContext.keycloak(permittedRoles, { requireAllRoles: false })
      // ) {
      //   navigate(redirectRoute ?? '/');
      // }
      // Redirect from page if user does not have Active status
      if (!ignoreStatus && authStateContext.pimsUser?.data?.Status !== 'Active') {
        navigate(redirectRoute ?? '/');
      }
    }
  }, [authStateContext.pimsUser?.isLoading, authStateContext.keycloak.isLoading]);

  useEffect(() => {
    console.log(authStateContext.keycloak);
  }, [authStateContext.keycloak.isAuthenticated]);

  if (!authStateContext.keycloak.isAuthenticated || authStateContext.pimsUser.isLoading) {
    console.log(`Keycloak is authenticated: ${authStateContext.keycloak.isAuthenticated}`);
    console.log(`Pims user isLoading: ${authStateContext.pimsUser.isLoading}`);
    return <CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />;
  }

  return <>{props.children}</>;
};

export default AuthRouteGuard;
