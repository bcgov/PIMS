import { AppDataSource } from '@/appDataSource';
import chesServices, { IEmailSentResponse } from '@/services/ches/chesServices';
import notificationServices from '@/services/notifications/notificationServices';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { User } from '@/typeorm/Entities/User';
import failedEmailCheck from '@/utilities/failedEmailCheck';
import logger from '@/utilities/winstonLogger';
import { faker } from '@faker-js/faker';
import { produceNotificationQueue, produceUser } from 'tests/testUtils/factories';
import nunjucks from 'nunjucks';

const _notificationFindSpy = jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'find')
  .mockImplementation(async () => [produceNotificationQueue({}, true)]);

const _notificationServicesUpdateSpy = jest
  .spyOn(notificationServices, 'updateNotificationStatus')
  .mockImplementation(async () => produceNotificationQueue());

const _userFindSpy = jest
  .spyOn(AppDataSource.getRepository(User), 'findOneOrFail')
  .mockImplementation(async () => produceUser({ Username: 'system' }));

const _nunjucksSpy = jest.spyOn(nunjucks, 'render').mockImplementation(() => {
  'mock html goes here';
});

const _chesSendEmailAsyncSpy = jest
  .spyOn(chesServices, 'sendEmailAsync')
  .mockImplementation(async () => {
    return {
      messages: [{ msgId: faker.string.uuid, to: faker.internet.email }],
      txId: faker.string.uuid,
    } as unknown as IEmailSentResponse;
  });

const _loggerErrorSpy = jest.spyOn(logger, 'error');

describe('UNIT - failedEmailCheck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should attempt to send an email if notifications are outstanding', async () => {
    await failedEmailCheck();
    expect(_notificationServicesUpdateSpy).toHaveBeenCalledTimes(1);
    expect(_notificationFindSpy).toHaveBeenCalledTimes(2);
    expect(_userFindSpy).toHaveBeenCalledTimes(1);
    expect(_nunjucksSpy).toHaveBeenCalledTimes(1);
    expect(_chesSendEmailAsyncSpy).toHaveBeenCalledTimes(1);
  });

  it('should report an error if the email failed to send', async () => {
    _chesSendEmailAsyncSpy.mockImplementationOnce(async () => null);
    await failedEmailCheck();
    expect(_loggerErrorSpy).toHaveBeenCalledWith(
      'Error in failedEmailCheck: Email was attempted but not sent. This feature could be disabled.',
    );
    expect(_notificationServicesUpdateSpy).toHaveBeenCalledTimes(1);
    expect(_notificationFindSpy).toHaveBeenCalledTimes(2);
    expect(_userFindSpy).toHaveBeenCalledTimes(1);
    expect(_nunjucksSpy).toHaveBeenCalledTimes(1);
    expect(_chesSendEmailAsyncSpy).toHaveBeenCalledTimes(1);
  });
});
