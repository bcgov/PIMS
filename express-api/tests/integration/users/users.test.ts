import supertest from 'supertest';
import app from '../../../express';

const request = supertest(app);
describe('INTEGRATION - Users', () => {
  const API_ROUTE = '/api/v2/users';

  describe('GET /users/info', () => {
    xit('should return status 200 with the user keycloak info', async () => {
      const response = await request.get(`${API_ROUTE}/info`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /users/access/requests', () => {
    xit('should return status 200 with the latest request', async () => {
      const response = await request.get(`${API_ROUTE}/access/requests`);
      expect(response.status).toBe(200);
    });

    xit('should return status 204 when no requests to retrieve', async () => {
      const response = await request.get(`${API_ROUTE}/access/requests`);
      expect(response.status).toBe(204);
    });
  });

  describe('GET /users/access/requests/:requestId', () => {
    xit('should return 200 and the desired access request', async () => {
      const id = '1';
      const response = await request.get(`${API_ROUTE}/access/requests/${id}`);
      expect(response.status).toBe(200);
    });
    xit('should return 404 if no request found', async () => {
      const id = '-1';
      const response = await request.get(`${API_ROUTE}/access/requests/${id}`);
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /users/access/requests/:requestId', () => {
    xit('should return 200 and the desired access request', async () => {
      const id = '1';
      const response = await request.put(`${API_ROUTE}/access/requests/${id}`);
      expect(response.status).toBe(200);
    });
    xit('should return 400 if malformed', async () => {
      const id = '-1';
      const response = await request.put(`${API_ROUTE}/access/requests/${id}`);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /users/access/requests', () => {
    xit('should return 200 and the desired access request', async () => {
      const id = '1';
      const response = await request.post(`${API_ROUTE}/access/requests/${id}`);
      expect(response.status).toBe(201);
    });
    xit('should return 404 if no request found', async () => {
      const id = '-1';
      const response = await request.put(`${API_ROUTE}/access/requests/${id}`);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/agencies/:username', () => {
    xit('should return 200 and the users agencies', async () => {
      const username = 'john';
      const response = await request.get(`${API_ROUTE}/agencies/${username}`);
      expect(response.status).toBe(200);
    });
    xit('should return 404 if no username', async () => {
      const username = 'john';
      const response = await request.get(`${API_ROUTE}/agencies/${username}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /reports/users', () => {
    xit('should return 200 and csv data', async () => {
      const response = await request.get(`/reports/users`);
      expect(response.status).toBe(200);
    });
    xit('should return 400 if malformed', async () => {
      const response = await request.get(`/reports/users`);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /reports/users', () => {
    xit('should return 200 and csv data', async () => {
      const response = await request.post(`/reports/users`);
      expect(response.status).toBe(200);
    });
    xit('should return 400 if malformed', async () => {
      const response = await request.post(`/reports/users`);
      expect(response.status).toBe(400);
    });
  });
});
