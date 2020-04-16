import { KeycloakEventHandler } from '@react-keycloak/web';
import { KeycloakInstance } from 'keycloak-js';
import { store } from 'App';
import { saveJwt, clearJwt } from 'reducers/JwtSlice';
import { setKeycloakReady } from 'reducers/keycloakReadySlice';

const getKeycloakEventHandler = (keycloak: KeycloakInstance) => {
  const keycloakEventHandler: KeycloakEventHandler = (event, error) => {
    if (event === 'onAuthSuccess') {
      store.dispatch(saveJwt(keycloak.token!));
    } else if (event === 'onAuthRefreshSuccess') {
      store.dispatch(saveJwt(keycloak.token!));
    } else if (event === 'onAuthLogout') {
      store.dispatch(clearJwt());
    } else if (event === 'onReady') {
      store.dispatch(setKeycloakReady(true));
    } else {
      //TODO: log error properly
      console.debug(`keycloak event: ${event} error ${error}`);
    }
  };
  return keycloakEventHandler;
};

export default getKeycloakEventHandler;
