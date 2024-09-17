import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceAgency,
  produceUser,
} from '../../../testUtils/factories';
import { Roles } from '@/constants/roles';
import { Agency } from '@/typeorm/Entities/Agency';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const _getAgencies = jest.fn().mockImplementation(() => [produceAgency()]);
const _postAgency = jest.fn().mockImplementation((agency) => agency);
const _getAgencyById = jest
  .fn()
  .mockImplementation((id: string) => ({ ...produceAgency(), Id: id }));
const _updateAgencyById = jest.fn().mockImplementation((agency) => agency);
const _deleteAgencyById = jest.fn().mockImplementation((id) => ({ ...produceAgency(), Id: id }));

jest.mock('@/services/agencies/agencyServices', () => ({
  getAgencies: () => _getAgencies(),
  addAgency: (_agency: Agency) => _postAgency(_agency),
  getAgencyById: (id: string) => _getAgencyById(id),
  updateAgencyById: (agency: Agency) => _updateAgencyById(agency),
  deleteAgencyById: (id: string) => _deleteAgencyById(id),
}));

const _getKeycloakUserRoles = jest.fn().mockImplementation(() => [{ name: Roles.ADMIN }]);

jest.mock('@/services/keycloak/keycloakService.ts', () => ({
  getKeycloakUserRoles: () => _getKeycloakUserRoles(),
}));

jest.mock('@/services/users/usersServices', () => ({
  getUser: jest.fn().mockImplementation(() => produceUser()),
}));

describe('UNIT - Agencies Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockRequest.setPimsUser({ RoleId: Roles.ADMIN });
    mockResponse = mockRes;
  });

  describe('Controller getAgencies', () => {
    it('should return status 200 and a list of agencies', async () => {
      await controllers.getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 200 and a list of agencies with trimmed properties if not an Admin', async () => {
      mockRequest.setPimsUser({ hasOneOfRoles: () => false });
      await controllers.getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.data[0].Name).toBeDefined();
      expect(mockResponse.sendValue.data[0].CreatedBy).not.toBeDefined();
    });

    it('should return status 200 and a list of agencies when given a filter', async () => {
      mockRequest.query = {
        name: 'a',
        parentId: '0',
        id: '1',
      };
      await controllers.getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 400 when the filter has incorrect typing', async () => {
      mockRequest.query = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: 0 as any,
      };
      await controllers.getAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('Controller addAgency', () => {
    it('should return status 201 and the new agency', async () => {
      const agency = produceAgency();
      mockRequest.body = agency;
      await controllers.addAgency(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
      expect(mockResponse.sendValue.Id).toBe(agency.Id);
    });
    it('should throw an error when the postAgency service fails', async () => {
      _postAgency.mockImplementationOnce(() => {
        throw new ErrorWithCode('', 400);
      });
      expect(async () => await controllers.addAgency(mockRequest, mockResponse)).rejects.toThrow();
    });
  });

  describe('Controller getAgencyById', () => {
    it('should return status 200 and the agency info when given specific id', async () => {
      mockRequest.params.id = '777';
      await controllers.getAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(777);
    });
    it('should return status 404', async () => {
      _getAgencyById.mockImplementationOnce(() => null);
      await controllers.getAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
    it('should throw an error when getAgencyById service throws an error', async () => {
      _getAgencyById.mockImplementationOnce(() => {
        throw new ErrorWithCode('', 400);
      });
      expect(
        async () => await controllers.getAgencyById(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });

  describe('Controller updateAgencyById', () => {
    it('should return status 200 and the updated agency', async () => {
      const agency = produceAgency();
      mockRequest.params.id = agency.Id.toString();
      mockRequest.body = agency;
      await controllers.updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(agency.Id);
    });
    it('should return status 400 upon a failed filter', async () => {
      mockRequest.params.id = {} as unknown as string;
      const agency = produceAgency();
      mockRequest.body = agency;
      await controllers.updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return status 400 and specify that there was a mismatch', async () => {
      const agency = produceAgency();
      mockRequest.params.id = 'asdf';
      mockRequest.body = agency;
      await controllers.updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
      expect(mockResponse.sendValue).toBe('The param ID does not match the request body.');
    });
    it('should return status 403 if you try to set an agency as its own parent', async () => {
      const agency = produceAgency();
      mockRequest.params.id = agency.Id.toString();
      mockRequest.body = { ...agency, ParentId: agency.Id };
      await controllers.updateAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(403);
      expect(mockResponse.sendValue).toBe('An agency cannot be its own parent.');
    });
    it('should throw an error when updateAgencyById service throws an error', async () => {
      _updateAgencyById.mockImplementationOnce(() => {
        throw new ErrorWithCode('', 400);
      });
      const agency = produceAgency();
      mockRequest.params.id = agency.Id.toString();
      mockRequest.body = agency;
      expect(
        async () => await controllers.updateAgencyById(mockRequest, mockResponse),
      ).rejects.toThrow('');
    });
  });

  describe('Controller deleteAgencyById', () => {
    it('should return status 200', async () => {
      const agency = produceAgency();
      mockRequest.params.id = agency.Id.toString();
      await controllers.deleteAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
      // expect(mockResponse.sendValue.Id).toBe(agency.Id);
      expect(mockResponse.sendValue).toBeUndefined();
    });
    it('should return status 400 upon a failed filter', async () => {
      mockRequest.params.id = {} as unknown as string;
      await controllers.deleteAgencyById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should throw an error when deleteAgencyById service throws an error', async () => {
      _deleteAgencyById.mockImplementationOnce(() => {
        throw new ErrorWithCode('', 400);
      });
      mockRequest.params.id = 'asf';
      expect(
        async () => await controllers.deleteAgencyById(mockRequest, mockResponse),
      ).rejects.toThrow();
    });
  });
});
