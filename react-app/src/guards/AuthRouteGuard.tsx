import { AuthContext } from '@/contexts/authContext';
import { CircularProgress } from '@mui/material';
import { PropsWithChildren, useContext } from 'react';
import React from 'react';

/**
 * AuthRouteGuard - Use this to wrap any component you don't want being rendered until the keycloak authentication state has resolved.
 * @param props
 * @returns
 */
const AuthRouteGuard = (props: PropsWithChildren) => {
  const authStateContext = useContext(AuthContext);

  if (authStateContext.keycloak?.isLoggingIn || authStateContext.pimsUser?.isLoading) {
    return <CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />;
  }

  return <>{props.children}</>;
};

export default AuthRouteGuard;
