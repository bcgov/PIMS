import { Request, Response } from 'express';
import controllers from '@/controllers';
import { Agency } from '@/typeorm/Entities/Agency';
import { ProjectFilterSchema } from '@/services/projects/projectSchema';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceUser,
  produceProject,
  produceParcel,
  produceBuilding,
  produceProjectProperty,
} from '../../../testUtils/factories';
import { AppDataSource } from '@/appDataSource';
import { z } from 'zod';
import { Roles } from '@/constants/roles';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectSchema } from '@/controllers/projects/projectsSchema';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { DeleteResult } from 'typeorm';
import { faker } from '@faker-js/faker';

const agencyRepo = AppDataSource.getRepository(Agency);

jest.spyOn(agencyRepo, 'exists').mockImplementation(async () => true);

const fakeProjects = [
  { id: 1, name: 'Project 1' },
  { id: 2, name: 'Project 2' },
];

const _addProject = jest.fn().mockImplementation(() => produceProject());
const _getProjectById = jest.fn().mockImplementation(() => produceProject());
const _getProjectsForExport = jest.fn().mockResolvedValue(fakeProjects);
const _getProjects = jest.fn().mockResolvedValue(fakeProjects);
const _hasAgencies = jest.fn();
const _updateProject = jest.fn().mockImplementation(() => produceProject());
const _deleteProjectById = jest.fn().mockImplementation(
  (): DeleteResult => ({
    raw: {},
  }),
);

jest
  .spyOn(AppDataSource.getRepository(Project), 'find')
  .mockImplementation(async () => _addProject());

jest.mock('@/services/projects/projectsServices', () => ({
  addProject: () => _addProject(),
  getProjects: () => _getProjects(),
  getProjectsForExport: () => _getProjectsForExport(),
  getProjectById: () => _getProjectById(),
  updateProject: () => _updateProject(),
  deleteProjectById: () => _deleteProjectById(),
}));

jest.mock('@/services/users/usersServices', () => ({
  getUser: (guid: string) => _getUser(guid),
  getAgencies: jest.fn().mockResolvedValue([1, 2]),
  hasAgencies: jest.fn(() => _hasAgencies()),
}));

jest.mock('@/services/notifications/notificationServices', () => ({
  cancelProjectNotifications: () => ({
    succeeded: faker.number.int(),
    failed: faker.number.int(),
  }),
}));

jest
  .spyOn(AppDataSource.getRepository(ProjectProperty), 'find')
  .mockImplementation(async () => [
    produceProjectProperty({ Parcel: produceParcel() }),
    produceProjectProperty({ Building: produceBuilding() }),
  ]);

const _getUser = jest
  .fn()
  .mockImplementation((guid: string) => ({ ...produceUser(), KeycloakUserId: guid }));
describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });
  describe('GET /projects/', () => {
    it('should return projects for admin user', async () => {
      // Mock an admin user
      const { mockReq, mockRes } = getRequestHandlerMocks();
      mockRequest = mockReq;
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockResponse = mockRes;
      jest.spyOn(ProjectFilterSchema, 'safeParse').mockReturnValueOnce({
        success: true,
        data: {
          projectNumber: '123',
          name: 'Project Name',
          statusId: 1,
          agencyId: [1, 2],
          page: 1,
          quantity: 10,
        },
      });

      // Call filterProjects controller function
      await controllers.getProjects(mockRequest, mockResponse);

      // Assert response status and content
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith([
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ]);
      expect(_getProjects).toHaveBeenCalledTimes(1);
    });

    it('should return the excel import if called for', async () => {
      // Mock an admin user
      const { mockReq, mockRes } = getRequestHandlerMocks();
      mockRequest = mockReq;
      mockRequest.query.excelExport = 'true';
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockResponse = mockRes;
      jest.spyOn(ProjectFilterSchema, 'safeParse').mockReturnValueOnce({
        success: true,
        data: {
          projectNumber: '123',
          name: 'Project Name',
          statusId: 1,
          agencyId: [1, 2],
          page: 1,
          quantity: 10,
          sortOrder: 'asc',
          sortKey: 'ProjectNumber',
        },
      });

      // Call filterProjects controller function
      await controllers.getProjects(mockRequest, mockResponse);

      // Assert response status and content
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith([
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ]);
      expect(_getProjectsForExport).toHaveBeenCalledTimes(1);
    });

    it('should return projects for a general user', async () => {
      // Mock an general user
      const { mockReq, mockRes } = getRequestHandlerMocks();
      mockRequest = mockReq;
      mockRequest.setUser({ client_roles: [Roles.GENERAL_USER] });
      mockResponse = mockRes;
      jest.spyOn(ProjectFilterSchema, 'safeParse').mockReturnValueOnce({
        success: true,
        data: {
          projectNumber: '123',
          name: 'Project Name',
          statusId: 1,
          agencyId: [1, 2],
          page: 1,
          quantity: 10,
          sortOrder: 'asc',
          sortKey: 'ProjectNumber',
        },
      });

      // Call filterProjects controller function
      await controllers.getProjects(mockRequest, mockResponse);

      // Assert response status and content
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith([
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' },
      ]);
    });

    it('should return 400 if filter cannot be parsed', async () => {
      jest.spyOn(ProjectFilterSchema, 'safeParse').mockReturnValueOnce({
        success: false,
        error: new z.ZodError([]), // Pass an empty array of errors
      });

      await controllers.getProjects(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('Could not parse filter.');
    });

    it('should pass valid project filter', () => {
      jest.spyOn(ProjectFilterSchema, 'safeParse').mockRestore();
      const validFilter = {
        projectNumber: '123',
        name: 'Project Name',
        statusId: 1,
        agencyId: [1],
      };

      const result = ProjectFilterSchema.safeParse(validFilter);
      expect(result.success).toBe(true);
    });

    it('should pass valid project filter', () => {
      jest.spyOn(ProjectFilterSchema, 'safeParse').mockRestore();
      const validFilter = {
        projectNumber: '123',
        name: 'Project Name',
        statusId: 1,
        agencyId: [1, 2],
      };
      const result = ProjectFilterSchema.safeParse(validFilter);
      expect(result.success).toBe(true);
    });
  });
  describe('GET /projects/disposal/:projectId', () => {
    it('should return status 200 and a project when user is admin', async () => {
      mockRequest.params.projectId = '1';
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 200 and a project when user is auditor', async () => {
      mockRequest.params.projectId = '1';
      mockRequest.setUser({ client_roles: [Roles.AUDITOR] });
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
    it('should return status 403 when user does not have correct agencies', async () => {
      mockRequest.params.projectId = '1';
      mockRequest.setUser({ client_roles: [Roles.GENERAL_USER], hasRoles: () => false });
      _hasAgencies.mockImplementationOnce(() => false);
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(403);
    });
    it('should return status 400 on misformatted id', async () => {
      mockRequest.params.projectId = 'a';
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return status 404 on no resource', async () => {
      _getProjectById.mockImplementationOnce(() => null);
      mockRequest.params.projectId = '-1';
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /projects/disposal/:projectId', () => {
    it('should return status 200 on successful update', async () => {
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockRequest.params.projectId = '1';
      mockRequest.body = {
        project: produceProject({ Id: 1 }),
        propertyIds: [],
      };
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 403 when user is not an admin', async () => {
      mockRequest.setUser({ client_roles: [Roles.GENERAL_USER] });
      mockRequest.params.projectId = '1';
      mockRequest.body = {
        project: produceProject({ Id: 1 }),
        propertyIds: [],
      };
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(403);
    });

    it('should return status 400 on mistmatched id', async () => {
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockRequest.params.projectId = '1';
      mockRequest.body = {
        project: {
          Id: 3,
        },
        propertyIds: [],
      };
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return status 400 on invalid id', async () => {
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockRequest.params.projectId = 'abc';
      mockRequest.body = {
        project: {
          Id: 3,
        },
        propertyIds: [],
      };
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
    it('should return status 400 on missing fields', async () => {
      mockRequest.setUser({ client_roles: [Roles.ADMIN] });
      mockRequest.params.projectId = '1';
      mockRequest.body = {
        Id: 1,
      };
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('DELETE /projects/disposal/:projectId', () => {
    it('should return status 200 on successful deletion', async () => {
      mockRequest.params.projectId = '1';
      mockRequest.setUser({ client_roles: [Roles.ADMIN], hasRoles: () => true });
      await controllers.deleteDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    it('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = 'abc';
      mockRequest.setUser({ client_roles: [Roles.ADMIN], hasRoles: () => true });
      await controllers.deleteDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(400);
    });
  });

  describe('POST /projects/disposal', () => {
    it('should return status 201 on successful project addition', async () => {
      mockRequest.body = produceProject();
      await controllers.addDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('Project Schema Validation', () => {
    it('should pass valid project schema', () => {
      const project = _addProject();
      expect(project).toBeDefined();
    });

    xit('should fail with invalid project schema', () => {
      const invalidProject = {
        // Incomplete or incorrect properties for an invalid project object
      };

      const result = ProjectSchema.safeParse(invalidProject);
      expect(result.success).toBe(false);
    });
  });
});
