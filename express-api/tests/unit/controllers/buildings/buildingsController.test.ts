import { IBuilding } from '@/controllers/buildings/IBuilding';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import controllers from '@/controllers';
import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';

describe('UNIT - Buildings', () => {
  const mockBuilding: IBuilding = {
    createdOn: faker.date.anytime().toLocaleString(),
    updatedOn: faker.date.anytime().toLocaleString(),
    updatedById: faker.string.uuid() as UUID,
    createdById: faker.string.uuid() as UUID,
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
    evaluations: [],
    fiscals: [],
    parcelId: faker.number.int(),
    buildingConstructionTypeId: 0,
    buildingConstructionType: '',
    buildingFloorCount: 0,
    buildingPredominateUseId: 0,
    buildingPredominateUse: '',
    buildingOccupantTypeId: 0,
    buildingOccupantType: '',
    leaseExpiry: '',
    occupantName: '',
    transferLeaseOnSale: false,
    buildingTenancy: '',
    rentableArea: 0,
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
      await controllers.filterBuildingsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.query.filterString = '1';
      await controllers.filterBuildingsQueryString(mockRequest, mockResponse);
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
      await controllers.filterBuildingsRequestBody(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.body = { filter: 'string' };
      await controllers.filterBuildingsRequestBody(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('PUT /properties/building/:id/financial', () => {
    it('should return the stub response of 501', async () => {
      await controllers.filterBuildingsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return 200 with a correct response body', async () => {
      mockRequest.params.parcelId = '1';
      mockRequest.body = mockBuilding;
      await controllers.filterBuildingsQueryString(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });
});
