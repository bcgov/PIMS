import React from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';

export const Home = () => {
  const { state, logout } = useKeycloak();

  return <button onClick={() => logout()}>{`LOGOUT, ${state.userInfo.given_name}`}</button>;
};
