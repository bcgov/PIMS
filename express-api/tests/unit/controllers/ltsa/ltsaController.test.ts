import { Request, Response } from 'express';
import controllers from '../../../../controllers';

describe('UNIT - Testing controllers for /ltsa routes', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;

  // TODO: remove stub test when controller is complete
  it('should return the stub response of 501', async () => {
    mockRequest.query = {
      id: '000382345',
    };

    await controllers.getLTSA(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(501);
  });

  // TODO: enable other tests when controller is complete
  xit('should return status 200 and LTSA information', async () => {
    mockRequest.query = {
      id: '000382345',
    };

    await controllers.getLTSA(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(200);
  });

  xit('should return status 404 when PID is not found', async () => {
    mockRequest.query = {
      id: 'notapid',
    };

    await controllers.getLTSA(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(404);
  });
});
