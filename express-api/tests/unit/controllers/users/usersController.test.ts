/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import controllers from '@/controllers';
import { MockReq, MockRes, getRequestHandlerMocks } from '../../../testUtils/factories';
import { IKeycloakUser } from '@/services/keycloak/IKeycloakUser';
import { AccessRequests } from '@/typeorm/Entities/AccessRequests';
import { faker } from '@faker-js/faker';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';

const _activateUser = jest.fn();
const _getAccessRequest = jest.fn().mockImplementation(() => produceRequest());
const _getAccessRequestById = jest.fn().mockImplementation(() => produceRequest());
const _deleteAccessRequest = jest.fn().mockImplementation((req) => req);
const _addAccessRequest = jest.fn().mockImplementation((req) => req);
const _updateAccessRequest = jest.fn().mockImplementation((req) => req);
const _getAgencies = jest.fn().mockImplementation(() => ['1', '2', '3']);
const _getAdministrators = jest.fn();

jest.mock('@/services/users/usersServices', () => ({
  activateUser: () => _activateUser(),
  getAccessRequest: () => _getAccessRequest(),
  getAccessRequestById: () => _getAccessRequestById(),
  deleteAccessRequest: (request: AccessRequests) => _deleteAccessRequest(request),
  addAccessRequest: (request: AccessRequests, _kc: KeycloakUser) => _addAccessRequest(request),
  updateAccessRequest: (request: AccessRequests, _kc: KeycloakUser) =>
    _updateAccessRequest(request),
  getAgencies: () => _getAgencies(),
  getAdministrators: () => _getAdministrators(),
}));

const produceRequest = (): AccessRequests => {
  const request: AccessRequests = {
    Id: faker.number.int(),
    UserId: undefined,
    Note: 'test',
    Status: 0,
    RoleId: undefined,
    AgencyId: undefined,
    CreatedById: undefined,
    CreatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    UpdatedOn: faker.date.anytime(),
  };
  return request;
};
describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /users/info ', () => {
    it('should return status 200 and keycloak info', async () => {
      const keycloakUser: IKeycloakUser = {
        username: 'test',
        email: 'test',
        firstName: 'test',
        lastName: 'test',
        attributes: {
          display_name: ['test'],
          idir_user_guid: ['test'],
          idir_username: ['test'],
          bceid_business_guid: ['test'],
          bceid_business_name: ['test'],
          bceid_user_guid: ['test'],
          bceid_username: ['test'],
        },
      };
      mockRequest.user = keycloakUser;
      await controllers.getUserInfo(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.username).toBe('test');
    });
  });

  describe('GET /users/access/requests', () => {
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
  });

  describe('GET /users/access/requests/:requestId', () => {
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

  describe('PUT /users/access/requests/:requestId', () => {
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

  describe('POST /users/access/requests', () => {
    it('should return status 201 and an access request', async () => {
      const request = produceRequest();
      mockRequest.body = request;
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
      expect(mockResponse.sendValue.Id).toBe(request.Id);
    });

    it('should return status 400 if malformed', async () => {
      mockRequest.body = {};
      _addAccessRequest.mockImplementationOnce(() => {
        throw Error();
      });
      await controllers.submitUserAccessRequest(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('GET /users/agencies/:username', () => {
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
