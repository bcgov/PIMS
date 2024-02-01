import { AuthContext } from '@/contexts/authContext';
import { CircularProgress } from '@mui/material';
import { PropsWithChildren, useContext } from 'react';
import React from 'react';

const AuthRouteGuard = (props: PropsWithChildren) => {
  const authStateContext = useContext(AuthContext);

  if (
    !authStateContext.keycloak.isAuthenticated ||
    !authStateContext.keycloak.getAuthorizationHeaderValue()
  ) {
    return <CircularProgress />;
  }

  return <>{props.children}</>;
};

export default AuthRouteGuard;
