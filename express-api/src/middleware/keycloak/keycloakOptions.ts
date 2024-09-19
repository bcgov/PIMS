import { SSOOptions, SSOUser } from '@bcgov/citz-imb-sso-express';
import logger from '@/utilities/winstonLogger';
import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';

const users = AppDataSource.getRepository(User);

/**
 * Defined by SSO package. See package GitHub repo for options.
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
