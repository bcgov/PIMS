import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';
import {
  getSpreadsheetProjectsReports,
  getSpreadsheetPropertiesReports,
  getSpreadsheetUsersReports,
  submitErrorReport
} from '@/controllers/reports/reportsController';
import { ErrorReport } from '@/controllers/reports/errorReportSchema';
import { Roles } from '@/constants/roles';
import logger from '@/utilities/winstonLogger';

describe('UNIT - Reports', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /reports/projects', () => {
    it('should return stub response 501', async () => {
      await getSpreadsheetProjectsReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a csv file', async () => {
      mockRequest.headers.accept = 'text/csv';
      await getSpreadsheetProjectsReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 200 with an excel file', async () => {
      mockRequest.headers.accept = 'application/application/vnd.ms-excel';
      await getSpreadsheetProjectsReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);

      mockRequest.headers.accept =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      await getSpreadsheetProjectsReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /reports/spreadsheets/properties', () => {
    it('should return stub response 501', async () => {
      await getSpreadsheetPropertiesReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a csv file', async () => {
      mockRequest.headers.accept = 'text/csv';
      await getSpreadsheetPropertiesReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 200 with an excel file', async () => {
      mockRequest.headers.accept = 'application/vnd.ms-excel';
      await getSpreadsheetPropertiesReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);

      mockRequest.headers.accept =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      await getSpreadsheetPropertiesReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /reports/user', () => {
    it('should return stub response 501', async () => {
      await getSpreadsheetUsersReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a csv file', async () => {
      mockRequest.headers.accept = 'text/csv';
      await getSpreadsheetUsersReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 200 with an excel file', async () => {
      mockRequest.headers.accept = 'application/vnd.ms-excel';
      await getSpreadsheetUsersReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);

      mockRequest.headers.accept =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      await getSpreadsheetUsersReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  // TODO: Add additional test cases when this endpoint starts using CHES
  describe('POST /reports/error', () => {
    const error: ErrorReport = {
      user: {
        client_roles: [Roles.ADMIN],
        preferred_username: '123@idir',
        display_name: 'Tester',
        email: 'tester@gov.bc.ca',
      },
      userMessage: 'Help, it broke.',
      timestamp: new Date().toLocaleString(),
      error: new Error('Bad Error'),
    }

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return 200 status and error info in body', async () => {
      mockRequest.body = error;
      const mockLogger = jest.spyOn(logger, 'info');
      await submitErrorReport(mockRequest, mockResponse);
      expect(mockLogger).toHaveBeenCalledTimes(1);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue).toBe(error);
    })

    it('should return 400 status when body does not match zod schema', async () => {
      mockRequest.body = {
        fakeFields: 'Should fail check'
      };
      await submitErrorReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    })
  })
});
