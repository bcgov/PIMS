import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const { getAccessRequests, deleteAccessRequest } = controllers.admin;

describe('UNIT - Access Requests Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });
  describe('Controller getAccessRequests', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAccessRequests(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of access requests', async () => {
      await getAccessRequests(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await getAccessRequests(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('Controller deleteAccessRequest', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204 upon successful deletion', async () => {
      await deleteAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await deleteAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
