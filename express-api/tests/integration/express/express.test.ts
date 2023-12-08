import app, { limiter } from '../../../express';
import supertest from 'supertest';

const request = supertest(app);

describe('INTEGRATION - Express', () => {
  const appSpy = jest.spyOn(app, 'use');

  it('should not use the rate limiter when testing', async () => {
    await request.get('/api/v2/health');
    expect(appSpy).not.toHaveBeenCalledWith(limiter);
  });
});
