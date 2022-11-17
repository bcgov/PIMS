import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/lib/index';
import { KeycloakInstance } from 'keycloak-js';
import { store } from 'store';
import { clearJwt, saveJwt } from 'store/slices/jwtSlice';
import { setKeycloakReady } from 'store/slices/keycloakReadySlice';

const getKeycloakEventHandler = (keycloak: KeycloakInstance) => (
  eventType: AuthClientEvent,
  error?: AuthClientError | undefined,
) => {
  console.log('\n\n\n\n', { error }, '\n\n\n');
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
      if (keycloak.token) {
        store.dispatch(saveJwt(keycloak.token));
      }
      break;

    default:
      console.debug(`keycloak event: ${eventType} error ${error}`);
  }
};

export default getKeycloakEventHandler;
