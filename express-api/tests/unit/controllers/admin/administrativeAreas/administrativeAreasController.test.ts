import { Request, Response } from 'express';
import controllers from '../../../../../controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../../testUtils/factories';
import { Roles } from '../../../../../constants/roles';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

const {
  getAdministrativeAreaById,
  getAdministrativeAreas,
  addAdministrativeArea,
  deleteAdministrativeAreaById,
  getAdministrativeAreasFiltered,
  updateAdministrativeAreaById,
} = controllers.admin;

describe('UNIT - Administrative Areas Admin', () => {
  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
    mockResponse = mockRes;
  });
  describe('GET /admin/administrativeAreas', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAdministrativeAreas(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and a list of administrative areas', async () => {
      await getAdministrativeAreas(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('POST /admin/administrativeAreas', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await addAdministrativeArea(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 201 and the new administrative area ', async () => {
      await addAdministrativeArea(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await addAdministrativeArea(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /admin/administrativeAreas/filter', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAdministrativeAreasFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the administrative area ', async () => {
      await getAdministrativeAreasFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await getAdministrativeAreasFiltered(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /admin/administrativeAreas/:id', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await getAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the administrative area ', async () => {
      await getAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await getAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('PUT /admin/administrativeAreas/:id', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await updateAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 200 and the updated administrative area', async () => {
      await updateAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await updateAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('DELETE /admin/administrativeAreas/:id', () => {
    // TODO: remove stub test when controller is complete
    it('should return the stub response of 501', async () => {
      await deleteAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    // TODO: enable other tests when controller is complete
    xit('should return status 204', async () => {
      await deleteAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
    });

    xit('should return status 400 when a bad request is received', async () => {
      await deleteAdministrativeAreaById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
