import controllers from '../../../controllers';
import { Request, Response } from 'express';

// TODO: Remove this test, along with the stub controller when all routes are fully implemented.
describe('UNIT - Testing stub controller', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;
  it('should set status 200 and text message', async () => {
    await controllers.stubController(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(501);
    expect(mockResponse.send).toHaveBeenLastCalledWith('Not yet implemented');
  });
});
