import { Request, Response } from 'express';
import controllers from '../../../../../controllers';

const mockRequest = {
  user: {
    idir_user_guid: 'W7802F34D2390EFA9E7JK15923770279',
    identity_provider: 'idir',
    idir_username: 'JOHNDOE',
    name: 'Doe, John CITZ:EX',
    preferred_username: 'a7254c34i2755fea9e7ed15918356158@idir',
    given_name: 'John',
    display_name: 'Doe, John CITZ:EX',
    family_name: 'Doe',
    email: 'john.doe@gov.bc.ca',
    client_roles: ['Admin'],
  },
} as Request;

const mockResponse = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as unknown as Response;

describe('UNIT - Testing controllers for /admin/accessRequest GET route', () => {
  // TODO: remove stub test when controller is complete
  it('should return the stub response of 501', async () => {
    await controllers.getAccessRequests(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(501);
  });

  // TODO: enable other tests when controller is complete
  xit('should return status 200 and a list of access requests', async () => {
    await controllers.getAccessRequests(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(200);
  });

  xit('should return status 400 when a bad request is received', async () => {
    await controllers.getAccessRequests(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(400);
  });
});

describe('UNIT - Testing controllers for /admin/accessRequest DELETE route', () => {
  // TODO: remove stub test when controller is complete
  it('should return the stub response of 501', async () => {
    await controllers.deleteAccessRequest(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(501);
  });

  // TODO: enable other tests when controller is complete
  xit('should return status 204 upon successful deletion', async () => {
    await controllers.deleteAccessRequest(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(204);
  });

  xit('should return status 400 when a bad request is received', async () => {
    await controllers.deleteAccessRequest(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(400);
  });
});
