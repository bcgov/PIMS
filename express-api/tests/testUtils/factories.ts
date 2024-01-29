/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessRequests } from '@/typeorm/Entities/AccessRequests';
import { Agencies } from '@/typeorm/Entities/Agencies';
import { Users, Roles as RolesEntity } from '@/typeorm/Entities/Users_Roles_Claims';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { Request, Response } from 'express';

export class MockRes {
  statusValue: any;
  status = jest.fn().mockImplementation((value: any) => {
    this.statusValue = value;

    return this;
  });

  jsonValue: any;
  json = jest.fn().mockImplementation((value: any) => {
    this.jsonValue = value;

    return this;
  });

  sendValue: any;
  send = jest.fn().mockImplementation((value: any) => {
    this.sendValue = value;

    return this;
  });
}

export class MockReq {
  query = {};
  params = {};
  body = {};
  user = {};
  headers = {};
  files: any[] = [];

  public setUser = (userData: object) => {
    const defaultUserObject = {
      idir_user_guid: 'W7802F34D2390EFA9E7JK15923770279',
      identity_provider: 'idir',
      idir_username: 'JOHNDOE',
      name: 'Doe, John CITZ:EX',
      preferred_username: 'a7254c34i2755fea9e7ed15918356158@idir',
      given_name: 'John',
      display_name: 'Doe, John CITZ:EX',
      family_name: 'Doe',
      email: 'john.doe@gov.bc.ca',
      client_roles: [] as string[],
    };
    this.user = {
      ...defaultUserObject,
      ...userData,
    };
  };
}

/**
 * Returns several mocks for testing RequestHandler responses.
 *
 * @return {*}
 */
export const getRequestHandlerMocks = () => {
  const mockReq = new MockReq() as Request & MockReq;

  const mockRes = new MockRes() as Response & MockRes;

  //const mockNext; May need to implement this as well.

  return { mockReq, mockRes /*mockNext*/ };
};

export const produceUser = (): Users => {
  return {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    CreatedById: undefined,
    Id: faker.string.uuid() as UUID,
    DisplayName: faker.company.name(),
    FirstName: faker.person.firstName(),
    MiddleName: faker.person.middleName(),
    LastName: faker.person.lastName(),
    Email: faker.internet.email(),
    Username: faker.internet.userName(),
    Position: 'Tester',
    IsDisabled: false,
    EmailVerified: false,
    IsSystem: false,
    Note: '',
    LastLogin: faker.date.anytime(),
    ApprovedById: undefined,
    ApprovedOn: undefined,
    KeycloakUserId: faker.string.uuid() as UUID,
    UserRoles: [],
    Agency: undefined,
    AgencyId: undefined,
  };
};

export const produceRequest = (): AccessRequests => {
  const request: AccessRequests = {
    Id: faker.number.int(),
    UserId: produceUser(),
    Note: 'test',
    Status: 0,
    RoleId: undefined,
    AgencyId: produceAgency(),
    CreatedById: undefined,
    CreatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    UpdatedOn: faker.date.anytime(),
  };
  return request;
};

export const produceAgency = (): Agencies => {
  const agency: Agencies = {
    Id: faker.string.numeric(6),
    Name: faker.company.name(),
    IsDisabled: false,
    SortOrder: 0,
    Description: '',
    ParentId: undefined,
    Email: faker.internet.email(),
    SendEmail: false,
    AddressTo: '',
    CCEmail: faker.internet.email(),
    UserAgencies: [],
    CreatedById: produceUser(),
    CreatedOn: new Date(),
    UpdatedById: produceUser(),
    UpdatedOn: new Date(),
  };
  return agency;
};

export const produceRole = (): RolesEntity => {
  return {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    CreatedById: undefined,
    Id: faker.string.uuid() as UUID,
    Name: faker.company.name(),
    IsDisabled: false,
    Description: '',
    SortOrder: 0,
    KeycloakGroupId: faker.string.uuid() as UUID,
    IsPublic: false,
    UserRoles: [],
    RoleClaims: [],
  };
};
