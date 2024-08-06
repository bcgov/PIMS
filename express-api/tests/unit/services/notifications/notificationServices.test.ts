import { AppDataSource } from '@/appDataSource';
import notificationServices, {
  NotificationStatus,
} from '@/services/notifications/notificationServices';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import {
  produceAgency,
  produceNotificationQueue,
  produceNotificationTemplate,
  produceProject,
  produceProjectNotification,
  produceSSO,
  produceUser,
} from 'tests/testUtils/factories';
import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, UpdateResult } from 'typeorm';
import chesServices, { IChesStatusResponse } from '@/services/ches/chesServices';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { User } from '@/typeorm/Entities/User';
import { Agency } from '@/typeorm/Entities/Agency';

const _notifQueueSave = jest
  .fn()
  .mockImplementation(
    async (notification: DeepPartial<NotificationQueue> & NotificationQueue) => notification,
  );

const _notifTemplateFindOne = jest.fn().mockImplementation(async (options) =>
  produceNotificationTemplate({
    Id: (options.where as FindOptionsWhere<NotificationTemplate>).Id as number,
  }),
);

const _userFindOne = jest.fn().mockImplementation(async () => produceUser());

jest
  .spyOn(AppDataSource.getRepository(User), 'findOne')
  .mockImplementation(async () => produceUser());
const _findTemplateRepo = jest
  .spyOn(AppDataSource.getRepository(NotificationTemplate), 'findOne')
  .mockImplementation(async () => produceNotificationTemplate());

jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'save')
  .mockImplementation(async (obj: DeepPartial<NotificationQueue> & NotificationQueue) => obj);

const _notifQueueFindOne = jest.fn().mockImplementation(async (options) =>
  produceNotificationQueue({
    Id: (options.where as FindOptionsWhere<NotificationQueue>).Id as number,
  }),
);
const _notifQueueFind = jest.fn().mockImplementation(async (options) => [
  produceNotificationQueue({
    Id: (options.where as FindOptionsWhere<NotificationQueue>).Id as number,
  }),
]);
jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'find')
  .mockImplementation(_notifQueueFind);
jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'findOne')
  .mockImplementation(_notifQueueFindOne);
jest
  .spyOn(AppDataSource.getRepository(NotificationQueue), 'update')
  .mockImplementation(async (): Promise<UpdateResult> => ({ raw: {}, generatedMaps: [] }));

const _statusNotifFind = jest.fn().mockImplementation(async (options) => [
  produceProjectNotification({
    FromStatusId: (options.where as FindOptionsWhere<ProjectStatusNotification>)
      .FromStatusId as number,
    ToStatusId: (options.where as FindOptionsWhere<ProjectStatusNotification>).ToStatusId as number,
  }),
]);

jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
  ...jest.requireActual('@/appDataSource').createQueryRunner,
  release: () => {},
  rollbackTransaction: () => {},
  startTransaction: () => {},
  manager: {
    find: async <Entity extends ObjectLiteral>(
      entityClass: EntityTarget<Entity>,
      options: Record<string, unknown>,
    ) => {
      if (entityClass === ProjectStatusNotification) {
        return _statusNotifFind(options);
      }
      if (entityClass === NotificationQueue) {
        return [_notifQueueFindOne(options)];
      }
      return null;
    },
    findOne: async <Entity extends ObjectLiteral>(
      entityClass: EntityTarget<Entity>,
      options: Record<string, unknown>,
    ) => {
      if (entityClass === User) {
        return _userFindOne();
      } else if (entityClass === NotificationTemplate) {
        return _notifTemplateFindOne(options);
      } else if (entityClass === NotificationQueue) {
        return _notifQueueFindOne(options);
      } else {
        return {};
      }
    },
    save: async <Entity extends ObjectLiteral, T extends DeepPartial<Entity>>(
      entityClass: EntityTarget<Entity>,
      obj: T,
    ) => {
      return _notifQueueSave(obj);
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _agenciesQueryBuilder: any = {
  select: () => _agenciesQueryBuilder,
  leftJoin: () => _agenciesQueryBuilder,
  where: () => _agenciesQueryBuilder,
  andWhere: () => _agenciesQueryBuilder,
  getMany: () => [produceAgency()],
};

jest
  .spyOn(AppDataSource.getRepository(Agency), 'createQueryBuilder')
  .mockImplementation(() => _agenciesQueryBuilder);

const _sendEmailAsync = jest.fn().mockImplementation(() => ({
  messages: [{ msgId: randomUUID(), to: faker.internet.email() }],
  txId: randomUUID(),
}));

const _cancelEmailByIdAsync = jest.fn().mockImplementation(
  async (): Promise<IChesStatusResponse> => ({
    status: 'completed',
    tag: 'sampleTag',
    txId: randomUUID(),
    updatedTS: Date.now(),
    createdTS: Date.now(),
    msgId: randomUUID(),
  }),
);

jest.spyOn(chesServices, 'sendEmailAsync').mockImplementation(() => _sendEmailAsync());
jest.spyOn(chesServices, 'cancelEmailByIdAsync').mockImplementation(() => _cancelEmailByIdAsync());
const _getStatusByIdAsync = jest.spyOn(chesServices, 'getStatusByIdAsync').mockResolvedValue({
  status: 'completed',
  tag: 'sampleTag',
  txId: randomUUID(),
  updatedTS: Date.now(),
  createdTS: Date.now(),
  msgId: randomUUID(),
});

describe('UNIT - Notification Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('sendNotification', () => {
    it('should send to ches and update the notification queue', async () => {
      const sendThis = produceNotificationQueue();
      sendThis.ChesMessageId = '00000000-0000-0000-0000-000000000000';
      sendThis.ChesTransactionId = '00000000-0000-0000-0000-000000000001';
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
      _findTemplateRepo.mockImplementationOnce(async () => produceNotificationTemplate({ Id: 1 }));
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
describe('updateNotificationStatus', () => {
  it('should update the status of a notification', async () => {
    const user = produceUser();
    const notifQueue = produceNotificationQueue();
    notifQueue.ChesMessageId = randomUUID();

    const result = await notificationServices.updateNotificationStatus(notifQueue.Id, user);

    expect(result.Status).toBe(NotificationStatus.Completed);
    expect(result.UpdatedById).toBe(user.Id);
  });

  it('should throw an error if notification is not found', () => {
    const user = produceUser();
    _notifQueueFindOne.mockImplementationOnce(async () => null);

    expect(
      async () => await notificationServices.updateNotificationStatus(1, user),
    ).rejects.toThrow('Notification with id 1 not found.');
  });

  it('should not update the status if the CHES status is non-standard', async () => {
    const notification = produceNotificationQueue();
    _notifQueueFindOne.mockImplementationOnce(async () => notification);
    _getStatusByIdAsync.mockResolvedValueOnce({
      status: 'unknown',
      tag: 'sampleTag',
      txId: randomUUID(),
      updatedTS: new Date(notification.UpdatedOn).getTime(),
      createdTS: Date.now(),
      msgId: randomUUID(),
    });
    const response = await notificationServices.updateNotificationStatus(
      notification.Id,
      produceUser(),
    );
    // Expect that notification was not updated.
    expect(response.Status).toBe(notification.Status);
    expect(response.UpdatedOn).toBe(notification.UpdatedOn);
  });

  it('should not update the notification if the CHES response is a number', async () => {
    const notification = produceNotificationQueue();
    _getStatusByIdAsync.mockResolvedValueOnce({
      status: 234 as unknown as string,
      tag: 'sampleTag',
      txId: randomUUID(),
      updatedTS: new Date(notification.UpdatedOn).getTime(),
      createdTS: Date.now(),
      msgId: randomUUID(),
    });
    const response = await notificationServices.updateNotificationStatus(
      notification.Id,
      produceUser(),
    );
    // Expect that notification was not updated.
    expect(response.Status).toBe(notification.Status);
  });
});
describe('convertChesStatusToNotificationStatus', () => {
  it('should return NotificationStatus.Accepted for "accepted"', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('accepted')).toBe(
      NotificationStatus.Accepted,
    );
  });

  it('should return NotificationStatus.Pending for "pending"', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('pending')).toBe(
      NotificationStatus.Pending,
    );
  });

  it('should return NotificationStatus.Cancelled for "cancelled"', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('cancelled')).toBe(
      NotificationStatus.Cancelled,
    );
  });

  it('should return NotificationStatus.Failed for "failed"', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('failed')).toBe(
      NotificationStatus.Failed,
    );
  });

  it('should return NotificationStatus.Completed for "completed"', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('completed')).toBe(
      NotificationStatus.Completed,
    );
  });

  it('should return NotificationStatus.Failed for unknown status', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('unknown')).toBe(null);
  });

  it('should return NotificationStatus.Failed for an empty string', () => {
    expect(notificationServices.convertChesStatusToNotificationStatus('')).toBe(null);
  });
});
describe('getProjectNotificationsInQueue', () => {
  it('should get notifications and update statuses if needed', async () => {
    const projectId = 1;
    const page = 0;
    const pageSize = 10;
    const user = produceUser();
    const notifications = [
      produceNotificationQueue({ Status: NotificationStatus.Completed }),
      produceNotificationQueue({ Status: NotificationStatus.Completed }),
      produceNotificationQueue({ Status: NotificationStatus.Completed }),
    ];
    notifications[0].ChesMessageId = '00000000-0000-0000-0000-000000000000';
    notifications[1].ChesMessageId = '00000000-0000-0000-0000-000000000001';
    notifications[2].ChesMessageId = '00000000-0000-0000-0000-000000000002';

    _notifQueueFind.mockImplementationOnce(async () => notifications);
    const result = await notificationServices.getProjectNotificationsInQueue(
      { projectId, page, pageSize },
      user,
    );
    expect(result.items).toBeDefined();
    expect(result.items.length).toBe(3);

    if (result.items.length > 0) {
      expect(result.items[0].Status).toBe(NotificationStatus.Completed);
      expect(result.items[1].Status).toBe(NotificationStatus.Completed);
      expect(result.items[2].Status).toBe(NotificationStatus.Completed);
    }
  });
});
describe('cancelAllProjectNotifications', () => {
  it('should return a count of successful and failed cancellations', async () => {
    const result = await notificationServices.cancelAllProjectNotifications(faker.number.int());
    expect(isNaN(result.succeeded)).toBe(false);
    expect(isNaN(result.failed)).toBe(false);
  });
});
