import controllers from '../../../controllers';
import { Request, Response } from 'express';

describe('UNIT - Testing controller for /health routes', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;
  it('should set status 200 and text message', async () => {
    await controllers.healthCheck(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(200);
    expect(mockResponse.send).toHaveBeenLastCalledWith('/health endpoint reached. API running.');
  });
});
