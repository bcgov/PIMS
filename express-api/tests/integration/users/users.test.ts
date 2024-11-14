import supertest from 'supertest';
import app from '@/express';
import {
  UserAccessRequest,
  UserAccessRequestSchema,
  UserKeycloakInfoSchema,
  UserReportCsvSchema,
  UserReportFilter,
} from '@/controllers/users/usersSchema';
import { faker } from '@faker-js/faker';
import { IUser } from '@/controllers/users/IUser';
import { UUID } from 'crypto';

const mockUser: IUser = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedById: faker.string.uuid() as UUID,
  createdById: faker.string.uuid() as UUID,
  id: faker.string.uuid() as UUID,
  displayName: faker.company.name(),
  firstName: faker.person.firstName(),
  middleName: faker.person.middleName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  username: faker.internet.username(),
  position: 'Tester',
};
const TOKEN = '';

const request = supertest(app);
describe('INTEGRATION - Users', () => {
  const API_ROUTE = '/v2/users';

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
      const parsed = UserKeycloakInfoSchema.parse(response);
      expect(parsed.id).toBe(1);
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
      const accessRequest: UserAccessRequest = {
        id: 1,
        note: 'updated',
      };
      const response = await request.put(`${API_ROUTE}/access/requests/${id}`).send(accessRequest);
      expect(response.status).toBe(200);
      const parsedResponse = UserAccessRequestSchema.parse(response);
      expect(parsedResponse.note).toBe('updated');
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
      expect(Array.isArray(response.body)).toBe(true);
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
      UserReportCsvSchema.parse(response.body);
    });
    xit('should return 400 if malformed', async () => {
      const response = await request.get(`/reports/users`);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /reports/users', () => {
    xit('should return 200 and csv data', async () => {
      const filter: UserReportFilter = {
        page: 1,
      };
      const response = await request.post(`/reports/users`).send(filter);
      expect(response.status).toBe(200);
      UserReportCsvSchema.parse(response.body);
    });
    xit('should return 400 if malformed', async () => {
      const badFilter = { a: 1 };
      const response = await request.post(`/reports/users`).send(badFilter);
      expect(response.status).toBe(400);
    });
  });

  describe(`GET ${API_ROUTE}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.get(`${API_ROUTE}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of users', async () => {
      const response = await request.get(`${API_ROUTE}`).set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${API_ROUTE}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.post(`${API_ROUTE}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 201 Created and a body of what was created', async () => {
      const response = await request
        .post(`${API_ROUTE}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(mockUser);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockUser.id);
    });
  });

  describe(`GET ${API_ROUTE}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching user data', async () => {
      const response = await request
        .get(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockUser.id);
    });
  });

  describe(`PUT ${API_ROUTE}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .put(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the updated user data', async () => {
      const response = await request
        .put(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ ...mockUser, firstName: 'new name' });
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('new name');
    });
  });

  describe(`DELETE ${API_ROUTE}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 204 and original should be gone', async () => {
      const response = await request
        .delete(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(204);
      // Then it should not be found in database after
      const notFoundResponse = await request
        .delete(`${API_ROUTE}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(notFoundResponse.status).toBe(404);
    });
  });

  describe(`POST ${API_ROUTE}/filter`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${API_ROUTE}/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of users', async () => {
      const response = await request
        .post(`${API_ROUTE}/filter`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          page: 0,
          quantity: 0,
          position: 'Tester',
          isDisabled: false,
        });
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${API_ROUTE}/my/agency`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${API_ROUTE}/my/agency`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    // Not clear why this would be a POST. Should be able to just send agency...
    // Could ditch this route entirely and just use get user filter route
    xit('should return status 200 with a list of users', async () => {
      const response = await request
        .post(`${API_ROUTE}/my/agency`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({
          page: 0,
          quantity: 0,
          position: 'Tester',
          isDisabled: false,
        });
      expect(response.status).toBe(200);
    });
  });

  describe(`GET ${API_ROUTE}/roles/:username`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${API_ROUTE}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the matching user', async () => {
      const response = await request
        .get(`${API_ROUTE}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.userName).toBe(mockUser.username);
    });
  });

  describe(`POST ${API_ROUTE}/roles/:username`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${API_ROUTE}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer notAToken`)
        .send('new role');
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the matching user and new role', async () => {
      const response = await request
        .post(`${API_ROUTE}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send('new role');
      expect(response.status).toBe(200);
      expect(response.body.roles).toContain('new role');
    });
  });

  describe(`DELETE ${API_ROUTE}/roles/:username`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${API_ROUTE}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer notAToken`)
        .send('new role');
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the matching user but without new role', async () => {
      const response = await request
        .delete(`${API_ROUTE}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send('new role');
      expect(response.status).toBe(200);
      expect(response.body.roles).not.toContain('new role');
    });
  });
});
