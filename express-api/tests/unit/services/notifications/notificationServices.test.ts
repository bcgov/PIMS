import { AppDataSource } from '@/appDataSource';
import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import {
  produceNotificationQueue,
  produceNotificationTemplate,
  produceProject,
  produceProjectNotification,
  produceSSO,
  produceUser,
} from 'tests/testUtils/factories';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import chesServices from '@/services/ches/chesServices';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { User } from '@/typeorm/Entities/User';

jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'save')
  .mockImplementation(
    async (notification: DeepPartial<NotificationQueue> & NotificationQueue) => notification,
  );

jest
  .spyOn(AppDataSource.getRepository(NotificationTemplate), 'findOne')
  .mockImplementation(async (options) =>
    produceNotificationTemplate({
      Id: (options.where as FindOptionsWhere<NotificationTemplate>).Id as number,
    }),
  );

jest
  .spyOn(AppDataSource.getRepository(User), 'findOne')
  .mockImplementation(async () => produceUser());

jest
  .spyOn(AppDataSource.getRepository(ProjectStatusNotification), 'find')
  .mockImplementation(async (options) => [
    produceProjectNotification({
      FromStatusId: (options.where as FindOptionsWhere<ProjectStatusNotification>)
        .FromStatusId as number,
      ToStatusId: (options.where as FindOptionsWhere<ProjectStatusNotification>)
        .ToStatusId as number,
    }),
  ]);

const _sendEmailAsync = jest.fn().mockImplementation(() => ({
  messages: [{ msgId: randomUUID(), to: faker.internet.email() }],
  txId: randomUUID(),
}));

jest.spyOn(chesServices, 'sendEmailAsync').mockImplementation(() => _sendEmailAsync());

describe('UNIT - Notification Services', () => {
  describe('sendNotification', () => {
    it('should send to ches and update the notification queue', async () => {
      const sendThis = produceNotificationQueue();
      const notifResult = await notificationServices.sendNotification(sendThis, produceSSO());
      expect(notifResult.ChesTransactionId).toBeTruthy();
      expect(notifResult.ChesMessageId).toBeTruthy();
    });
    it('should send a notification and fail, setting the status to Failed', async () => {
      const sendThis = produceNotificationQueue();
      _sendEmailAsync.mockImplementationOnce(() => {
        throw Error();
      });
      const notifResult = await notificationServices.sendNotification(sendThis, produceSSO());
      expect(notifResult.Status).toBe(NotificationStatus.Failed);
    });
  });
  describe('generateAccessRequestNotification', () => {
    it('should generate access request notification', async () => {
      const notifResult = await notificationServices.generateAccessRequestNotification(
        { FirstName: 'Test', LastName: 'Test' },
        1,
      );
      expect(notifResult.Status).toBe(NotificationStatus.Pending);
      expect(notifResult.TemplateId).toBe(1);
    });
  });
  describe('generateProjectNotifications', () => {
    it('should generate project notif', async () => {
      const project = produceProject();
      const result = await notificationServices.generateProjectNotifications(project, 1);
      expect(Array.isArray(result));
    });
  });
});
