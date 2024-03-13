import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import controllers from '@/controllers';
import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { GeoPoint } from '@/typeorm/Entities/abstractEntities/Property';

const mockPoint: GeoPoint = {
  x: 1.23,
  y: 4.56,
};
describe('UNIT - Parcels', () => {
  const mockParcel: Partial<Parcel> = {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: faker.string.uuid() as UUID,
    CreatedById: faker.string.uuid() as UUID,
    Id: faker.number.int(),
    PropertyTypeId: 0,
    Location: mockPoint,
    ProjectNumbers: '',
    Name: faker.location.cardinalDirection() + faker.location.city(),
    Description: faker.string.alpha(),
    ClassificationId: 0,
    AgencyId: 0,
    IsSensitive: false,
    IsVisibleToOtherAgencies: false,
    PID: faker.number.int(),
    PIN: faker.number.int(),
    LandArea: 0,
    LandLegalDescription: faker.string.alpha(),
    Zoning: '',
    ZoningPotential: '',
    ParentParcelId: 1,
    AdministrativeAreaId: 2,
    Address1: '742 Evergreen Terrace',
    Postal: 'V8A 3E8',
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
