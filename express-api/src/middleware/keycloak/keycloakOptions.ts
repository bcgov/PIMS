import { SSOUser } from '@/middleware/keycloak/ssoUser';
import logger from '@/utilities/winstonLogger';
import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';

const users = AppDataSource.getRepository(User);

export interface SSOOptions {
  afterUserLogin: (user: SSOUser) => Promise<void>;
  afterUserLogout: (user: SSOUser) => void;
}

/**
 * Hooks called by the auth controllers on login and logout.
 */
export const SSO_OPTIONS: SSOOptions = {
  afterUserLogin: async (user: SSOUser) => {
    if (user) {
      logger.info(`${user.display_name} has logged in.`);
      // Update last login date
      if (await users.exists({ where: { Username: user.preferred_username } })) {
        await users.update({ Username: user.preferred_username }, { LastLogin: new Date() });
      }
    }
  },
  afterUserLogout: (user: SSOUser) => {
    if (user) {
      logger.info(`${user.display_name} has logged out.`);
    }
  },
};
