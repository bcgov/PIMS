import { Request, Response } from 'express';
import errorHandler from '@/middleware/errorHandler';
import { MockReq, MockRes, getRequestHandlerMocks } from 'tests/testUtils/factories';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

describe('UNIT - errorHandler middleware', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });
  const nextFunction = jest.fn();

  it('should give error code 500 and send the passed error message when given a string', async () => {
    errorHandler('string', mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Error: string');
  });

  it('should give code 500 and send the error message when given an Error', async () => {
    errorHandler(new Error('error'), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Error: error');
  });

  it('should give expected code and send the error message when given an ErrorWithCode', async () => {
    errorHandler(new ErrorWithCode('withCode', 403), mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Error: withCode');
  });

  it('should give code 500 and generic error message when given something unexpected', async () => {
    errorHandler(undefined, mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith('Unknown server error.');
  });
});
