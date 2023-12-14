import { KCOptions, KeycloakUser } from '@bcgov/citz-imb-kc-express';
import logger from '../../utilities/winstonLogger';

export const KEYCLOAK_OPTIONS: KCOptions = {
  afterUserLogin: (user: KeycloakUser | null) => {
    if (user && user != null) {
      logger.info(`${user.display_name} has logged in.`);
    }
  },
  afterUserLogout: (user: KeycloakUser | null) => {
    if (user && user != null) {
      logger.info(`${user.display_name} has logged out.`);
    }
  },
};
