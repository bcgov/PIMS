import supertest from 'supertest';
import app from '@/express';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { GeoPoint } from '@/typeorm/Entities/abstractEntities/Property';

const request = supertest(app);
const API_PATH = '/v2/properties/parcels';

const mockPoint: GeoPoint = {
  x: 1.23,
  y: 4.56,
};

const mockParcel: Partial<Parcel> = {
  CreatedOn: faker.date.anytime(),
  UpdatedOn: faker.date.anytime(),
  UpdatedById: faker.string.uuid() as UUID,
  CreatedById: faker.string.uuid() as UUID,
  Id: faker.number.int(),
  PropertyTypeId: 0,
  Location: mockPoint,
  ProjectNumbers: '',
  Name: faker.location.cardinalDirection() + faker.location.city(),
  Description: faker.string.alpha(),
  ClassificationId: 0,
  AgencyId: 0,
  IsSensitive: false,
  PID: faker.number.int(),
  PIN: faker.number.int(),
  LandArea: 0,
  ParentParcelId: 1,
};

describe('INTEGRATION - Parcels', () => {
  describe('GET /properties/parcels/:id', () => {
    xit('should return status 200 with the requested parcel', async () => {
      const parcelId = '1';
      const response = await request.get(`${API_PATH}/${parcelId}`);
      // We will wanna mock some of the actual functionality here at some point.
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /properties/parcels/:id', () => {
    xit('should return status 200 with the requested parcel', async () => {
      const parcelId = '1';
      const updateBody = mockParcel;
      const response = await request.put(`${API_PATH}/${parcelId}`).send(updateBody);
      expect(response.status).toBe(200);
      //We will probably also want to do some kind of automated object parsing using yup or zod or similar.
      //That way we can succintly check the response body was returned correctly without checking every single property manually.
    });
  });

  describe('DELETE /properties/parcels/:id', () => {
    xit('should return status 200 with the deleted parcel', async () => {
      const parcelId = '1';
      const deleteBody = mockParcel;
      const response = await request.delete(`${API_PATH}/${parcelId}`).send(deleteBody);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /properties/parcels', () => {
    xit('should return status 200 with an array of parcels', async () => {
      const response = await request.get(`${API_PATH}?query=string`);
      expect(response.status).toBe(200);
    });
  });

  describe('POST /properties/parcels', () => {
    xit('should create a new parcel with status 201', async () => {
      const response = await request.post(`${API_PATH}`).send(mockParcel);
      expect(response.status).toBe(201);
    });
  });

  describe('POST /properties/filter', () => {
    xit('should filter parcels accroding to the body and return 200', async () => {
      const filterBody = {
        filter: 'string',
      };
      const response = await request.post(`${API_PATH}`).send(filterBody);
      expect(response.status).toBe(200);
    });
  });

  describe('PUT /properties/parcel/:id/financial', () => {
    xit('should update the financial info for the parcel accroding to the body and return 200', async () => {
      const parcelId = '1';
      const response = await request.put(`${API_PATH}/${parcelId}/financial`).send(mockParcel);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /properties/parcel/check/pin-available', () => {
    xit('should return a body with a bool and status 200', async () => {
      const pin = '1';
      const response = await request.get(`${API_PATH}/check/pin-available?pin=${pin}`);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /properties/parcel/check/pid-available', () => {
    xit('should return a body with a bool and status 200', async () => {
      const pid = '1';
      const response = await request.get(`${API_PATH}/check/pid-available?pid=${pid}`);
      expect(response.status).toBe(200);
    });
  });
});
