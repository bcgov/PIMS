import supertest from 'supertest';
import app from '@/express';

const request = supertest(app);

describe('INTEGRATION - Reports', () => {
  describe('GET /reports/projects', () => {
    xit('should return status 200 with reports as csv', async () => {
      const response = await request.get('/reports/projects').set('Accept', 'text/csv');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
    xit('should return status 200 with reports as excel', async () => {
      let response = await request
        .get('/reports/projects')
        .set('Accept', 'application/application/vnd.ms-excel');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      response = await request
        .get('/reports/projects')
        .set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
    xit('should return status 400 on bad accept header', async () => {
      //Note: Although the original API would probably give a 500 here, I think we should handle it cleanly
      //and return a 400 instead.
      const response = await request.get('/reports/projects').set('Accept', 'badheaderval');
      expect(response.status).toBe(400);
      expect(response.body).toBeUndefined();
    });
  });
  describe('GET /reports/properties', () => {
    xit('should return status 200 with reports as csv', async () => {
      const response = await request.get('/reports/properties').set('Accept', 'text/csv');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 200 with reports as excel', async () => {
      let response = await request
        .get('/reports/properties')
        .set('Accept', 'application/vnd.ms-excel');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      response = await request
        .get('/reports/properties')
        .set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 400 on bad accept header', async () => {
      const response = await request.get('/reports/properties').set('Accept', 'badheaderval');
      expect(response.status).toBe(400);
      expect(response.body).toBeUndefined();
    });
  });

  describe('GET /reports/users', () => {
    xit('should return status 200 with reports as csv', async () => {
      const response = await request.get('/reports/users').set('Accept', 'text/csv');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 200 with reports as excel', async () => {
      let response = await request.get('/reports/users').set('Accept', 'application/vnd.ms-excel');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();

      response = await request
        .get('/reports/users')
        .set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 400 on bad accept header', async () => {
      const response = await request.get('/reports/users').set('Accept', 'badheaderval');
      expect(response.status).toBe(400);
      expect(response.body).toBeUndefined();
    });
  });
});
