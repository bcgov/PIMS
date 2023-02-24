import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import * as React from 'react';
import { useAppSelector } from 'store';

export interface IAuthState {
  ready?: boolean;
}

export const AuthStateContext = React.createContext<IAuthState>({
  ready: false,
});

export const AuthStateContextProvider = (props: { children?: any }) => {
  const keycloak = useKeycloakWrapper();
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const keycloakReady: boolean = useAppSelector((store) => store.keycloakReady);

  React.useEffect(() => {
    const loadUserInfo = async () => {
      const user = await keycloak.obj?.loadUserInfo();
      setUserInfo(user);
    };

    try {
      if (keycloak.obj.authenticated) loadUserInfo();
    } catch (err) {
      // this error isn't recoverable, so just log it for debugging purposes.
      console.error(err);
    }
  }, [keycloak.obj.token]);

  return (
    <AuthStateContext.Provider
      value={{
        // if user info is not available when authenticated, then the auth state is not ready
        ready:
          keycloakReady &&
          (!keycloak.obj?.authenticated || (keycloak.obj?.authenticated && !!userInfo)),
      }}
    >
      {props.children}
    </AuthStateContext.Provider>
  );
};
