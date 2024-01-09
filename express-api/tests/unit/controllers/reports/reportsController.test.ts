import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';
import {
  getSpreadsheetProjectsReports,
  getSpreadsheetPropertiesReports,
  getSpreadsheetUsersReports,
} from '@/controllers/reports/reportsController';

describe('UNIT - Reports', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /reports/projects', () => {
    it('should return stub response 501', async () =>{ 
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
});
