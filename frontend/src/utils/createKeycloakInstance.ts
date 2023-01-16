import IKeycloakConfig from 'interfaces/IKeycloakConfig';
import Keycloak from 'keycloak-js';

/**
 * Fetches the configuration file `/keycloak.json` and creates a KeycloakInstance for it.
 * Overrides file configuration with environment variables.
 * @returns Promise<KeycloakInstance>
 */
export const createKeycloakInstance = async () => {
  const response = await fetch('/keycloak.json');
  const data = await response.json();
  const config = data as IKeycloakConfig;

  //@ts-ignore
  return new Keycloak({
    url: import.meta.env.REACT_APP_KEYCLOAK_AUTH_SERVER_URL ?? config['auth-server-url'],
    realm: config.realm,
    clientId: config.resource,
  } as Keycloak.KeycloakConfig);
};
