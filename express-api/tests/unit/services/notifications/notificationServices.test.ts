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
import { DeepPartial, EntityTarget, FindOptionsWhere, ObjectLiteral, QueryRunner } from 'typeorm';
import chesServices from '@/services/ches/chesServices';
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
  manager: {
    find: async <Entity extends ObjectLiteral>(
      entityClass: EntityTarget<Entity>,
      options: Record<string, unknown>,
    ) => {
      if (entityClass === ProjectStatusNotification) {
        return _statusNotifFind(options);
      }
    },
    findOne: async <Entity extends ObjectLiteral>(
      entityClass: EntityTarget<Entity>,
      options: Record<string, unknown>,
    ) => {
      if (entityClass === User) {
        return _userFindOne();
      } else if (entityClass === NotificationTemplate) {
        return _notifTemplateFindOne(options);
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

    // Mock the getRepository method for NotificationQueue
    const _mockEntityManager = {
      findOne: jest.fn().mockResolvedValueOnce(notifQueue), // Mock findOne to return the notification
      save: jest.fn().mockResolvedValueOnce({
        ...notifQueue,
        Status: NotificationStatus.Completed,
        UpdatedById: user.Id,
      }),
    };

    const _mockStartTransaction = jest.fn(async () => {});
    const _mockRollbackTransaction = jest.fn(async () => {});
    const _mockCommitTransaction = jest.fn(async () => {});
    const _mockRelease = jest.fn(async () => {});

    // Mock createQueryRunner to return a QueryRunner with the mocked entity manager
    jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
      startTransaction: _mockStartTransaction,
      rollbackTransaction: _mockRollbackTransaction,
      commitTransaction: _mockCommitTransaction,
      release: _mockRelease,
      manager: _mockEntityManager,
    } as unknown as QueryRunner);

    jest.spyOn(chesServices, 'getStatusByIdAsync').mockResolvedValueOnce({
      status: 'completed',
      tag: 'sampleTag',
      txId: randomUUID(),
      updatedTS: Date.now(),
      createdTS: Date.now(),
    });
    const result = await notificationServices.updateNotificationStatus(notifQueue.Id, user);

    expect(result.Status).toBe(NotificationStatus.Completed);
    expect(result.UpdatedById).toBe(user.Id);
  });

  it('should throw an error if notification is not found', async () => {
    jest
      .spyOn(AppDataSource.getRepository(NotificationQueue), 'findOne')
      .mockResolvedValueOnce(null);

    const user = produceUser();
    const _mockStartTransaction = jest.fn(async () => {});
    const _mockRollbackTransaction = jest.fn(async () => {});
    const _mockCommitTransaction = jest.fn(async () => {});
    const _mockRelease = jest.fn(async () => {});

    const _mockEntityManager = {
      findOne: jest.fn().mockResolvedValueOnce(null), // Ensure findOne returns null
      save: jest.fn(),
    };

    // Spy on createQueryRunner and return the mocked QueryRunner
    jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
      startTransaction: _mockStartTransaction,
      rollbackTransaction: _mockRollbackTransaction,
      commitTransaction: _mockCommitTransaction,
      release: _mockRelease,
      manager: _mockEntityManager,
    } as unknown as QueryRunner);

    await expect(notificationServices.updateNotificationStatus(1, user)).rejects.toThrow(
      'Notification with id 1 not found.',
    );
  });
});

// describe('getProjectNotificationsInQueue', () => {
//   xit('should get notifications and update statuses if needed', async () => {
//     const projectId = 1;
//     const pageNumber = 0;
//     const pageSize = 10;
//     const user = produceUser();
//     const notifications = [
//       produceNotificationQueue(),
//       produceNotificationQueue(),
//       produceNotificationQueue(),
//     ];
//     notifications[0].ChesMessageId = '00000000-0000-0000-0000-000000000000';
//     notifications[1].ChesMessageId = '00000000-0000-0000-0000-000000000001';
//     notifications[2].ChesMessageId = '00000000-0000-0000-0000-000000000002';

//     jest
//       .spyOn(AppDataSource.getRepository(NotificationQueue), 'find')
//       .mockResolvedValueOnce(notifications);
//     jest.spyOn(notificationServices, 'updateNotificationStatus').mockImplementation(async (id) => {
//       const updatedNotification = {
//         ...notifications.find((notif) => notif.Id === id),
//         Status: NotificationStatus.Completed,
//       };
//       // Manually update the status in the notifications array to reflect the change
//       const index = notifications.findIndex((notif) => notif.Id === id);
//       notifications[index].Status = updatedNotification.Status;
//       return updatedNotification;
//     });
//     // jest.spyOn(AppDataSource, 'createQueryRunner').mockReturnValue({
//     //   ...jest.requireActual('@/appDataSource').createQueryRunner,
//     //   release: () => {},
//     //   startTransaction: jest.fn(),
//     //   commitTransaction: jest.fn(),
//     //   rollbackTransaction: jest.fn(), // Add this line
//     //   manager: {
//     //     find: async <Entity extends ObjectLiteral>(
//     //       entityClass: EntityTarget<Entity>,
//     //       options: Record<string, unknown>,
//     //     ) => {
//     //       if (entityClass === ProjectStatusNotification) {
//     //         return _statusNotifFind(options);
//     //       }
//     //     },
//     //     findOne: async <Entity extends ObjectLiteral>(
//     //       entityClass: EntityTarget<Entity>,
//     //       options: Record<string, unknown>,
//     //     ) => {
//     //       if (entityClass === User) {
//     //         return _userFindOne();
//     //       } else if (entityClass === NotificationTemplate) {
//     //         return _notifTemplateFindOne(options);
//     //       } else {
//     //         return {};
//     //       }
//     //     },
//     //     save: async <Entity extends ObjectLiteral, T extends DeepPartial<Entity>>(
//     //       entityClass: EntityTarget<Entity>,
//     //       obj: T,
//     //     ) => {
//     //       return _notifQueueSave(obj);
//     //     },
//     //   },
//     // });
//     jest.spyOn(chesServices, 'getStatusByIdAsync').mockImplementation(async (messageId) => {
//       if (
//         messageId === '00000000-0000-0000-0000-000000000000' ||
//         messageId === '00000000-0000-0000-0000-000000000001' ||
//         messageId === '00000000-0000-0000-0000-000000000002'
//       ) {
//         return {
//           status: 'completed',
//           tag: 'some-tag',
//           txId: 'some-txId',
//           updatedTS: Date.now(),
//           createdTS: Date.now() - 1000,
//         };
//       } else {
//         throw new Error(`No status found for messageId ${messageId}`);
//       }
//     });

//     const result = await notificationServices.getProjectNotificationsInQueue(
//       { projectId, pageNumber, pageSize },
//       user,
//     );

//     expect(result.items.length).toBe(3);
//     expect(result.items[0].Status).toBe(NotificationStatus.Completed);
//     expect(result.items[1].Status).toBe(NotificationStatus.Completed);
//     expect(result.items[2].Status).toBe(NotificationStatus.Completed);
//   });
// });
