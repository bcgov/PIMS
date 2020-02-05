import { KeycloakEventHandler } from '@react-keycloak/web';
import { KeycloakInstance } from 'keycloak-js';

const getKeycloakEventHandler = (keycloak: KeycloakInstance) => {
  const keycloakEventHandler: KeycloakEventHandler = (event, error) => {
    if (event === "onAuthSuccess") {
      localStorage.setItem("jwt", keycloak.token!!);
    } else if (event === "onAuthRefreshSuccess") {
      localStorage.setItem("jwt", keycloak.token!!);
    } else if (event === "onAuthLogout") {
      localStorage.removeItem("jwt");
    } else {
      //TODO: log error properly
      console.debug(`keycloak event: ${event} error ${error}`);
    }
  }
  return keycloakEventHandler;
}

export default getKeycloakEventHandler;