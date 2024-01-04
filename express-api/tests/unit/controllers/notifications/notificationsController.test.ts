import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from 'tests/testUtils/factories';

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
