import { useConfiguration } from 'hooks/useConfiguration';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

//@ts-ignore
export const useKeycloakInstance = (): KeycloakInstance => {
  const { keycloakAuthUrl, keycloakId } = useConfiguration();
  return new Keycloak({
    url: keycloakAuthUrl,
    realm: 'standard',
    clientId: keycloakId,
  });
};
