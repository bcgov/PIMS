import * as React from 'react';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';

export interface IAuthState {
  ready?: boolean;
}

export const AuthStateContext = React.createContext<IAuthState>({
  ready: false,
});

export const AuthStateContextProvider = (props: { children?: any }) => {
  const keycloak = useKeycloakWrapper();
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const keycloakReady: boolean = useSelector<RootState, boolean>(state => state.keycloakReady);

  React.useEffect(() => {
    const loadUserInfo = async () => {
      const user = await keycloak.obj?.loadUserInfo();
      setUserInfo(user);
    };

    loadUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
