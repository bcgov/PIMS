import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '@/express';
import { UUID } from 'crypto';
import { IClaim } from '@/controllers/admin/claims/IClaim';

const request = supertest(app);

const CLAIMS_PATH = '/api/v2//admin/claims';
const mockClaim: IClaim = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedByName: faker.person.firstName(),
  updatedByEmail: faker.internet.email(),
  id: faker.string.uuid() as UUID,
  name: faker.location.city(),
  isDisabled: false,
  description: '',
  keycloakRoleId: faker.string.uuid() as UUID,
};
describe('INTEGRATION - Claims Admin', () => {
  // TODO: figure out how to mock keycloak
  const TOKEN = '';
  describe(`GET ${CLAIMS_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.get(`${CLAIMS_PATH}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of claims', async () => {
      const response = await request.get(`${CLAIMS_PATH}`).set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${CLAIMS_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${CLAIMS_PATH}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 201 Created and a body of what was created', async () => {
      const response = await request
        .post(`${CLAIMS_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(mockClaim);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockClaim.id);
    });
  });

  describe(`GET ${CLAIMS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching claim data', async () => {
      const response = await request
        .get(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockClaim.id);
    });
  });

  describe(`PUT ${CLAIMS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .put(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the updated claim data', async () => {
      const response = await request
        .put(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ ...mockClaim, name: 'new name' });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('new name');
    });
  });

  describe(`DELETE ${CLAIMS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 204 and original should be gone', async () => {
      const response = await request
        .delete(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(204);
      // Then it should not be found in database after
      const notFoundResponse = await request
        .delete(`${CLAIMS_PATH}/${mockClaim.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(notFoundResponse.status).toBe(404);
    });
  });
});
