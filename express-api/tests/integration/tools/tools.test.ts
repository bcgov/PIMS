import supertest from 'supertest';
import app from '@/express';
import { faker } from '@faker-js/faker';

const request = supertest(app);
describe('INTEGRATION - Tools', () => {
  const API_ROUTE = '/v2/tools';

  const makeProjectImportRequest = () => ({
    projectNumber: faker.string.alphanumeric(8),
    reportedFiscalYear: faker.number.int(),
    actualFiscalYear: faker.number.int(),
    activity: faker.lorem.word(),
    workflow: 'Surplus Property List',
    status: 'Draft',
    agency: faker.company.name(),
    description: faker.lorem.sentence(),
    risk: 'High',
    manager: faker.person.firstName(),
    location: faker.location.city(),
    completedOn: faker.date.past().toISOString(),
    disposedOn: faker.date.future().toISOString(),
    notes: [
      {
        key: faker.lorem.word(),
        value: faker.lorem.sentence(),
      },
    ],
    exemptionRequested: faker.datatype.boolean(),
    initialNotificationSentOn: faker.date.past().toISOString(),
    interestedReceivedOn: faker.date.past().toISOString(),
    clearanceNotificationSentOn: faker.date.past().toISOString(),
    requestForSplReceivedOn: faker.date.past().toISOString(),
    approvedForSplOn: faker.date.past().toISOString(),
    marketedOn: faker.date.past().toISOString(),
    purchaser: faker.person.firstName(),
    isContractConditional: faker.datatype.boolean(),
    market: faker.number.int(),
    netBook: faker.number.int(),
    assessed: faker.number.int(),
    appraised: faker.number.int(),
    appraisedBy: faker.person.firstName(),
    appraisedOn: faker.date.past().toISOString(),
    programCost: faker.number.int(),
    gainLoss: faker.number.int(),
    interestComponent: faker.number.int(),
    salesCost: faker.number.int(),
    netProceeds: faker.number.int(),
    priorNetProceeds: faker.number.int(),
    variance: faker.number.int(),
    ocgFinancialStatement: faker.number.int(),
    saleWithLeaseInPlace: faker.datatype.boolean(),
    snapshotOn: faker.date.past().toISOString(),
  });

  const makePropertyImportRequest = () => ({
    updated: faker.datatype.boolean(),
    added: faker.datatype.boolean(),
    parcelId: faker.string.alphanumeric(8),
    pid: faker.string.alphanumeric(8),
    pin: faker.string.alphanumeric(8),
    status: 'Draft',
    fiscalYear: faker.number.int(),
    agency: faker.company.name(),
    agencyCode: faker.string.alphanumeric(4),
    subAgency: faker.company.name(),
    propertyType: faker.word.adjective(),
    localId: faker.string.alphanumeric(6),
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    classification: faker.word.adjective(),
    civicAddress: faker.address.streetAddress(),
    city: faker.location.city(),
    postal: faker.location.zipCode(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    landArea: faker.number.int(),
    buildingFloorCount: faker.number.int(),
    buildingConstructionType: faker.lorem.word(),
    buildingPredominateUse: faker.lorem.word(),
    buildingTenancy: faker.lorem.word(),
    buildingRentableArea: faker.number.int(),
    assessed: faker.number.int(),
    netBook: faker.number.int(),
    regionalDistrict: faker.location.county(),
    error: faker.lorem.sentence(),
  });

  describe('POST /tools/import/projects', () => {
    xit('should return status 200 with the imported project data', async () => {
      const importBody = [makeProjectImportRequest()];
      const response = await request.post(`${API_ROUTE}/import/projects`).send(importBody);
      expect(response.status).toBe(200);
    });
    xit('should return status 400 on bad request', async () => {
      const importBody = { bad: 'a' };
      const response = await request.post(`${API_ROUTE}/import/projects`).send(importBody);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /tools/import/properties', () => {
    xit('should return status 200 with the imported project data', async () => {
      const importBody = [makePropertyImportRequest()];
      const response = await request.post(`${API_ROUTE}/import/properties`).send(importBody);
      expect(response.status).toBe(200);
    });
    xit('should return status 400 on bad request', async () => {
      const importBody = { bad: 'a' };
      const response = await request.post(`${API_ROUTE}/import/properties`).send(importBody);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /tools/import/properties', () => {
    xit('should return status 200 with the deleted property data', async () => {
      const importBody = [makePropertyImportRequest()];
      const response = await request.delete(`${API_ROUTE}/import/properties`).send(importBody);
      expect(response.status).toBe(200);
    });
    xit('should return status 400 on bad request', async () => {
      const importBody = { bad: 'a' };
      const response = await request.post(`${API_ROUTE}/import/properties`).send(importBody);
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /tools/import/properties/financials', () => {
    xit('should return status 200 with the updated property data', async () => {
      const importBody = [makePropertyImportRequest()];
      const response = await request.patch(`${API_ROUTE}/import/properties`).send(importBody);
      expect(response.status).toBe(200);
    });
    xit('should return status 400 on bad request', async () => {
      const importBody = { bad: 'a' };
      const response = await request.patch(`${API_ROUTE}/import/properties`).send(importBody);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /tools/ches/status/:messageId', () => {
    xit('should return status 200 with the requested ches status', async () => {
      const response = await request.get(`${API_ROUTE}/ches/status/1`);
      expect(response.status).toBe(200);
    });
    xit('should return status 404 on no resource', async () => {
      const response = await request.get(`${API_ROUTE}/ches/status/-11`);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /tools/ches/status/:messageId', () => {
    xit('should return status 200 with the cancelled ches status', async () => {
      const response = await request.delete(`${API_ROUTE}/ches/cancel/1`);
      expect(response.status).toBe(200);
    });
    xit('should return status 404 on no resource', async () => {
      const response = await request.get(`${API_ROUTE}/ches/cancel/-11`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /tools/ches/status', () => {
    xit('should return status 200 with the requested ches statuses', async () => {
      const response = await request.get(`${API_ROUTE}/ches/status?TransactionId=1`);
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /tools/ches/status', () => {
    xit('should return status 200 with the requested ches statuses', async () => {
      const response = await request.get(`${API_ROUTE}/ches/cancel?Status=sent`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /tools/geocoder/addresses', () => {
    xit('should return status 200 with the requested addresses', async () => {
      const response = await request.get(`${API_ROUTE}/geocoder/addresses?address=Montgomery`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /tools/geocoder/parcels/pids/:siteId', () => {
    xit('should return status 200 with the requested pid objects', async () => {
      const response = await request.get(`${API_ROUTE}/geocoder/parcels/pids/1`);
      expect(response.status).toBe(200);
    });
  });
});
