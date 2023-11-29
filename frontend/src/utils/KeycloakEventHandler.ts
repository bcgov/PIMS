import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/lib/index';
import Keycloak from 'keycloak-js';
import { store } from 'store';
import { clearJwt, saveJwt } from 'store/slices/jwtSlice';
import { setKeycloakReady } from 'store/slices/keycloakReadySlice';

const getKeycloakEventHandler =
  (keycloak: Keycloak) => (eventType: AuthClientEvent, error?: AuthClientError | undefined) => {
    switch (eventType) {
      case 'onAuthSuccess':
        store.dispatch(saveJwt(keycloak.token!));
        break;

      case 'onAuthRefreshSuccess':
        store.dispatch(saveJwt(keycloak.token!));
        break;

      case 'onAuthLogout':
      case 'onTokenExpired':
        store.dispatch(clearJwt());
        break;

      case 'onReady':
        store.dispatch(setKeycloakReady(true));
        break;

      default:
        console.debug(`keycloak event: ${eventType} error ${error}`);
    }

    //TODO: Fix race condition through better means than the following
    switch (error?.error) {
      case 'login_required':
        window.location.reload();
    }
  };

export default getKeycloakEventHandler;
