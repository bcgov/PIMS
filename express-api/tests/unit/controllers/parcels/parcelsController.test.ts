import { IParcel } from '@/controllers/parcels/IParcel';
import { faker } from '@faker-js/faker';
import controllers from '@/controllers';
import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';

describe('UNIT - Parcels', () => {
  const mockParcel: IParcel = {
    createdOn: faker.date.anytime().toLocaleString(),
    updatedOn: faker.date.anytime().toLocaleString(),
    updatedByName: faker.person.firstName(),
    updatedByEmail: faker.internet.email(),
    rowVersion: faker.number.binary(),
    id: faker.number.int(),
    propertyTypeId: 0,
    projectNumbers: [],
    projectWorkflow: 'Submit Surplus Property Process Project',
    projectStatus: 'Draft',
    name: faker.location.cardinalDirection() + faker.location.city(),
    description: faker.string.alpha(),
    classificationId: 0,
    classification: 'Core Operational',
    encumbranceReason: '',
    agencyId: 0,
    subAgency: 'BCHY',
    agency: 'EMPR',
    subAgencyFullName: 'BC Hydro',
    agencyFullName: 'Energy, Mines & Petroleum Resources',
    address: undefined,
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    isSensitive: false,
    isVisibleToOtherAgencies: false,
    pid: faker.string.numeric(),
    pin: faker.number.int(),
    landArea: 0,
    landLegalDescription: faker.string.alpha(),
    zoning: '',
    zoningPotential: '',
    evaluations: [],
    fiscals: [],
    buildings: [],
    parcels: [],
    subdivisions: [],
  };

  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /properties/parcels/:id', () => {
    it('should return the stub response of 501', async () => {
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 404 when resource is not found', async () => {
      mockRequest.params.parcelId = 'non-integer';
      await controllers.getParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /properties/parcels/:id', () => {
    beforeEach(() => {
      mockRequest.body = mockParcel;
    });

    it('should return the stub response of 501', async () => {
      await controllers.updateParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      await controllers.updateParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 404 when resource is not found', async () => {
      mockRequest.params.parcelId = 'non-integer';
      await controllers.updateParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('DELETE /properties/parcels/:id', () => {
    it('should return the stub response of 501', async () => {
      await controllers.deleteParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      await controllers.deleteParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 404 when resource is not found', async () => {
      mockRequest.params.parcelId = 'non-integer';
      await controllers.deleteParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('GET /properties/parcels', () => {
    it('should return the stub response of 501', async () => {
      await controllers.filterParcelsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.query.filterString = '1';
      await controllers.filterParcelsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('POST /properties/parcels', () => {
    it('should return the stub response of 501', async () => {
      await controllers.addParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 201 with a correct response body', async () => {
      mockRequest.body = mockParcel;
      await controllers.addParcel(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('POST /properties/filter', () => {
    it('should return the stub response of 501', async () => {
      await controllers.filterParcelsRequestBody(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.body = { filter: 'string' };
      await controllers.filterParcelsRequestBody(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('PUT /properties/parcel/:id/financial', () => {
    it('should return the stub response of 501', async () => {
      await controllers.filterParcelsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      mockRequest.body = mockParcel;
      await controllers.filterParcelsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /properties/parcel/check/pin-available', () => {
    it('should return the stub response of 501', async () => {
      await controllers.filterParcelsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return a status of 200', async () => {
      mockRequest.query.pin = '1234';
      await controllers.checkPinAvailable(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /properties/parcel/check/pid-available', () => {
    it('should return the stub response of 501', async () => {
      await controllers.filterParcelsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return a status of 200', async () => {
      mockRequest.query.pid = '1234';
      await controllers.checkPidAvailable(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });
});
