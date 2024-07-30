import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';
import { submitErrorReport } from '@/controllers/reports/reportsController';
import { ErrorReport } from '@/controllers/reports/errorReportSchema';
import { Roles } from '@/constants/roles';
import logger from '@/utilities/winstonLogger';
import nunjucks from 'nunjucks';
import chesServices from '@/services/ches/chesServices';

const error: ErrorReport = {
  user: {
    client_roles: [Roles.ADMIN],
    preferred_username: '123@idir',
    display_name: 'Tester',
    email: 'tester@gov.bc.ca',
    first_name: 'firstname',
    last_name: 'lastname',
  },
  userMessage: 'Help, it broke.',
  timestamp: new Date().toLocaleString(),
  error: new Error('Bad Error'),
  url: 'pathname',
};

jest.spyOn(nunjucks, 'render').mockImplementation(() => 'html body expected here');
jest.spyOn(chesServices, 'sendEmailAsync').mockImplementation(async () => ({
  messages: [{ msgId: '', to: '' }],
  txId: 'id',
}));

describe('UNIT - Reports', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('POST /reports/error', () => {
    it('should return 200 status and error info in body', async () => {
      mockRequest.body = error;
      const mockLogger = jest.spyOn(logger, 'info');
      await submitErrorReport(mockRequest, mockResponse);
      expect(mockLogger).toHaveBeenCalledTimes(1);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return 400 status when body does not match zod schema', async () => {
      mockRequest.body = {
        fakeFields: 'Should fail check',
      };
      await submitErrorReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
