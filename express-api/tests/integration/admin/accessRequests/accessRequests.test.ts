import app from '../../../../express';
import supertest from 'supertest';

const request = supertest(app);

// TODO: enable tests when route is implemented
describe('INTEGRATION - GET /admin/accessRequests', () => {
  // TODO: pass fake keycloak token once route is protected
  const TOKEN = '';
  it('should return 401 Unauthorized if invalid token provided', async () => {
    const response = await request
      .get(`/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer notAToken`);
    expect(response.status).toBe(401);
  });

  xit('should return a 200 status code and a list of access requests', async () => {
    const response = await request
      .get(`/api/v2/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer ${TOKEN}`);

    expect(response.status).toBe(200);
  });

  xit('should return a 404 status code if no requests with the given parameters are found', async () => {
    const response = await request
      .get(`/api/v2/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(404);
  });

  xit('should return a 400 status code if given parameters are invalid', async () => {
    const response = await request
      .get(`/api/v2/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(400);
  });
});

describe('INTEGRATION - DELETE /admin/accessRequests', () => {
  // TODO: pass fake keycloak token once route is protected
  const TOKEN = '';
  it('should return 401 Unauthorized if invalid token provided', async () => {
    const response = await request
      .delete(`/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer notAToken`);
    expect(response.status).toBe(401);
  });

  xit('should return a 204 status code with no body', async () => {
    const response = await request
      .delete(`/api/v2/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer ${TOKEN}`);

    expect(response.status).toBe(204);
  });

  xit('should return a 404 status code if no requests with the given parameters are found', async () => {
    const response = await request
      .delete(`/api/v2/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(404);
  });

  xit('should return a 400 status code if given parameters are invalid', async () => {
    const response = await request
      .delete(`/api/v2/api/v2/admin/accessRequests`)
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(response.status).toBe(400);
  });
});
