import usePimsUser, { IPimsUser } from '@/hooks/usePimsUser';
import { AuthService, useSSO } from '@bcgov/citz-imb-sso-react';
import React, { createContext } from 'react';
export interface IAuthState {
  keycloak: AuthService;
  pimsUser: IPimsUser;
}
export const AuthContext = createContext<IAuthState | undefined>(undefined);

/**
 * Provides access to user and authentication (keycloak) data about the logged in user.
 *
 * @param {*} props
 * @return {*}
 */
export const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const keycloak = useSSO();
  const pimsUser = usePimsUser();

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        pimsUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
