import app from '../../../express';
import supertest from 'supertest';

const request = supertest(app);

describe('INTEGRATION - /health', () => {
  it('should return a 200 status code and relevant text message', async () => {
    const response = await request.get('/api/v2/health');
    expect(response.status).toBe(200);
    expect(response.text).toBe('/health endpoint reached. API running.');
  });
});
