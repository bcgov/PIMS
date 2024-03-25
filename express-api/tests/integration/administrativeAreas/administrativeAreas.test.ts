import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '@/express';
import { IAdministrativeArea } from '@/controllers/administrativeAreas/IAdministrativeArea';
import { UUID } from 'crypto';

const request = supertest(app);

const ADMIN_AREAS_PATH = '/v2/administrativeAreas';
const mockAdministrativeArea: IAdministrativeArea = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedById: faker.string.uuid() as UUID,
  createdById: faker.string.uuid() as UUID,
  id: faker.string.uuid() as UUID,
  name: faker.location.city(),
  isDisabled: false,
  isVisible: true,
  sortOrder: 0,
  abbreviation: '',
  boundaryType: '',
  regionalDistrict: 'CPRD',
};
describe('INTEGRATION - Administrative Areas Admin', () => {
  // TODO: figure out how to mock keycloak
  const TOKEN = '';
  describe(`GET ${ADMIN_AREAS_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${ADMIN_AREAS_PATH}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of admin areas', async () => {
      const response = await request
        .get(`${ADMIN_AREAS_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${ADMIN_AREAS_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${ADMIN_AREAS_PATH}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 201 Created and a body of what was created', async () => {
      const response = await request
        .post(`${ADMIN_AREAS_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(mockAdministrativeArea);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockAdministrativeArea.id);
    });
  });

  describe(`POST ${ADMIN_AREAS_PATH}/filter`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${ADMIN_AREAS_PATH}/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching admin area data', async () => {
      const response = await request
        .post(`${ADMIN_AREAS_PATH}/filter`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          page: 0,
          quantity: 0,
          boundaryType: mockAdministrativeArea.boundaryType,
          name: mockAdministrativeArea.name,
          abbreviation: mockAdministrativeArea.abbreviation,
        });
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockAdministrativeArea.id);
    });
  });

  describe(`GET ${ADMIN_AREAS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching admin area data', async () => {
      const response = await request
        .get(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockAdministrativeArea.id);
    });
  });

  describe(`PUT ${ADMIN_AREAS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .put(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the updated admin area data', async () => {
      const response = await request
        .put(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ ...mockAdministrativeArea, name: 'new name' });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('new name');
    });
  });

  describe(`DELETE ${ADMIN_AREAS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 204 and original should be gone', async () => {
      const response = await request
        .delete(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(204);
      // Then it should not be found in database after
      const notFoundResponse = await request
        .delete(`${ADMIN_AREAS_PATH}/${mockAdministrativeArea.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(notFoundResponse.status).toBe(404);
    });
  });
});
