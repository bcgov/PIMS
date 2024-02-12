import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceAgency,
} from '../../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { Agencies } from '@/typeorm/Entities/Agencies';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const { getAgencies, addAgency, updateAgencyById, getAgencyById, deleteAgencyById } =
  controllers.admin;

const _getAgencies = jest.fn().mockImplementation(() => [produceAgency()]);
const _postAgency = jest.fn().mockImplementation((agency) => agency);
const _getAgencyById = jest
  .fn()
  .mockImplementation((id: string) => ({ ...produceAgency(), Id: id }));
const _updateAgencyById = jest.fn().mockImplementation((agency) => agency);
const _deleteAgencyById = jest.fn().mockImplementation((id) => ({ ...produceAgency(), Id: id }));

jest.mock('@/services/admin/agencyServices', () => ({
  getAgencies: () => _getAgencies(),
  postAgency: (_agency: Agencies) => _postAgency(_agency),
  getAgencyById: (id: string) => _getAgencyById(id),
  updateAgencyById: (agency: Agencies) => _updateAgencyById(agency),
  deleteAgencyById: (id: string) => _deleteAgencyById(id),
}));

describe('UNIT - Agencies Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });

  describe('Controller getAgencies', () => {
    // TODO: enable other tests when controller is complete
    it('should return status 200 and a list of agencies', async () => {
      await getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 200 and a list of agencies', async () => {
      mockRequest.body = {
        page: 0,
        quantity: 0,
        name: 'a',
        parentId: 'a',
        isDisabled: 0,
        id: 'a',
      };
      await getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('Controller addAgency', () => {
    // TODO: enable other tests when controller is complete
    it('should return status 201 and the new agency', async () => {
      const agency = produceAgency();
      mockRequest.body = agency;
      await addAgency(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
      expect(mockResponse.sendValue.Id).toBe(agency.Id);
    });
  });

  describe('Controller getAgencyById', () => {
    it('should return status 200 and the agency info', async () => {
      mockRequest.params.id = '777';
      await getAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe('777');
    });
  });

  describe('Controller updateAgencyById', () => {
    it('should return status 200 and the updated agency', async () => {
      const agency = produceAgency();
      mockRequest.params.id = agency.Id;
      mockRequest.body = agency;
      await updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(agency.Id);
    });
  });

  describe('Controller deleteAgencyById', () => {
    it('should return status 200', async () => {
      const agency = produceAgency();
      mockRequest.params.id = agency.Id;
      await deleteAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(agency.Id);
    });
  });
});
