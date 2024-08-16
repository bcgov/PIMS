import supertest from 'supertest';
import app from '@/express';
import { PROJECT_DISPOSAL } from '@/routes/projectsRouter';
import { Project } from '@/controllers/projects/projectsSchema';
import { faker } from '@faker-js/faker';

const request = supertest(app);
describe('INTEGRATION - Project Routes', () => {
  const API_ROUTE = '/v2';

  const makeProject = (): Project => {
    return {
      createdOn: faker.date.past().toISOString(),
      updatedOn: faker.date.recent().toISOString(),
      updatedByName: faker.person.firstName(),
      updatedByEmail: faker.internet.email(),
      rowVersion: faker.number.binary(),
      id: faker.number.int(),
      projectNumber: faker.string.alpha(),
      name: faker.string.alpha(),
      reportedFiscalYear: faker.number.int(),
      actualFiscalYear: faker.number.int(),
      manager: faker.person.firstName(),
      sendNotifications: faker.datatype.boolean(),
      workflowId: faker.number.int(),
      workflowCode: faker.string.alpha(),
      statusId: faker.number.int(),
      statusCode: faker.string.alpha(),
      status: {},
      riskId: faker.number.int(),
      risk: faker.string.alpha(),
      tierLevelId: faker.number.int(),
      tierLevel: faker.string.alpha(),
      description: faker.lorem.sentence(),
      note: faker.lorem.sentence(),
      publicNote: faker.lorem.sentence(),
      privateNote: faker.lorem.sentence(),
      appraisedNote: faker.lorem.sentence(),
      offersNote: faker.lorem.sentence(),
      reportingNote: faker.lorem.sentence(),
      purchaser: faker.person.firstName(),
      isContractConditional: faker.datatype.boolean(),
      agencyId: faker.number.int(),
      agency: faker.company.name(),
      agencyCode: faker.string.alphanumeric(),
      subAgency: faker.company.name(),
      subAgencyCode: faker.string.alphanumeric(),
      submittedOn: faker.date.past().toISOString(),
      approvedOn: faker.date.past().toISOString(),
      deniedOn: faker.date.past().toISOString(),
      cancelledOn: faker.date.past().toISOString(),
      initialNotificationSentOn: faker.date.past().toISOString(),
      thirtyDayNotificationSentOn: faker.date.past().toISOString(),
      sixtyDayNotificationSentOn: faker.date.past().toISOString(),
      ninetyDayNotificationSentOn: faker.date.past().toISOString(),
      onHoldNotificationSentOn: faker.date.past().toISOString(),
      transferredWithinGreOn: faker.date.past().toISOString(),
      clearanceNotificationSentOn: faker.date.past().toISOString(),
      interestedReceivedOn: faker.date.past().toISOString(),
      interestFromEnhancedReferralNote: faker.lorem.sentence(),
      requestForSplReceivedOn: faker.date.past().toISOString(),
      approvedForSplOn: faker.date.past().toISOString(),
      marketedOn: faker.date.past().toISOString(),
      disposedOn: faker.date.past().toISOString(),
      offerAcceptedOn: faker.date.past().toISOString(),
      assessedOn: faker.date.past().toISOString(),
      adjustedOn: faker.date.past().toISOString(),
      preliminaryFormSignedOn: faker.date.past().toISOString(),
      finalFormSignedOn: faker.date.past().toISOString(),
      priorYearAdjustmentOn: faker.date.past().toISOString(),
      exemptionRequested: faker.datatype.boolean(),
      exemptionRationale: faker.lorem.sentence(),
      exemptionApprovedOn: faker.date.past().toISOString(),
      netBook: faker.number.int(),
      market: faker.number.int(),
      appraised: faker.number.int(),
      assessed: faker.number.int(),
      salesCost: faker.number.int(),
      netProceeds: faker.number.int(),
      programCost: faker.number.int(),
      programCostNote: faker.lorem.sentence(),
      gainLoss: faker.number.int(),
      gainNote: faker.lorem.sentence(),
      sppCapitalization: faker.number.int(),
      gainBeforeSpl: faker.number.int(),
      ocgFinancialStatement: faker.number.int(),
      interestComponent: faker.number.int(),
      loanTermsNote: faker.lorem.sentence(),
      offerAmount: faker.number.int(),
      saleWithLeaseInPlace: faker.datatype.boolean(),
      priorYearAdjustment: faker.datatype.boolean(),
      priorYearAdjustmentAmount: faker.number.int(),
      adjustmentNote: faker.lorem.sentence(),
      remediationNote: faker.lorem.sentence(),
      closeOutNote: faker.lorem.sentence(),
      plannedFutureUse: faker.lorem.sentence(),
      realtor: faker.person.firstName(),
      realtorRate: faker.string.alpha(),
      realtorCommission: faker.number.int(),
      preliminaryFormSignedBy: faker.person.firstName(),
      finalFormSignedBy: faker.person.firstName(),
      removalFromSplRequestOn: faker.date.past().toISOString(),
      removalFromSplApprovedOn: faker.date.past().toISOString(),
      removalFromSplRationale: faker.lorem.sentence(),
      documentationNote: faker.lorem.sentence(),
      salesHistoryNote: faker.lorem.sentence(),
      comments: faker.lorem.sentence(),
      notes: [],
      properties: [],
      tasks: [],
      projectAgencyResponses: [],
      statusHistory: [],
    };
  };

  // PROJECT_DISPOSAL Routes
  describe(`GET ${PROJECT_DISPOSAL}/:projectId`, () => {
    xit('should return status 200 with the project', async () => {
      const response = await request.get(`${API_ROUTE}${PROJECT_DISPOSAL}/1`);
      expect(response.status).toBe(200);
    });

    xit('should return status 404 when no project exists', async () => {
      const response = await request.get(`${API_ROUTE}${PROJECT_DISPOSAL}/nonexistentId`);
      expect(response.status).toBe(404);
    });
  });

  describe(`PUT ${PROJECT_DISPOSAL}/:projectId`, () => {
    xit('should return status 200 when updating the project', async () => {
      const projectBody = makeProject();
      const response = await request
        .put(`${API_ROUTE}${PROJECT_DISPOSAL}/${projectBody.id}`)
        .send(projectBody);
      expect(response.status).toBe(200);
    });

    xit('should return status 404 when updating a nonexistent project', async () => {
      const response = await request.put(`${API_ROUTE}${PROJECT_DISPOSAL}/nonexistentId`);
      expect(response.status).toBe(404);
    });
  });

  describe(`DELETE ${PROJECT_DISPOSAL}/:projectId`, () => {
    xit('should return status 200 when deleting the project', async () => {
      const response = await request.delete(`${API_ROUTE}${PROJECT_DISPOSAL}/1`);
      expect(response.status).toBe(200);
    });

    xit('should return status 404 when deleting a nonexistent project', async () => {
      const response = await request.delete(`${API_ROUTE}${PROJECT_DISPOSAL}/nonexistentId`);
      expect(response.status).toBe(404);
    });
  });

  describe(`POST ${PROJECT_DISPOSAL}`, () => {
    xit('should return status 200 when adding a new project', async () => {
      const projectBody = makeProject();
      const response = await request.post(`${API_ROUTE}${PROJECT_DISPOSAL}`).send(projectBody);
      expect(response.status).toBe(200);
    });
  });

  describe(`PUT ${PROJECT_DISPOSAL}/workflows`, () => {
    xit('should return status 200 when requesting project status change', async () => {
      const response = await request.put(`${API_ROUTE}${PROJECT_DISPOSAL}/workflows`);
      expect(response.status).toBe(200);
    });
  });

  describe(`GET /projects/status`, () => {
    xit('should return status 200 with all project statuses', async () => {
      const response = await request.get(`${API_ROUTE}/projects/status`);
      expect(response.status).toBe(200);
    });
  });

  describe(`GET /projects/status/:statusCode/tasks`, () => {
    xit('should return status 200 with tasks for a specific project status code', async () => {
      const response = await request.get(`${API_ROUTE}/projects/status/123/tasks`);
      expect(response.status).toBe(200);
    });
  });

  describe(`GET /projects/workflows/:workflowCode/status`, () => {
    xit('should return status 200 with project workflow statuses', async () => {
      const response = await request.get(`${API_ROUTE}/projects/workflows/ABC/status`);
      expect(response.status).toBe(200);
    });
  });

  describe(`GET /projects/workflows/:workflowCode/tasks`, () => {
    xit('should return status 200 with tasks for a specific project workflow code', async () => {
      const response = await request.get(`${API_ROUTE}/projects/workflows/ABC/tasks`);
      expect(response.status).toBe(200);
    });
  });
});
