import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/lib/index';
import { KeycloakInstance } from 'keycloak-js';
import { saveJwt, clearJwt } from 'store/slices/jwtSlice';
import { setKeycloakReady } from 'store/slices/keycloakReadySlice';
import { store } from 'store';

const getKeycloakEventHandler = (keycloak: KeycloakInstance) => {
  const keycloakEventHandler = (
    eventType: AuthClientEvent,
    error?: AuthClientError | undefined,
  ) => {
    if (eventType === 'onAuthSuccess') {
      store.dispatch(saveJwt(keycloak.token!));
    } else if (eventType === 'onAuthRefreshSuccess') {
      store.dispatch(saveJwt(keycloak.token!));
    } else if (eventType === 'onAuthLogout' || eventType === 'onTokenExpired') {
      store.dispatch(clearJwt());
    } else if (eventType === 'onReady') {
      store.dispatch(setKeycloakReady(true));
    } else {
      //TODO: log error properly
      console.debug(`keycloak event: ${eventType} error ${error}`);
    }
  };
  return keycloakEventHandler;
};

export default getKeycloakEventHandler;
