import { IdirIdentityProvider } from '@bcgov/citz-imb-kc-express';
import { KEYCLOAK_OPTIONS } from '@/middleware/keycloak/keycloakOptions';
import logger from '@/utilities/winstonLogger';
import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';

const _userExists = jest
  .spyOn(AppDataSource.getRepository(User), 'exists')
  .mockImplementation(async () => true);

const _userUpdate = jest
  .spyOn(AppDataSource.getRepository(User), 'update')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

describe('UNIT - Keycloak Options', () => {
  const user = {
    preferred_username: 'Tester',
    email: 'test@test.com',
    display_name: 'Tester',
    identity_provider: 'idir' as IdirIdentityProvider,
    idir_user_guid: 'abc123',
    idir_username: 'tester@idir',
    given_name: 'Tester',
    family_name: 'McTest',
  };
  const { afterUserLogin, afterUserLogout } = KEYCLOAK_OPTIONS;

  beforeEach(() => {
    jest.clearAllMocks;
  });

  const loggerSpy = jest.spyOn(logger, 'info');
  it('should log when a user logs in', async () => {
    await afterUserLogin(user);
    expect(loggerSpy).toHaveBeenCalledWith('Tester has logged in.');
    expect(_userExists).toHaveBeenCalledTimes(1);
    expect(_userExists).toHaveBeenCalledWith({
      where: {
        Username: user.preferred_username,
      },
    });
    expect(_userUpdate).toHaveBeenCalledTimes(1);
  });

  it('should log when a user logs out', async () => {
    await afterUserLogout(user);
    expect(loggerSpy).toHaveBeenCalledWith('Tester has logged out.');
  });
});
