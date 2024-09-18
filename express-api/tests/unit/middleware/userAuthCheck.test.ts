import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks, produceUser } from 'tests/testUtils/factories';
import userAuthCheck from '@/middleware/userAuthCheck';
import { AppDataSource } from '@/appDataSource';
import { User, UserStatus } from '@/typeorm/Entities/User';
import { Roles } from '@/constants/roles';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;
const _findUserMock = jest
  .spyOn(AppDataSource.getRepository(User), 'findOne')
  .mockImplementation(async () => produceUser());

describe('UNIT - userAuthCheck middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
    mockRequest.setUser();
  });
  const nextFunction = jest.fn();
  const testFunction = userAuthCheck();

  it('should give return a 401 response if the Keycloak User is missing', async () => {
    mockRequest.user = undefined;
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Requestor not authenticated by Keycloak.');
    expect(_findUserMock).toHaveBeenCalledTimes(0);
  });

  it('should give return a 404 response if the user is not found', async () => {
    _findUserMock.mockImplementationOnce(async () => null);
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('Requesting user not found.');
    expect(_findUserMock).toHaveBeenCalledTimes(1);
  });

  it('should give return a 403 response if the user does not have Active status', async () => {
    _findUserMock.mockImplementationOnce(async () =>
      produceUser({
        Status: UserStatus.OnHold,
        RoleId: Roles.ADMIN,
      }),
    );
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Request forbidden. User lacks Active status.');
    expect(_findUserMock).toHaveBeenCalledTimes(1);
  });

  it('should give return a 403 response if the user does not have a role', async () => {
    _findUserMock.mockImplementationOnce(async () =>
      produceUser({
        Status: UserStatus.OnHold,
      }),
    );
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Request forbidden. User has no assigned role.');
    expect(_findUserMock).toHaveBeenCalledTimes(1);
  });

  it('should give return a 403 response if the required roles are not found', async () => {
    const testFunction = userAuthCheck({ requiredRoles: [Roles.AUDITOR] });
    _findUserMock.mockImplementationOnce(async () =>
      produceUser({
        Status: UserStatus.Active,
        RoleId: Roles.ADMIN,
      }),
    );
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Request forbidden. User lacks required roles.');
  });

  it('should give return a 403 response if the required roles are blank', async () => {
    const testFunction = userAuthCheck({ requiredRoles: [] });
    _findUserMock.mockImplementationOnce(async () =>
      produceUser({
        Status: UserStatus.Active,
        RoleId: Roles.ADMIN,
      }),
    );
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Request forbidden. User lacks required roles.');
  });

  it('should add the PIMS user to the request when all checks have passed', async () => {
    _findUserMock.mockImplementationOnce(async () =>
      produceUser({
        Status: UserStatus.Active,
        RoleId: Roles.ADMIN,
      }),
    );
    await testFunction(mockRequest, mockResponse, nextFunction);
    expect(mockRequest.pimsUser).toBeDefined();
  });
});
