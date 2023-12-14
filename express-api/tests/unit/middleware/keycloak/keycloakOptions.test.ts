import { IdirIdentityProvider } from '@bcgov/citz-imb-kc-express';
import { KEYCLOAK_OPTIONS } from '../../../../middleware/keycloak/keycloakOptions';
import logger from '../../../../utilities/winstonLogger';

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

  const loggerSpy = jest.spyOn(logger, 'info');
  it('should log when a user logs in', () => {
    afterUserLogin(user);
    expect(loggerSpy).toHaveBeenCalledWith('Tester has logged in.');
  });

  it('should log when a user logs out', () => {
    afterUserLogout(user);
    expect(loggerSpy).toHaveBeenCalledWith('Tester has logged out.');
  });
});
