import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '@/express';
import { UUID } from 'crypto';
import { IAgency } from '@/controllers/agencies/IAgency';

const request = supertest(app);

const AGENCIES_PATH = '/v2/agencies';
const mockAgency: IAgency = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedById: faker.string.uuid() as UUID,
  createdById: faker.string.uuid() as UUID,
  id: faker.string.uuid() as UUID,
  name: faker.location.city(),
  isDisabled: false,
  isVisible: true,
  sortOrder: 0,
  type: '',
  code: '',
  description: '',
  email: 'test@test.com',
  sendEmail: true,
  addreessTo: 'test',
  parentId: faker.string.uuid() as UUID,
};
describe('INTEGRATION - Agencies Admin', () => {
  // TODO: figure out how to mock keycloak
  const TOKEN = '';
  describe(`GET ${AGENCIES_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${AGENCIES_PATH}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of agencies', async () => {
      const response = await request
        .get(`${AGENCIES_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${AGENCIES_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${AGENCIES_PATH}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 201 Created and a body of what was created', async () => {
      const response = await request
        .post(`${AGENCIES_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(mockAgency);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockAgency.id);
    });
  });

  describe(`POST ${AGENCIES_PATH}/filter`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${AGENCIES_PATH}/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching agency data', async () => {
      const response = await request
        .post(`${AGENCIES_PATH}/filter`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          page: 0,
          quantity: 0,
          name: mockAgency.name,
        });
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockAgency.id);
    });
  });

  describe(`GET ${AGENCIES_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching agency data', async () => {
      const response = await request
        .get(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockAgency.id);
    });
  });

  describe(`PUT ${AGENCIES_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .put(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the updated agency data', async () => {
      const response = await request
        .put(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ ...mockAgency, name: 'new name' });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('new name');
    });
  });

  describe(`DELETE ${AGENCIES_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 204 and original should be gone', async () => {
      const response = await request
        .delete(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(204);
      // Then it should not be found in database after
      const notFoundResponse = await request
        .delete(`${AGENCIES_PATH}/${mockAgency.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(notFoundResponse.status).toBe(404);
    });
  });
});
