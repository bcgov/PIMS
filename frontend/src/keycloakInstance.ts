import Keycloak, { KeycloakInstance } from 'keycloak-js';

//@ts-ignore
export const keycloakInstance: KeycloakInstance = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_AUTH_SERVER_URL ?? 'https://dev.loginproxy.gov.bc.ca/auth',
  realm: 'standard',
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID ?? 'pims-local-test-4292',
});
