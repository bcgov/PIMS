import { IAccessRequestList } from '@/controllers/admin/accessRequests/IAccessRequestList';
import { IAccessRequest } from '@/controllers/admin/accessRequests/IAccessRequest';
import app from '@/express';
import supertest from 'supertest';

const request = supertest(app);

const expectedList: IAccessRequestList = {
  items: [
    {
      createdOn: '2023-12-21T21:04:15.758Z',
      updatedOn: '2023-12-21T21:04:15.758Z',
      updatedByName: 'string',
      updatedByEmail: 'string',
      rowVersion: 'string',
      id: 'fekljsfkl-sdf-sdfsd-sdfsd-sdfsd',
      status: 'Approved',
      note: 'string',
      user: {
        createdOn: '2023-12-21T21:04:15.758Z',
        updatedOn: '2023-12-21T21:04:15.758Z',
        updatedByName: 'string',
        updatedByEmail: 'string',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        displayName: 'string',
        firstName: 'string',
        middleName: 'string',
        lastName: 'string',
        email: 'string',
        username: 'string',
        position: 'string',
      },
      agencies: [
        {
          createdOn: '2023-12-21T21:04:15.758Z',
          updatedOn: '2023-12-21T21:04:15.758Z',
          updatedByName: 'string',
          updatedByEmail: 'string',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'string',
          isDisabled: true,
          isVisible: true,
          sortOrder: 0,
          type: 'string',
          code: 'string',
          parentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          description: 'string',
        },
      ],
      roles: [
        {
          createdOn: '2023-12-21T21:04:15.758Z',
          updatedOn: '2023-12-21T21:04:15.758Z',
          updatedByName: 'string',
          updatedByEmail: 'string',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'string',
          isDisabled: true,
          isVisible: true,
          sortOrder: 0,
          type: 'string',
          description: 'string',
        },
      ],
    } as IAccessRequest,
  ],
  page: 0,
  quantity: 1,
  total: 1,
};

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
    const list: IAccessRequestList = response.body;
    expect(list.items.at(0).id).toBe(expectedList.items.at(0).id);
    expect(list.total).toBe(expectedList.total);
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
