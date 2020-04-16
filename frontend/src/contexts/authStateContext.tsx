import * as React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';

export interface IAuthState {
  authenticated?: boolean;
  userInfo?: any;
  ready?: boolean;
}

export const AuthStateContext = React.createContext<IAuthState>({
  authenticated: false,
  ready: false,
});

export const AuthStateContextProvider = (props: { children?: any }) => {
  const keycloak = useKeycloakWrapper();
  const [userInfo, setUserInfo] = React.useState<any>(null);
  const keyCloakReady: boolean = useSelector<RootState, boolean>(state => state.keyCloakReady);

  React.useEffect(() => {
    const loadUserInfo = async () => {
      const user = await keycloak.obj?.loadUserInfo();
      setUserInfo(user);
    };

    loadUserInfo();
  }, []);

  return (
    <AuthStateContext.Provider
      value={{
        authenticated: keycloak.obj?.authenticated,
        ready: keyCloakReady,
        userInfo,
      }}
    >
      {props.children}
    </AuthStateContext.Provider>
  );
};
