/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceKeycloak,
  produceRequest,
  produceUser,
} from '../../../testUtils/factories';
import { IKeycloakUser } from '@/services/keycloak/IKeycloakUser';
import { AccessRequest } from '@/typeorm/Entities/AccessRequest';
import { faker } from '@faker-js/faker';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';

const _activateUser = jest.fn();
const _getAccessRequest = jest.fn().mockImplementation(() => produceRequest());
const _getAccessRequestById = jest.fn().mockImplementation(() => produceRequest());
const _deleteAccessRequest = jest.fn().mockImplementation((req) => req);
const _addKeycloakUserOnHold = jest
  .fn()
  .mockImplementation((kc: KeycloakUser, agencyId: string, position: string, note: string) => ({
    ...produceUser(),
    AgencyId: agencyId,
    Position: position,
    Note: note,
  }));
const _updateAccessRequest = jest.fn().mockImplementation((req) => req);
const _getAgencies = jest.fn().mockImplementation(() => ['1', '2', '3']);
const _getAdministrators = jest.fn();

jest.mock('@/services/users/usersServices', () => ({
  activateUser: () => _activateUser(),
  getAccessRequest: () => _getAccessRequest(),
  getAccessRequestById: () => _getAccessRequestById(),
  deleteAccessRequest: (request: AccessRequest) => _deleteAccessRequest(request),
  addKeycloakUserOnHold: (kc: KeycloakUser, agencyId: string, position: string, note: string) =>
    _addKeycloakUserOnHold(kc, agencyId, position, note),
  updateAccessRequest: (request: AccessRequest, _kc: KeycloakUser) => _updateAccessRequest(request),
  getAgencies: () => _getAgencies(),
  getAdministrators: () => _getAdministrators(),
}));

describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('getUserInfo', () => {
    it('should return status 200 and keycloak info', async () => {
      const header = { a: faker.string.alphanumeric() };
      const payload = { b: faker.string.alphanumeric() };
      mockRequest.token = btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload));
      await controllers.getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.b).toBe(payload.b);
    });

    it('should return 400 when an invalid JWT is sent', async () => {
      mockRequest.token = 'hello';
      await controllers.getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    it('should return 400 when no JWT is sent', async () => {
      await controllers.getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });

    // FIXME: I don't think we should be throwing errors from controllers
    // it('should throw an error when either side of the jwt cannot be parsed', () => {
    //   mockRequest.token = 'hello.goodbye';
    //   expect(() => {controllers.getUserInfo(mockRequest, mockResponse)}).toThrow();
    // })
  });

  describe('getUserAccessRequestLatest', () => {
    it('should return status 200 and an access request', async () => {
      await controllers.getUserAccessRequestLatest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBeDefined();
    });

    it('should return status 204 if no requests', async () => {
      _getAccessRequest.mockImplementationOnce(() => null);
      await controllers.getUserAccessRequestLatest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(204);
      expect(mockResponse.sendValue.Id).toBeUndefined();
    });

    it('should return status 400 if userService.getAccessRequest throws an error', async () => {
      _getAccessRequest.mockImplementationOnce(() => {
        throw new Error();
      });
      await controllers.getUserAccessRequestLatest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('getUserAccessRequestById', () => {
    const request = produceRequest();

    it('should return status 200 and an access request', async () => {
      _getAccessRequestById.mockImplementationOnce(() => request);
      mockRequest.params.requestId = String(request.Id);
      await controllers.getUserAccessRequestById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(request.Id);
    });

    it('should return status 404 if no request found', async () => {
      _getAccessRequestById.mockImplementationOnce(() => null);
      mockRequest.params.requestId = '-1';
      await controllers.getUserAccessRequestById(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('updateUserAccessRequest', () => {
    it('should return status 200 and an access request', async () => {
      const request = produceRequest();
      mockRequest.params.requestId = '1';
      mockRequest.body = request;
      await controllers.updateUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(request.Id);
    });

    it('should return status 400 if malformed', async () => {
      mockRequest.params.requestId = '1';
      mockRequest.body = {};
      _updateAccessRequest.mockImplementationOnce(() => {
        throw Error();
      });
      await controllers.updateUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('submitUserAccessRequest', () => {
    it('should return status 201 and an access request', async () => {
      mockRequest.user = produceKeycloak();
      mockRequest.body = { agencyId: 'bch' };
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 400 if malformed', async () => {
      mockRequest.body = {};
      _addKeycloakUserOnHold.mockImplementationOnce(() => {
        throw Error();
      });
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('getUserAgencies', () => {
    it('should return status 200 and an int array', async () => {
      mockRequest.params.username = 'john';
      await controllers.getUserAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(Array.isArray(mockResponse.sendValue));
    });

    it('should return status 400 if no user exists', async () => {
      mockRequest.params.username = '11111';
      _getAgencies.mockImplementationOnce(() => {
        throw Error();
      });
      await controllers.getUserAgencies(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });
});
