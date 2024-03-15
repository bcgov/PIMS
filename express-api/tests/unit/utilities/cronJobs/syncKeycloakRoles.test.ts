import cronSyncKeycloakRoles from '@/utilities/cronJobs/syncKeycloakRoles';
import cron, { ScheduledTask } from 'node-cron';
import logger from '@/utilities/winstonLogger';

// Mocking keycloak service.
const _syncKeycloakRoles = jest.fn();
jest.mock('@/services/keycloak/keycloakService.ts', () => ({
  syncKeycloakRoles: () => _syncKeycloakRoles(),
}));

// cron.schedule has a weird return type expected.
// This makes sure the inner function is still called.
const _scheduleSpy = jest
  .spyOn(cron, 'schedule')
  .mockImplementation((cronExpression: string, func: () => void) => {
    func();
    return func as unknown as ScheduledTask;
  });

const _loggerSpy = jest.spyOn(logger, 'warn');

describe('UNIT - cronSyncKeycloakRoles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call the schedule task one time', () => {
    cronSyncKeycloakRoles();
    expect(_scheduleSpy).toHaveBeenCalledTimes(1);
  });

  it('should call the syncKeycloakRoles service one time', () => {
    cronSyncKeycloakRoles();
    expect(_syncKeycloakRoles).toHaveBeenCalledTimes(1);
  });

  it('should log a warning if the sync fails', () => {
    _syncKeycloakRoles.mockImplementationOnce(() => {
      throw new Error();
    });
    cronSyncKeycloakRoles();
    expect(_loggerSpy).toHaveBeenCalledTimes(1);
  })
});
