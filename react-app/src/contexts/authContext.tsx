import usePimsUser, { IPimsUser } from '@/hooks/usePimsUser';
import { AuthService, useSSO } from '@bcgov/citz-imb-sso-react';
import React, { createContext, useEffect } from 'react';
import { AuthContextProps, useAuth } from 'react-oidc-context';
export interface IAuthState {
  keycloak: AuthContextProps;
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
  const keycloak = useAuth();
  const pimsUser = usePimsUser();

  useEffect(() => {
    keycloak.events.addAccessTokenExpired(() => {
      console.log('Access token expired');
      keycloak.signinSilent(); // Attempt to renew the token silently
    });

    keycloak.events.addSilentRenewError((error) => {
      console.error('Silent renew error', error);
    });

    return () => {
      keycloak.events.removeAccessTokenExpired(() => {
        console.log('Access token expired');
      });

      keycloak.events.removeSilentRenewError((error) => {
        console.error('Silent renew error', error);
      });
    };
  }, [keycloak]);

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
