import { Request, Response } from 'express';
import { MockReq, MockRes, getRequestHandlerMocks, produceUser } from 'tests/testUtils/factories';
import activeUserCheck from '@/middleware/activeUserCheck';
import { AppDataSource } from '@/appDataSource';
import { User, UserStatus } from '@/typeorm/Entities/User';
import { Roles } from '@/constants/roles';

let mockRequest: Request & MockReq, mockResponse: Response & MockRes;
const _findUserMock = jest
  .spyOn(AppDataSource.getRepository(User), 'findOne')
  .mockImplementation(async () => produceUser());

describe('UNIT - activeUserCheck middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
    mockRequest.setUser({ client_roles: [Roles.ADMIN] });
  });
  const nextFunction = jest.fn();

  it('should give return a 401 response if the Keycloak User is missing', async () => {
    mockRequest.user = undefined;
    await activeUserCheck(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledWith('Unauthorized request.');
    expect(_findUserMock).toHaveBeenCalledTimes(0);
  });

  it('should give return a 404 response if the user is not found', async () => {
    _findUserMock.mockImplementationOnce(async () => null);
    await activeUserCheck(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('Requesting user not found.');
    expect(_findUserMock).toHaveBeenCalledTimes(1);
  });

  it('should give return a 403 response if the user does not have Active status', async () => {
    _findUserMock.mockImplementationOnce(async () =>
      produceUser({
        Status: UserStatus.OnHold,
      }),
    );
    await activeUserCheck(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Request forbidden. User lacks Active status.');
    expect(_findUserMock).toHaveBeenCalledTimes(1);
  });

  it('should give return a 403 response if the Keycloak User does not have a role', async () => {
    mockRequest.setUser({ client_roles: undefined, hasRoles: () => false });
    await activeUserCheck(mockRequest, mockResponse, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.send).toHaveBeenCalledWith('Request forbidden. User has no assigned role.');
  });
});
