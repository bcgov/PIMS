import { Request, Response } from 'express';
import controllers from '@/controllers';
import { Agency } from '@/typeorm/Entities/Agency';
import {
  MockReq,
  MockRes,
  getRequestHandlerMocks,
  produceUser,
  produceProject,
} from '../../../testUtils/factories';
import { AppDataSource } from '@/appDataSource';

const agencyRepo = AppDataSource.getRepository(Agency);

jest.spyOn(agencyRepo, 'exists').mockImplementation(async () => true);
jest.mock('@/services/users/usersServices', () => ({
  getUser: (guid: string) => _getUser(guid),
}));

const _getUser = jest
  .fn()
  .mockImplementation((guid: string) => ({ ...produceUser(), KeycloakUserId: guid }));
describe('UNIT - Testing controllers for users routes.', () => {
  let mockRequest: Request & MockReq, mockResponse: Response & MockRes;

  beforeEach(() => {
    const { mockReq, mockRes } = getRequestHandlerMocks();
    mockRequest = mockReq;
    mockResponse = mockRes;
  });

  describe('GET /projects/disposal/:projectId', () => {
    it('should return stub response 501', async () => {
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a project', async () => {
      mockRequest.params.projectId = '1';
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = '-1';
      await controllers.getDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /projects/disposal/:projectId', () => {
    it('should return stub response 501', async () => {
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 on successful update', async () => {
      mockRequest.params.projectId = '1';
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = '-1';
      await controllers.updateDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('DELETE /projects/disposal/:projectId', () => {
    it('should return stub response 501', async () => {
      await controllers.deleteDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 on successful deletion', async () => {
      mockRequest.params.projectId = '1';
      await controllers.deleteDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = '-1';
      await controllers.deleteDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('POST /projects/disposal', () => {
    it('should return status 201 on successful project addition', async () => {
      mockRequest.body = produceProject();
      await controllers.addDisposalProject(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('PUT /projects/disposal/workflows', () => {
    it('should return stub response 501', async () => {
      await controllers.requestProjectStatusChange(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 on successful project status change request', async () => {
      await controllers.requestProjectStatusChange(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /projects/reports', () => {
    it('should return stub response 501', async () => {
      await controllers.getAllProjectReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of reports', async () => {
      await controllers.getAllProjectReports(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /projects/reports/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.getProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a report', async () => {
      mockRequest.params.projectId = '1';
      await controllers.getProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = '-1';
      await controllers.getProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('PUT /projects/reports/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.updateProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a report', async () => {
      mockRequest.params.projectId = '1';
      await controllers.updateProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = '-1';
      await controllers.updateProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('DELETE /projects/reports/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.deleteProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a report', async () => {
      mockRequest.params.projectId = '1';
      await controllers.deleteProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.projectId = '-1';
      await controllers.deleteProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('POST /projects/reports/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.addProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and a report', async () => {
      await controllers.addProjectReport(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(201);
    });
  });

  describe('GET /projects/reports/snapshots/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.getProjectReportSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of snapshots', async () => {
      mockRequest.params.reportId = '1';
      await controllers.getProjectReportSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.reportId = '-1';
      await controllers.getProjectReportSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('POST /projects/reports/snapshots/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.generateProjectReportSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of snapshots', async () => {
      mockRequest.params.reportId = '1';
      await controllers.generateProjectReportSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.reportId = '-1';
      await controllers.generateProjectReportSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('GET /projects/reports/refresh/:reportId', () => {
    it('should return stub response 501', async () => {
      await controllers.refreshProjectSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of snapshots', async () => {
      mockRequest.params.reportId = '1';
      await controllers.refreshProjectSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });

    xit('should return status 404 on no resource', async () => {
      mockRequest.params.reportId = '-1';
      await controllers.refreshProjectSnapshots(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(404);
    });
  });

  describe('GET /projects/status', () => {
    it('should return stub response 501', async () => {
      await controllers.getAllProjectStatus(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of statuses', async () => {
      mockRequest.params.reportId = '1';
      await controllers.getAllProjectStatus(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /projects/status/:statusCode/tasks', () => {
    it('should return stub response 501', async () => {
      await controllers.getProjectStatusTasks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of tasks', async () => {
      mockRequest.params.statusCode = '1';
      await controllers.getProjectStatusTasks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /projects/workflows/:workflowCode/status', () => {
    it('should return stub response 501', async () => {
      await controllers.getProjectWorkflowStatuses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of statuses', async () => {
      mockRequest.params.workflowCode = '1';
      await controllers.getProjectWorkflowStatuses(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });

  describe('GET /projects/workflows/:workflowCode/tasks', () => {
    it('should return stub response 501', async () => {
      await controllers.getProjectWorkflowTasks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(501);
    });

    xit('should return status 200 and an array of statuses', async () => {
      mockRequest.params.workflowCode = '1';
      await controllers.getProjectWorkflowTasks(mockRequest, mockResponse);
      expect(mockResponse.statusValue).toBe(200);
    });
  });
});
