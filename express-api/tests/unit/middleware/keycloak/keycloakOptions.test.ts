import { SSO_OPTIONS } from '@/middleware/keycloak/keycloakOptions';
import logger from '@/utilities/winstonLogger';
import { AppDataSource } from '@/appDataSource';
import { User } from '@/typeorm/Entities/User';
import { produceSSO } from 'tests/testUtils/factories';

const _userExists = jest
  .spyOn(AppDataSource.getRepository(User), 'exists')
  .mockImplementation(async () => true);

const _userUpdate = jest
  .spyOn(AppDataSource.getRepository(User), 'update')
  .mockImplementation(async () => ({ generatedMaps: [], raw: {} }));

describe('UNIT - SSO Options', () => {
  const user = produceSSO();
  const { afterUserLogin, afterUserLogout } = SSO_OPTIONS;

  beforeEach(() => jest.clearAllMocks());

  const loggerSpy = jest.spyOn(logger, 'info');
  it('should log when a user logs in', async () => {
    await afterUserLogin(user);
    expect(loggerSpy).toHaveBeenCalledWith(`${user.display_name} has logged in.`);
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
    expect(loggerSpy).toHaveBeenCalledWith(`${user.display_name} has logged out.`);
  });
});
