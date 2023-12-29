import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import app from '@/express';
import { UUID } from 'crypto';
import { IUser } from '@/controllers/admin/users/IUser';

const request = supertest(app);

const USERS_PATH = '/api/v2//admin/users';
const mockUser: IUser = {
  createdOn: faker.date.anytime().toLocaleString(),
  updatedOn: faker.date.anytime().toLocaleString(),
  updatedByName: faker.person.firstName(),
  updatedByEmail: faker.internet.email(),
  id: faker.string.uuid() as UUID,
  displayName: faker.company.name(),
  firstName: faker.person.firstName(),
  middleName: faker.person.middleName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  position: 'Tester',
};
describe('INTEGRATION - Users Admin', () => {
  // TODO: figure out how to mock keycloak
  const TOKEN = '';
  describe(`GET ${USERS_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.get(`${USERS_PATH}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of users', async () => {
      const response = await request.get(`${USERS_PATH}`).set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${USERS_PATH}`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request.post(`${USERS_PATH}`).set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 201 Created and a body of what was created', async () => {
      const response = await request
        .post(`${USERS_PATH}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(mockUser);
      expect(response.status).toBe(201);
      expect(response.body.id).toBe(mockUser.id);
    });
  });

  describe(`GET ${USERS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the matching user data', async () => {
      const response = await request
        .get(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(mockUser.id);
    });
  });

  describe(`PUT ${USERS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .put(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 200 and the updated user data', async () => {
      const response = await request
        .put(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send({ ...mockUser, firstName: 'new name' });
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('new name');
    });
  });

  describe(`DELETE ${USERS_PATH}/:id`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return 204 and original should be gone', async () => {
      const response = await request
        .delete(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(204);
      // Then it should not be found in database after
      const notFoundResponse = await request
        .delete(`${USERS_PATH}/${mockUser.id}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(notFoundResponse.status).toBe(404);
    });
  });

  describe(`POST ${USERS_PATH}/filter`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${USERS_PATH}/filter`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with a list of users', async () => {
      const response = await request
        .post(`${USERS_PATH}/filter`)
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

  describe(`POST ${USERS_PATH}/my/agency`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${USERS_PATH}/my/agency`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    // Not clear why this would be a POST. Should be able to just send agency...
    // Could ditch this route entirely and just use get user filter route
    xit('should return status 200 with a list of users', async () => {
      const response = await request
        .post(`${USERS_PATH}/my/agency`)
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

  describe(`GET ${USERS_PATH}/roles/:username`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .get(`${USERS_PATH}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer notAToken`);
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the matching user', async () => {
      const response = await request
        .get(`${USERS_PATH}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer ${TOKEN}`);
      expect(response.status).toBe(200);
      expect(response.body.userName).toBe(mockUser.username);
    });
  });

  describe(`POST ${USERS_PATH}/roles/:username`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .post(`${USERS_PATH}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer notAToken`)
        .send('new role');
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the matching user and new role', async () => {
      const response = await request
        .post(`${USERS_PATH}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send('new role');
      expect(response.status).toBe(200);
      expect(response.body.roles).toContain('new role');
    });
  });

  describe(`DELETE ${USERS_PATH}/roles/:username`, () => {
    it('should return 401 Unauthorized if invalid token provided', async () => {
      const response = await request
        .delete(`${USERS_PATH}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer notAToken`)
        .send('new role');
      expect(response.status).toBe(401);
    });

    xit('should return status 200 with the matching user but without new role', async () => {
      const response = await request
        .delete(`${USERS_PATH}/roles/${mockUser.username}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send('new role');
      expect(response.status).toBe(200);
      expect(response.body.roles).not.toContain('new role');
    });
  });
});
