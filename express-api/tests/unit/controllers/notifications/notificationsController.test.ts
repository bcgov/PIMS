import { Request, Response } from 'express';
import controllers from '@/controllers';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceUser,
  produceSSO,
  produceProject,
} from 'tests/testUtils/factories';
import projectServices from '@/services/projects/projectsServices';

const _getUser = jest
  .fn()
  .mockImplementation((guid: string) => ({ ...produceUser(), KeycloakUserId: guid }));
const _getAgencies = jest.fn().mockImplementation(async () => [1, 2, 3]);
const _getProjectNotificationsInQueue = jest.fn().mockImplementation(async () => [1, 2, 3]);
const _getProjectById = jest.fn().mockImplementation(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_id: number) => ({ AgencyId: 1 }),
);

jest.mock('@/services/users/usersServices', () => ({
  getAgencies: () => _getAgencies(),
  getUser: () => _getUser(),
}));

jest.mock('@/services/notifications/notificationServices', () => ({
  getProjectNotificationsInQueue: () => _getProjectNotificationsInQueue(),
}));

jest.mock('@/services/projects/projectsServices', () => ({
  getProjectById: () => _getProjectById,
}));

describe('UNIT - Testing controllers for notifications routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  it('should return 400 if filter parsing fails', async () => {
    mockRequest.query = { invalidField: 'invalidValue' };

    await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Could not parse filter.' });
  });

  it('should return 400 if no valid filter provided', async () => {
    await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

    expect(mockResponse.statusValue).toBe(400);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      message: 'Could not parse filter.',
    });
  });

  it('should return 403 if user is not authorized', async () => {
    const kcUser = produceSSO();
    mockRequest.user = kcUser;
    mockRequest.query = { projectId: '1' };

    await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
  });

  it('should return 200 and notifications if user is authorized', async () => {
    const mockRequest = {
      query: { projectId: '123' },
      user: { agencies: [1] },
    } as unknown as Request;

    const mockProject = produceProject({
      Id: 123,
      AgencyId: 1,
    });

    const getProjectByIdSpy = jest
      .spyOn(projectServices, 'getProjectById')
      .mockResolvedValueOnce(mockProject);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await controllers.getNotificationsByProjectId(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(getProjectByIdSpy).toHaveBeenCalledWith(123);
  });
});
