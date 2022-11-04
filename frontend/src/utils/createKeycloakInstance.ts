import IKeycloakConfig from 'interfaces/IKeycloakConfig';
import Keycloak from 'keycloak-js';

export const createKeycloakInstance = async () => {
  const response = await fetch('/keycloak.json');
  const data = await response.json();
  const config = data as IKeycloakConfig;
  //@ts-ignore
  const kc = await new Keycloak({
    url: 'https://dev.loginproxy.gov.bc.ca/auth',
    realm: 'standard',
    clientId: 'pims-local-test-4292',
  });
  await kc.init({ pkceMethod: 'S256', redirectUri: window.location.href, idpHint: 'idir' });
  return kc;
};
