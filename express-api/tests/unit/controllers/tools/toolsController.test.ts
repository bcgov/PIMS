import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceEmail,
  produceEmailStatus,
  produceSSO,
  produceGeocoderAddress,
  producePidsResponse,
} from '../../../testUtils/factories';
import { randomUUID } from 'crypto';

const _getChesMessageStatusById = jest.fn().mockImplementation(() => produceEmailStatus({}));

const _getChesMessageStatuses = jest
  .fn()
  .mockImplementation(() => [produceEmailStatus({ status: 'pending' })]);

const _cancelEmailByIdAsync = jest
  .fn()
  .mockImplementation(() => produceEmailStatus({ status: 'cancelled' }));

const _cancelEmailsAsync = jest
  .fn()
  .mockImplementation(() => [produceEmailStatus({ status: 'cancelled' })]);

const _sendEmailAsync = jest
  .fn()
  .mockImplementation(() => ({ messages: [{ msgId: 'a', to: 'a' }], txId: 'a' }));

jest.mock('@/services/ches/chesServices.ts', () => ({
  getStatusByIdAsync: () => _getChesMessageStatusById(),
  getStatusesAsync: () => _getChesMessageStatuses(),
  cancelEmailByIdAsync: () => _cancelEmailByIdAsync(),
  cancelEmailsAsync: () => _cancelEmailsAsync(),
  sendEmailAsync: () => _sendEmailAsync(),
}));

const _getSiteAddresses = jest.fn().mockImplementation(() => [produceGeocoderAddress()]);
const _getPids = jest.fn().mockImplementation(() => producePidsResponse());

jest.mock('@/services/geocoder/geocoderService', () => ({
  getSiteAddresses: () => _getSiteAddresses(),
  getPids: () => _getPids(),
}));

describe('UNIT - Tools', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /tools/ches/status/:messageId', () => {
    it('should return status 200 and a ches status', async () => {
      mockRequest.params.messageId = randomUUID();
      await controllers.getChesMessageStatusById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 400', async () => {
      mockRequest.params.messageId = '-1';
      await controllers.getChesMessageStatusById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should throw an error when getChesMessageStatusById throws an error', async () => {
      _getChesMessageStatusById.mockImplementationOnce(() => {
        throw new Error();
      });
      mockRequest.params.messageId = randomUUID();
      expect(
        async () => await controllers.getChesMessageStatusById(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /tools/ches/status', () => {
    it('should return status 200 and many ches statuses', async () => {
      mockRequest.query.status = 'pending';
      await controllers.getChesMessageStatuses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue));
    });
    it('should return status 400', async () => {
      mockRequest.query.status = ['a'];
      await controllers.getChesMessageStatuses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when getChesMessageStatuses throws an error', async () => {
      mockRequest.query.status = 'pending';
      _getChesMessageStatuses.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await controllers.getChesMessageStatuses(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('DELETE /tools/ches/cancel/:messageId', () => {
    it('should return status 200 and a ches object', async () => {
      mockRequest.params.messageId = randomUUID();
      await controllers.cancelChesMessageById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 400', async () => {
      mockRequest.params.messageId = '-11';
      await controllers.cancelChesMessageById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when cancelEmailByIdAsync throws an error', async () => {
      mockRequest.params.messageId = randomUUID();
      _cancelEmailByIdAsync.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await controllers.cancelChesMessageById(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('DELETE /tools/ches/cancel', () => {
    it('should return status 200 and many ches objects', async () => {
      mockRequest.query.status = 'pending';
      await controllers.cancelChesMessages(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 400', async () => {
      mockRequest.query.status = ['a'];
      await controllers.cancelChesMessages(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when cancelEmailAsync throws an error', async () => {
      _cancelEmailsAsync.mockImplementationOnce(() => {
        throw new Error();
      });
      mockRequest.query.status = 'pending';
      expect(
        async () => await controllers.cancelChesMessages(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('POST /tools/ches', () => {
    it('should return status 201', async () => {
      mockRequest.body = produceEmail({});
      mockRequest.user = produceSSO();
      await controllers.sendChesMessage(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
    it('should throw an error when sendEmailAsync throws an error', async () => {
      _sendEmailAsync.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(
        async () => await controllers.sendChesMessage(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('GET /tools/geocoder/addresses', () => {
    it('should return 200 on just an address', async () => {
      mockRequest.query.address = '1999 Tester St';
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return 200 on maxResults and minScore provided', async () => {
      mockRequest.query.address = '1999 Tester St';
      mockRequest.query.maxResults = '1';
      mockRequest.query.minScore = '1';
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should 200 and ignore poorly formatted maxResults and minScore', async () => {
      mockRequest.query.address = '1999 Tester St';
      mockRequest.query.maxResults = 'aaabbb';
      mockRequest.query.minScore = 'aaabbb';
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /tools/geocoder/parcels/pids/:siteId', () => {
    it('should return 200', async () => {
      mockRequest.params.siteId = randomUUID();
      await controllers.searchGeocoderAddresses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
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
