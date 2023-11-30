import { useConfiguration } from 'hooks/useConfiguration';
import Keycloak from 'keycloak-js';

//@ts-ignore
export const useKeycloakInstance = (): Keycloak => {
  const { keycloakAuthUrl, keycloakId } = useConfiguration();
  return new Keycloak({
    url: keycloakAuthUrl,
    realm: 'standard',
    clientId: keycloakId,
  });
};
