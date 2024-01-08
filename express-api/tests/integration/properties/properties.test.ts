import supertest from 'supertest';
import app from '@/express';

const request = supertest(app);
const PROPERTIES_PATH = '/api/v2/properties';

describe('INTEGRATION - Properties', () => {
  // TODO: Need to figure out how to get token populated or Keycloak mocked
  const TOKEN = '';
  describe('GET /properties/search', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the list of properties', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('POST /properties/search/filter', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the list of properties', async () => {
      const filter = {
        pid: '002002002',
      };
      const response = await request
        .get(`${PROPERTIES_PATH}/filter`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(filter);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/search/geo', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/geo`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the list of properties', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/geo`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('POST /properties/search/geo/filter', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/geo/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the list of properties', async () => {
      const filter = {
        pid: '002002002',
      };
      const response = await request
        .get(`${PROPERTIES_PATH}/geo/filter`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(filter);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /properties/search/page', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/page`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the list of properties', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/page`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('POST /properties/search/page/filter', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${PROPERTIES_PATH}/page/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the list of properties', async () => {
      const filter = {
        pid: '002002002',
      };
      const response = await request
        .get(`${PROPERTIES_PATH}/page/filter`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(filter);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
