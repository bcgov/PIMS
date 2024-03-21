import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import controllers from '@/controllers';
import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';
import { Building } from '@/typeorm/Entities/Building';

describe('UNIT - Buildings', () => {
  const mockBuilding: Partial<Building> = {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: faker.string.uuid() as UUID,
    CreatedById: faker.string.uuid() as UUID,
    Id: faker.number.int(),
    PropertyTypeId: 0,
    Name: faker.location.cardinalDirection() + faker.location.city(),
    Description: faker.string.alpha(),
    ClassificationId: 0,
    EncumbranceReason: '',
    AgencyId: 0,
    Address1: '742 Evergreen Terrace',
    Postal: 'V8A 3E8',
    IsSensitive: false,
    IsVisibleToOtherAgencies: false,
    Evaluations: [],
    Fiscals: [],
    PID: faker.number.int(),
    PIN: faker.number.int(),
    BuildingConstructionTypeId: 0,
    BuildingFloorCount: 0,
    BuildingPredominateUseId: 0,
    BuildingOccupantTypeId: 0,
    LeaseExpiry: faker.date.anytime(),
    OccupantName: '',
    TransferLeaseOnSale: false,
    BuildingTenancy: '',
    BuildingTenancyUpdatedOn: faker.date.anytime(),
    RentableArea: 0,
  };

  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /properties/buildings/:id', () => {
    it('should return the stub response of 501', async () => {
      await controllers.getBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      await controllers.getBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 404 when resource is not found', async () => {
      mockRequest.params.parcelId = 'non-integer';
      await controllers.getBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /properties/buildings/:id', () => {
    beforeEach(() => {
      mockRequest.body = mockBuilding;
    });

    it('should return the stub response of 501', async () => {
      await controllers.updateBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      await controllers.updateBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 404 when resource is not found', async () => {
      mockRequest.params.buildingId = 'non-integer';
      await controllers.updateBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('DELETE /properties/buildings/:id', () => {
    it('should return the stub response of 501', async () => {
      await controllers.deleteBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.buildingId = '1';
      await controllers.deleteBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return 404 when resource is not found', async () => {
      mockRequest.params.buildingId = 'non-integer';
      await controllers.deleteBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('GET /properties/buildings', () => {
    it('should return the stub response of 501', async () => {
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.query.filterString = '1';
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('POST /properties/buildings', () => {
    it('should return the stub response of 501', async () => {
      await controllers.addBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 201 with a correct response body', async () => {
      mockRequest.body = mockBuilding;
      await controllers.addBuilding(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('POST /properties/filter', () => {
    it('should return the stub response of 501', async () => {
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.body = { filter: 'string' };
      await controllers.getBuildings(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('PUT /properties/building/:id/financial', () => {
    it('should return the stub response of 501', async () => {
      await controllers.updateBuildingFinancial(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      mockRequest.body = mockBuilding;
      await controllers.updateBuildingFinancial(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });
});
