import { KCOptions, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import logger from '@/utilities/winstonLogger';
import KeycloakService from '@/services/keycloak/keycloakService';
import userServices from '@/services/users/usersServices';

export const KEYCLOAK_OPTIONS: KCOptions = {
  afterUserLogin: async (user: KeycloakUser) => {
    if (user) {
      logger.info(`${user.display_name} has logged in.`);
      // Try to sync the user's roles from Keycloak
      try {
        const normalizedUser = userServices.normalizeKeycloakUser(user);
        await KeycloakService.syncKeycloakUser(normalizedUser.username);
      } catch (e) {
        logger.warn(e.message);
      }
    }
  },
  afterUserLogout: (user: KeycloakUser) => {
    if (user) {
      logger.info(`${user.display_name} has logged out.`);
    }
  },
};
