import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/lib/index';
import { KeycloakInstance } from 'keycloak-js';
import { store } from 'store';
import { clearJwt, saveJwt } from 'store/slices/jwtSlice';
import { setKeycloakReady } from 'store/slices/keycloakReadySlice';

const getKeycloakEventHandler = (keycloak: KeycloakInstance) => (
  eventType: AuthClientEvent,
  error?: AuthClientError | undefined,
) => {
<<<<<<< HEAD
=======
  console.log('\n\n\n\n', { error }, '\n\n\n');
>>>>>>> b5c35e71 (Backend in working state)
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
<<<<<<< HEAD
=======
      if (keycloak.token) {
        store.dispatch(saveJwt(keycloak.token));
      }
>>>>>>> b5c35e71 (Backend in working state)
      break;

    default:
      console.debug(`keycloak event: ${eventType} error ${error}`);
  }
<<<<<<< HEAD

  //TODO: Fix race condition through better means than the following
  switch (error?.error) {
    case 'login_required':
      window.location.reload();
  }
=======
>>>>>>> b5c35e71 (Backend in working state)
};

export default getKeycloakEventHandler;
