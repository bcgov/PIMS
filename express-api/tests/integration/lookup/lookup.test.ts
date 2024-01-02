import supertest from 'supertest';
import app from '@/express';

const request = supertest(app);
const LOOKUP_PATH = '/api/v2/lookup';

describe('INTEGRATION - Lookup', () => {
  const TOKEN = '';
  describe('GET /lookup/agencies', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/agencies`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of agencies', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/agencies`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /lookup/roles', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/roles`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of roles', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/roles`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /lookup/property/classifications', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/property/classifications`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of property classifications', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/property/classifications`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /lookup/project/tier/levels', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/project/tier/levels`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of project tier levels', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/project/tier/levels`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /lookup/project/risks', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/project/risks`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of project risks', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/project/risks`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /lookup/all', () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/all`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    // TODO: It's not clear if this route will be needed. May just remove later.
    xit('should return status 200 with a list of lookup values', async () => {
      const response = await request
        .get(`${LOOKUP_PATH}/all`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });
});
