import supertest from 'supertest';
import app from '@/express';
import {
  NOTIFICATION_QUEUE_ROUTE,
  NOTIFICATION_TEMPLATE_ROUTE,
} from '@/routes/notificationsRouter';
import {
  Notification,
  NotificationQueueFilter,
  NotificationTemplate,
} from '@/controllers/notifications/notificationsSchema';
import { faker } from '@faker-js/faker';

const request = supertest(app);

const makeNotification = (): Notification => {
  return {
    createdOn: faker.date.past().toISOString(),
    updatedOn: faker.date.recent().toISOString(),
    updatedByName: faker.person.firstName(),
    updatedByEmail: faker.internet.email(),
    rowVersion: faker.number.binary(),
    id: faker.number.int(),
    key: faker.string.uuid(),
    status: 'Pending',
    priority: 'High',
    encoding: 'UTF-8',
    bodyType: 'HTML',
    sendOn: faker.date.future().toISOString(),
    to: faker.internet.email(),
    bcc: faker.internet.email(),
    cc: faker.internet.email(),
    subject: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tag: faker.lorem.word(),
    projectId: faker.number.int(),
    toAgencyId: faker.number.int(),
    chesMessageId: faker.string.uuid(),
    chesTransactionId: faker.string.uuid(),
  };
};

const makeTemplate = (): NotificationTemplate => {
  return {
    createdOn: faker.date.past().toISOString(),
    updatedOn: faker.date.recent().toISOString(),
    updatedByName: faker.person.firstName(),
    updatedByEmail: faker.internet.email(),
    id: faker.number.int(),
    name: faker.lorem.words(),
    description: faker.lorem.sentence(),
    to: faker.internet.email(),
    cc: faker.internet.email(),
    bcc: faker.internet.email(),
    audience: faker.lorem.word(),
    encoding: 'UTF-8',
    bodyType: 'Text',
    priority: 'High',
    subject: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    isDisabled: faker.datatype.boolean(),
    tag: faker.lorem.word(),
    status: [
      {
        id: faker.number.int(),
        fromStatusId: faker.number.int(),
        fromStatus: faker.lorem.word(),
        toStatusId: faker.number.int(),
        toStatus: faker.lorem.word(),
        priority: faker.lorem.word(),
        delay: faker.lorem.word(),
        delayDays: faker.number.int(),
      },
    ],
  };
};

describe('INTEGRATION - Notifications', () => {
  describe('GET /notifications/queue', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.get(NOTIFICATION_QUEUE_ROUTE);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /notifications/queue/filter', () => {
    xit('should return status 200 for successful request', async () => {
      const filter: NotificationQueueFilter = {
        page: 0,
        agencyId: 1,
      };
      const response = await request
        .post(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/filter`)
        .send(filter);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 400 for invalid request', async () => {
      const filter = {
        bad: 'a',
      };
      const response = await request
        .post(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/filter/invalid_id`)
        .send(filter);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /notifications/queue/:id', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.get(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.get(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/999`);
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const response = await request.get(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/invalid_id`);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /notifications/queue/:id', () => {
    xit('should return status 200 for successful request', async () => {
      const updateBody = makeNotification();
      const response = await request
        .put(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/1`)
        .send(updateBody);
      expect(response.status).toBe(200);
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.put(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/999`);
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const body = { a: 'b' };
      const response = await request.put(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/1`).send(body);
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /notifications/queue/:id/resend', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.put(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/1/resend`);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /notifications/queue/:id', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.delete(`/notifications/${NOTIFICATION_QUEUE_ROUTE}/1`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /notifications/templates', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.get(NOTIFICATION_TEMPLATE_ROUTE);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /notifications/templates/:id', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.get(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/1`);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.get(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/999`);
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const response = await request.get(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/invalid_id`,
      );
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /notifications/templates/:id', () => {
    xit('should return status 200 for successful request', async () => {
      const templateBody = makeTemplate();
      const response = await request
        .put(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/1`)
        .send(templateBody);
      expect(response.status).toBe(200);
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.put(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/999`);
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const response = await request.put(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/invalid_id`,
      );
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /notifications/templates/:id', () => {
    xit('should return status 200 for successful request', async () => {
      const response = await request.delete(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/1`);
      expect(response.status).toBe(200);
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.delete(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/999`);
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const response = await request.delete(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/invalid_id`,
      );
      expect(response.status).toBe(400);
    });
  });

  describe('POST /notifications/templates', () => {
    xit('should return status 200 for successful request', async () => {
      const templateBody = makeTemplate();
      const response = await request.post(NOTIFICATION_TEMPLATE_ROUTE).send(templateBody);
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.post(`/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/999`);
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const response = await request.post(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/invalid_id`,
      );
      expect(response.status).toBe(400);
    });
  });

  describe('POST /notifications/templates/:templateId/projects/:projectId', () => {
    xit('should return status 201 for successful request', async () => {
      const response = await request.post(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/1/projects/1`,
      );
      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    xit('should return status 404 for non-existent resource', async () => {
      const response = await request.post(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/999/projects/1`,
      );
      expect(response.status).toBe(404);
    });

    xit('should return status 400 for invalid request', async () => {
      const response = await request.post(
        `/notifications/${NOTIFICATION_TEMPLATE_ROUTE}/invalid_id/projects/1`,
      );
      expect(response.status).toBe(400);
    });
  });
});
