import Keycloak from 'keycloak-js';

//@ts-ignore
export const keycloakInstance = new Keycloak({
  url: 'https://dev.loginproxy.gov.bc.ca/auth',
  realm: 'standard',
  clientId: 'pims-local-test-4292',
});
keycloakInstance.init({ pkceMethod: 'S256', redirectUri: window.location.href });
