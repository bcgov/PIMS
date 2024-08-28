import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceUser,
  produceSSO,
  produceProject,
  produceNotificationQueue,
} from 'tests/testUtils/factories';
import projectServices from '@/services/projects/projectsServices';
import { randomUUID } from 'crypto';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { Roles } from '@/constants/roles';
import { NotificationStatus } from '@/services/notifications/notificationServices';

const _getUser = jest
  .fn()
  .mockImplementation((guid: string) => ({ ...produceUser(), KeycloakUserId: guid }));
const _getAgencies = jest.fn().mockImplementation(async () => [1, 2, 3]);
const _getProjectNotificationsInQueue = jest.fn().mockImplementation(async () => [1, 2, 3]);
const _getProjectById = jest.fn().mockImplementation(async (_id: number) => ({ AgencyId: 1 }));
const _getNotifById = jest
  .fn()
  .mockImplementation((id: number) => produceNotificationQueue({ Id: id }));
const _cancelNotifById = jest
  .fn()
  .mockImplementation((id: number) => produceNotificationQueue({ Id: id, Status: 2 }));
const _updateNotifStatus = jest
  .fn()
  .mockImplementation((id: number) => produceNotificationQueue({ Id: id }));

jest.mock('@/services/users/usersServices', () => ({
  getAgencies: () => _getAgencies(),
  getUser: () => _getUser(),
}));

jest.mock('@/services/notifications/notificationServices', () => ({
  ...jest.requireActual('@/services/notifications/notificationServices'),
  getProjectNotificationsInQueue: () => _getProjectNotificationsInQueue(),
  getNotificationById: (id: number) => _getNotifById(id),
  cancelNotificationById: (id: number) => _cancelNotifById(id),
  sendNotification: (notification: NotificationQueue) =>
    produceNotificationQueue({
      ...notification,
      ChesMessageId: randomUUID(),
      ChesTransactionId: randomUUID(),
    }),
  updateNotificationStatus: (id: number) => _updateNotifStatus(id),
}));

jest.mock('@/services/projects/projectsServices', () => ({
  getProjectById: () => _getProjectById,
}));

describe('UNIT - Testing controllers for notifications routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('getNotificationsByProjectId', () => {
    it('should return 400 if filter parsing fails', async () => {
      mockRequest.query = { invalidField: 'invalidValue' };

      await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Could not parse filter.' });
    });

    it('should return 400 if no valid filter provided', async () => {
      await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Could not parse filter.',
      });
    });

    it('should return 403 if user is not authorized', async () => {
      const kcUser = produceSSO();
      mockRequest.user = kcUser;
      mockRequest.query = { projectId: '1' };

      await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });

    it('should return 200 and notifications if user is authorized', async () => {
      const mockRequest = {
        query: { projectId: '123' },
        user: { agencies: [1] },
      } as unknown as Request;

      const mockProject = produceProject({
        Id: 123,
        AgencyId: 1,
      });

      const getProjectByIdSpy = jest
        .spyOn(projectServices, 'getProjectById')
        .mockResolvedValueOnce(mockProject);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(getProjectByIdSpy).toHaveBeenCalledWith(123);
    });
  });
  describe('resendNotifcationById', () => {
    it('should read a notification and try to send it through ches again, status 200', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [Roles.ADMIN] });
      await controllers.resendNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(1);
    });
    it('should 404 if notif not found', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [Roles.ADMIN] });
      _getNotifById.mockImplementationOnce(() => null);
      await controllers.resendNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
    it('should 403 if user lacks permissions', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [] });
      await controllers.resendNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(403);
    });
  });
  describe('cancelNotificationById', () => {
    it('should try to cancel a notification, status 200', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [Roles.ADMIN] });
      await controllers.cancelNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(1);
      expect(mockResponse.sendValue.Status).toBe(NotificationStatus.Cancelled);
    });
    it('should 404 if no notif found', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [Roles.ADMIN] });
      _getNotifById.mockImplementationOnce(() => null);
      await controllers.cancelNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
    it('should 400 if the notification came back with non-cancelled status', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [Roles.ADMIN] });
      _cancelNotifById.mockImplementationOnce((id: number) =>
        produceNotificationQueue({ Id: id, Status: NotificationStatus.Completed }),
      );
      await controllers.cancelNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue.Id).toBe(1);
      expect(mockResponse.sendValue.Status).not.toBe(NotificationStatus.Cancelled);
    });
    it('should 403 if user lacks permissions', async () => {
      mockRequest.params.id = '1';
      mockRequest.user = produceSSO({ client_roles: [] });
      await controllers.cancelNotificationById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(403);
    });
  });
});
