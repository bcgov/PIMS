import { AuthContext } from '@/contexts/authContext';
import { CircularProgress } from '@mui/material';
import { PropsWithChildren, useContext } from 'react';
import React from 'react';

const AuthRouteGuard = (props: PropsWithChildren) => {
  const authStateContext = useContext(AuthContext);

  if (!authStateContext.keycloak.isAuthenticated) {
    return <CircularProgress sx={{ position: 'fixed', top: '50%', left: '50%' }} />;
  }

  return <>{props.children}</>;
};

export default AuthRouteGuard;
