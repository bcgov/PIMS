import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '@/express';
import { UUID } from 'crypto';
import { IRole } from '@/controllers/roles/IRole';

const request = supertest(app);

const ROLES_PATH = '/v2/roles';
const mockRole: IRole = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedById: faker.string.uuid() as UUID,
  createdById: faker.string.uuid() as UUID,
  id: faker.string.uuid() as UUID,
  name: faker.location.city(),
  isDisabled: false,
  isVisible: true,
  description: '',
  sortOrder: 0,
  type: '',
};
describe('INTEGRATION - Roles', () => {
  // TODO: figure out how to mock keycloak
  const TOKEN = '';
  describe(`GET ${ROLES_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.get(`${ROLES_PATH}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of roles', async () => {
      const response = await request.get(`${ROLES_PATH}`).set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${ROLES_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.post(`${ROLES_PATH}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 201 Created and a body of what was created', async () => {
      const response = await request
        .post(`${ROLES_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(mockRole);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockRole.id);
    });
  });

  describe(`GET ${ROLES_PATH}/name/:name`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${ROLES_PATH}/name/${mockRole.name}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching role data', async () => {
      const response = await request
        .get(`${ROLES_PATH}/name/${mockRole.name}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(mockRole.name);
    });
  });

  describe(`GET ${ROLES_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching role data', async () => {
      const response = await request
        .get(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockRole.id);
    });
  });

  describe(`PUT ${ROLES_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .put(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the updated role data', async () => {
      const response = await request
        .put(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ ...mockRole, name: 'new name' });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('new name');
    });
  });

  describe(`DELETE ${ROLES_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 204 and original should be gone', async () => {
      const response = await request
        .delete(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(204);
      // Then it should not be found in database after
      const notFoundResponse = await request
        .delete(`${ROLES_PATH}/${mockRole.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(notFoundResponse.status).toBe(404);
    });
  });
});
