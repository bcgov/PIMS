import { stubResponse } from '../../../utilities/stubResponse';
import { Response } from 'express';

// TODO: Remove this test, along with the stub controller when all routes are fully implemented.
describe('UNIT - Testing stub response', () => {
  const mockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  } as unknown as Response;
  it('should set status 200 and text message', async () => {
    const response = await stubResponse(mockResponse);
    expect(response.status).toHaveBeenLastCalledWith(501);
    expect(response.send).toHaveBeenLastCalledWith('Not yet implemented');
  });
});
