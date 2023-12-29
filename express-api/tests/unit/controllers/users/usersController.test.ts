import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';

describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /users/info ', () => {
    it('should return stub response 501', async () => {
      await controllers.getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and keycloak info', async () => {
      await controllers.getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /users/access/requests', () => {
    it('should return stub response 501', async () => {
      await controllers.getUserAccessRequestLatest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an access request', async () => {
      await controllers.getUserAccessRequestLatest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 204 if no requests', async () => {
      await controllers.getUserAccessRequestLatest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });
  });

  describe('GET /users/access/requests/:requestId', () => {
    it('should return stub response 501', async () => {
      await controllers.getUserAccessRequestById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an access request', async () => {
      mockRequest.params.requestId = '1';
      await controllers.getUserAccessRequestById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 if no request found', async () => {
      mockRequest.params.requestId = '-1';
      await controllers.getUserAccessRequestById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /users/access/requests/:requestId', () => {
    it('should return stub response 501', async () => {
      await controllers.updateUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an access request', async () => {
      mockRequest.params.requestId = '1';
      mockRequest.body = {};
      await controllers.updateUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 if malformed', async () => {
      mockRequest.params.requestId = '1';
      mockRequest.body = {};
      await controllers.updateUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /users/access/requests', () => {
    it('should return stub response 501', async () => {
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 201 and an access request', async () => {
      mockRequest.body = {};
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 if malformed', async () => {
      mockRequest.body = {};
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /users/agencies/:username', () => {
    it('should return stub response 501', async () => {
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an int array', async () => {
      mockRequest.params.username = 'john';
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 if no user exists', async () => {
      mockRequest.params.username = '11111';
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('GET /reports/users', () => {
    it('should return stub response 501', async () => {
      await controllers.getUserReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and csv data', async () => {
      await controllers.getUserReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 if malformed', async () => {
      await controllers.getUserReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /reports/users/filter', () => {
    it('should return stub response 501', async () => {
      await controllers.filterUserReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and csv data', async () => {
      mockRequest.body = {};
      await controllers.filterUserReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 if malformed', async () => {
      mockRequest.body = {};
      await controllers.filterUserReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
