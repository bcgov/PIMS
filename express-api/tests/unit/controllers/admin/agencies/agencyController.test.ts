import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { faker } from '@faker-js/faker';
import { IAgency } from '@/controllers/admin/agencies/IAgency';
import { UUID } from 'crypto';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const {
  getAgencies,
  getAgenciesFiltered,
  addAgency,
  updateAgencyById,
  getAgencyById,
  deleteAgencyById,
} = controllers.admin;

const mockAgency: IAgency = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedByName: faker.person.firstName(),
  updatedByEmail: faker.internet.email(),
  id: faker.string.uuid() as UUID,
  name: faker.company.name(),
  isDisabled: false,
  isVisible: true,
  sortOrder: 0,
  type: '',
  code: 'BCH',
  parentId: faker.string.uuid() as UUID,
  description: '',
};

describe('UNIT - Agencies Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getAgencies', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of agencies', async () => {
      await getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller getAgenciesFiltered', () => {
    beforeEach(() => {
      mockRequest.body = {
        page: 0,
        quantity: 0,
        name: mockAgency.name,
        parentId: mockAgency.parentId,
        isDisabled: mockAgency.isDisabled,
        id: mockAgency.id,
        sort: [''],
      };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAgenciesFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of agencies', async () => {
      await getAgenciesFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller addAgency', () => {
    beforeEach(() => {
      mockRequest.body = mockAgency;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await addAgency(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 201 and the new agency', async () => {
      await addAgency(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Controller getAgencyById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockAgency.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the agency info', async () => {
      await getAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller updateAgencyById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockAgency.id}`;
      mockRequest.body = { ...mockAgency, name: 'new name' };
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the updated agency', async () => {
      await updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.jsonValue.name).toBe('new name');
    });
  });

  describe('Controller deleteAgencyById', () => {
    beforeEach(() => {
      mockRequest.params.id = `${mockAgency.id}`;
    });
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204', async () => {
      await deleteAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });
  });
});
