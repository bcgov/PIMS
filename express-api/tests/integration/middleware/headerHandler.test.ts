import app from '@/express';
import supertest from 'supertest';

const request = supertest(app);

// For these tests, we're just checking that headerHandler has changed expected headers.
// Using the health endpoint to trigger these changes.
describe('INTEGRATION - headerHandler middleware', () => {
  it('should set headers with expected values', async () => {
    const response = await request.get('/v2/health');
    // Remember to use lower case for header keys
    expect(response.header['access-control-allow-methods']).toBe('GET,PUT,PATCH,POST,DELETE');
    expect(response.header['access-control-allow-headers']).toBe(
      'Content-Type, Accept, Authorization',
    );
  });
});
