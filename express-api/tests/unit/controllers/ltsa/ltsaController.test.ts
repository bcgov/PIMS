import { Request, Response } from 'express';
import controllers from '@/controllers';
import { ErrorWithCode } from '@/utilities/customErrors/ErrorWithCode';

describe('UNIT - Testing controllers for /ltsa routes', () => {
  const mockRequest = {
    user: {
      idir_user_guid: 'W7802F34D2390EFA9E7JK15923770279',
      identity_provider: 'idir',
      idir_username: 'JOHNDOE',
      name: 'Doe, John CITZ:EX',
      preferred_username: 'a7254c34i2755fea9e7ed15918356158@idir',
      given_name: 'John',
      display_name: 'Doe, John CITZ:EX',
      family_name: 'Doe',
      email: 'john.doe@gov.bc.ca',
      client_roles: ['Admin'],
    },
  } as unknown as Request;
  const mockResponse = {
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  it('should return status 200 and LTSA information', async () => {
    mockRequest.query = {
      pid: '000382345',
    };

    await controllers.getLTSA(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenLastCalledWith(200);
  });

  it('should throw an error if the when PID is invalid', async () => {
    mockRequest.query = {
      pid: 'notapid',
    };

    expect(async () => await controllers.getLTSA(mockRequest, mockResponse)).rejects.toThrow(
      new ErrorWithCode(
        '(LTSA) notapid is an invalid parcel identifier (PID) format. Please check your records and try again. [50201]',
        400,
      ),
    );
  });
});
