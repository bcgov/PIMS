import { AuthService, useKeycloak } from '@bcgov/citz-imb-kc-react';
import React, { createContext } from 'react';
export interface IAuthState {
  keycloak: AuthService;
}
export const AuthContext = createContext<IAuthState | undefined>(undefined);

/**
 * Provides access to user and authentication (keycloak) data about the logged in user.
 *
 * @param {*} props
 * @return {*}
 */
export const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  const keycloak = useKeycloak();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pimsUser = undefined;
  // We could later add in a hook to give us user information from this context as well, thus allowing us to obtain
  // both the keycloak authentication state and our internal user state in the same spot.

  return (
    <AuthContext.Provider
      value={{
        keycloak,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
