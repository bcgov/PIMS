import React from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';

export const Login = () => {
  const { login } = useKeycloak();
  return <button onClick={() => login({ idpHint: 'idir' })}>LOGIN</button>;
};
