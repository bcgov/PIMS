import { Roles } from '@/constants/roles';
import { UserContext } from '@/contexts/authContext';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { CircularProgress, Paper, Typography } from '@mui/material';
import { PropsWithChildren, useContext, useEffect, useRef } from 'react';
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
  const authStateContext = useContext(UserContext);
  const sso = useSSO();
  const navigate = useNavigate();

  useEffect(() => {
    if (sso.isAuthenticated) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }

      if (authStateContext.pimsUser?.data) {
        // Redirect from page if lacking roles
        if (permittedRoles && !authStateContext.pimsUser?.hasOneOfRoles(permittedRoles)) {
          navigate(redirectRoute ?? '/');
        }
        // Redirect from page if user does not have Active status
        if (!ignoreStatus && authStateContext.pimsUser?.data?.Status !== 'Active') {
          navigate(redirectRoute ?? '/');
        }
      }
    } else {
      timeoutId.current = setTimeout(
        () =>
          sso.login({
            postLoginRedirectURL: window.location.pathname + window.location.search,
          }),
        5000,
      );
    }

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [authStateContext.pimsUser?.isLoading, sso.isLoggingIn, sso.isAuthenticated]);
  const timeoutId = useRef(null);
  if (!sso.isAuthenticated) {
    return (
      <Paper
        sx={{
          maxWidth: '30rem',
          padding: 2,
          textAlign: 'center',
          marginX: 'auto',
          marginY: '4rem',
        }}
      >
        <Typography>
          Attempting to load your keycloak credentials. If this message does not go away
          momentarily, you will automatically be prompted to sign in again.
        </Typography>
        <CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />
      </Paper>
    );
  }
  return <>{props.children}</>;
};

export default AuthRouteGuard;
