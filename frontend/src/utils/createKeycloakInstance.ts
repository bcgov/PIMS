import IKeycloakConfig from 'interfaces/IKeycloakConfig';
import Keycloak from 'keycloak-js';

// export const createKeycloakInstance = async () => {
//   //@ts-ignore
//   const kc = await new Keycloak({
//     url: 'https://dev.loginproxy.gov.bc.ca/auth',
//     realm: 'standard',
//     clientId: 'pims-local-test-4292',
//   });
//   await kc.init({ pkceMethod: 'S256', redirectUri: window.location.href, idpHint: 'idir' });
//   console.log({ kc });
//   return kc;
// };
//@ts-ignore
export const keycloakInstance = new Keycloak({
  url: 'https://dev.loginproxy.gov.bc.ca/auth',
  realm: 'standard',
  clientId: 'pims-local-test-4292',
});
keycloakInstance.init({ pkceMethod: 'S256', redirectUri: window.location.href });
