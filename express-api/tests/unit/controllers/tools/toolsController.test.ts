import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';

describe('UNIT - Tools', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /tools/ches/status/:messageId', () => {
    it('should return stub response 501', async () => {
      await controllers.getChesMessageStatusById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a ches status', async () => {
      mockRequest.params.messageId = '1';
      await controllers.getChesMessageStatusById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.messageId = '-1';
      await controllers.getChesMessageStatusById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('GET /tools/ches/status', () => {
    it('should return stub response 501', async () => {
      await controllers.getChesMessageStatuses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and many ches statuses', async () => {
      mockRequest.query.TransactionId = '1';
      await controllers.getChesMessageStatuses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('DELETE /tools/ches/cancel/:messageId', () => {
    it('should return stub response 501', async () => {
      await controllers.cancelChesMessageById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a ches object', async () => {
      mockRequest.params.messageId = '1';
      await controllers.cancelChesMessageById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('DELETE /tools/ches/cancel', () => {
    it('should return stub response 501', async () => {
      await controllers.cancelChesMessages(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and many ches objects', async () => {
      mockRequest.query.TransactionId = '1';
      await controllers.cancelChesMessages(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /tools/geocoder/addresses', () => {
    it('should return stub response 501', async () => {
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an address object', async () => {
      mockRequest.query.address = 'eeeeee';
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /tools/geocoder/parcels/pids/:siteId', () => {
    it('should return stub response 501', async () => {
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an address object', async () => {
      mockRequest.params.siteId = 'eeeeee';
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.siteId = '-1111';
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('POST /tools/import/properties', () => {
    it('should return stub response 501', async () => {
      await controllers.bulkImportProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });
    xit('should return status 200 and an address object', async () => {
      mockRequest.body = [];
      await controllers.bulkImportProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('DELETE /tools/import/properties', () => {
    it('should return stub response 501', async () => {
      await controllers.bulkDeleteProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });
    xit('should return status 200 and an address object', async () => {
      mockRequest.body = [];
      await controllers.bulkDeleteProperties(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('POST /tools/import/projects', () => {
    it('should return stub response 501', async () => {
      await controllers.bulkImportProjects(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });
    xit('should return status 200 and an address object', async () => {
      mockRequest.body = [];
      await controllers.bulkImportProjects(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('PATCH /tools/import/properties/financials', () => {
    it('should return stub response 501', async () => {
      await controllers.bulkUpdatePropertyFinancials(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });
    xit('should return status 200 and an address object', async () => {
      mockRequest.body = [];
      await controllers.bulkUpdatePropertyFinancials(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });
});
