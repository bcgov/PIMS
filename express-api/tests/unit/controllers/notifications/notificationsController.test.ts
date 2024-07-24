import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceUser,
  produceSSO,
  produceProject,
} from 'tests/testUtils/factories';
import projectServices from '@/services/projects/projectsServices';

const _getUser = jest
  .fn()
  .mockImplementation((guid: string) => ({ ...produceUser(), KeycloakUserId: guid }));
const _getAgencies = jest.fn().mockImplementation(async () => [1, 2, 3]);
const _getProjectNotificationsInQueue = jest.fn().mockImplementation(async () => [1, 2, 3]);
const _getProjectById = jest.fn().mockImplementation(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_id: number) => ({ AgencyId: 1 }),
);

jest.mock('@/services/users/usersServices', () => ({
  getAgencies: () => _getAgencies(),
  getUser: () => _getUser(),
}));

jest.mock('@/services/notifications/notificationServices', () => ({
  getProjectNotificationsInQueue: () => _getProjectNotificationsInQueue(),
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

  describe('GET /projects/disposal/:id/notifications', () => {
    it('should return stub response 501', async () => {
      await controllers.getDisposalNotifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and disposal notifications', async () => {
      mockRequest.params.id = '1';
      await controllers.getDisposalNotifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '-1';
      await controllers.getDisposalNotifications(mockRequest, mockResponse);
    });
  });

  describe('POST /projects/disposal/notifications', () => {
    it('should return stub response 501', async () => {
      await controllers.filterDisposalNotifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.body = {};
      await controllers.filterDisposalNotifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.body = {};
      await controllers.filterDisposalNotifications(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('PUT /projects/disposal/:id/notifications', () => {
    it('should return stub response 501', async () => {
      await controllers.cancelDisposalNotification(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.cancelDisposalNotification(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '-1';
      await controllers.cancelDisposalNotification(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /notifications/queue', () => {
    it('should return stub response 501', async () => {
      await controllers.getNotificationsInQueue(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      await controllers.getNotificationsInQueue(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

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
        params: { projectId: '123' },
        user: { agencies: [1] },
      } as unknown as Request;

      const mockProject = produceProject({
        Id: 4724659117359104,
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
      expect(getProjectByIdSpy).toHaveBeenCalledWith('4724659117359104');
    });
  });

  describe('POST /notifications/queue/filter', () => {
    it('should return stub response 501', async () => {
      await controllers.filterNotificationsInQueue(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.body = {};
      await controllers.filterNotificationsInQueue(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      await controllers.filterNotificationsInQueue(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /notifications/queue/:id', () => {
    it('should return stub response 501', async () => {
      await controllers.getNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.getNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '-1';
      await controllers.getNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('PUT /notifications/queue/:id', () => {
    it('should return stub response 501', async () => {
      await controllers.updateNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = {};
      await controllers.updateNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '1';
      mockRequest.body = {};
      await controllers.updateNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('PUT /notifications/queue/:id/resend', () => {
    it('should return stub response 501', async () => {
      await controllers.resendNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.resendNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '1';
      await controllers.resendNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });
  });

  describe('PUT /notifications/queue/:id', () => {
    it('should return stub response 501', async () => {
      await controllers.cancelNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.cancelNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '1';
      await controllers.cancelNotificationInQueueById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /notifications/templates', () => {
    it('should return stub response 501', async () => {
      await controllers.getAllNotificationTemplates(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      await controllers.getAllNotificationTemplates(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /notifications/templates/:id', () => {
    it('should return stub response 501', async () => {
      await controllers.getNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.getNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '-1';
      await controllers.getNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('PUT /notifications/templates/:id', () => {
    it('should return stub response 501', async () => {
      await controllers.updateNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.updateNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '-1';
      await controllers.updateNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('DELETE /notifications/templates/:id', () => {
    it('should return stub response 501', async () => {
      await controllers.deleteNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.params.id = '1';
      await controllers.deleteNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.params.id = '1';
      await controllers.deleteNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /notifications/templates', () => {
    it('should return stub response 501', async () => {
      await controllers.addNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 for valid request', async () => {
      mockRequest.body = {};
      await controllers.addNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.body = {};
      await controllers.addNotificationTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /notifications/templates/:templateId/projects/:projectId', () => {
    it('should return stub response 501', async () => {
      await controllers.sendNotificationsForTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 201 for valid request', async () => {
      mockRequest.body = {};
      await controllers.sendNotificationsForTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });

    xit('should return 400 for bad request', async () => {
      mockRequest.body = {};
      await controllers.sendNotificationsForTemplate(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
