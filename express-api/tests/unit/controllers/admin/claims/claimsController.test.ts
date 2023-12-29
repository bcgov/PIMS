import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { IClaim } from '@/controllers/admin/claims/IClaim';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const { addClaim, getClaims, getClaimById, updateClaimById, deleteClaimById } = controllers.admin;

const mockClaim: IClaim = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedByName: faker.person.firstName(),
  updatedByEmail: faker.internet.email(),
  id: faker.string.uuid() as UUID,
  name: faker.company.name(),
  isDisabled: false,
  description: '',
  keycloakRoleId: faker.string.uuid() as UUID,
};

describe('UNIT - Claims Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getClaims', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getClaims(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of claims', async () => {
      await getClaims(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller addClaim', () => {
    beforeEach(() => {
      mockRequest.body = mockClaim;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await addClaim(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 201 and the new claim', async () => {
      await addClaim(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Controller getClaimById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockClaim.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getClaimById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the claim info', async () => {
      await getClaimById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller updateClaimById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockClaim.id}`;
      mockRequest.body = { ...mockClaim, name: 'new name' };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await updateClaimById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the updated claim', async () => {
      await updateClaimById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller deleteClaimById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockClaim.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteClaimById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204', async () => {
      await deleteClaimById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });
  });
});
