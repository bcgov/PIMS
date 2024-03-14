/* eslint-disable @typescript-eslint/no-explicit-any */
import { Agency } from '@/typeorm/Entities/Agency';
import { User, UserStatus } from '@/typeorm/Entities/User';
import { faker } from '@faker-js/faker';
import { UUID } from 'crypto';
import { Request, Response } from 'express';
import { Role as RolesEntity } from '@/typeorm/Entities/Role';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { EmailBody, IChesStatusResponse, IEmail } from '@/services/ches/chesServices';
import { Building } from '@/typeorm/Entities/Building';

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

export const produceUser = (): User => {
  const id = faker.string.uuid() as UUID;
  return {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    UpdatedBy: undefined,
    CreatedById: undefined,
    CreatedBy: undefined,
    Id: id,
    Status: UserStatus.Active,
    DisplayName: faker.company.name(),
    FirstName: faker.person.firstName(),
    MiddleName: faker.person.middleName(),
    LastName: faker.person.lastName(),
    Email: faker.internet.email(),
    Username: faker.internet.userName(),
    Position: 'Tester',
    EmailVerified: false,
    IsSystem: false,
    Note: '',
    LastLogin: faker.date.anytime(),
    ApprovedById: undefined,
    ApprovedBy: undefined,
    ApprovedOn: undefined,
    KeycloakUserId: faker.string.uuid() as UUID,
    Role: produceRole(),
    RoleId: undefined,
    Agency: produceAgency(id),
    AgencyId: undefined,
    IsDisabled: false,
  };
};

export const produceAgency = (code?: string): Agency => {
  const agency: Agency = {
    Id: faker.number.int({ max: 10 }),
    Name: faker.company.name(),
    IsDisabled: false,
    SortOrder: 0,
    Description: '',
    ParentId: undefined,
    Parent: undefined,
    Code: code ?? faker.string.alpha({ length: 4 }),
    Email: faker.internet.email(),
    SendEmail: false,
    AddressTo: '',
    CCEmail: faker.internet.email(),
    CreatedById: undefined,
    CreatedOn: new Date(),
    CreatedBy: undefined,
    UpdatedById: undefined,
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    Users: [],
  };
  return agency;
};

export const produceRole = (): RolesEntity => {
  return {
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    UpdatedById: undefined,
    UpdatedBy: undefined,
    CreatedById: undefined,
    CreatedBy: undefined,
    Id: faker.string.uuid() as UUID,
    Name: faker.company.name(),
    IsDisabled: false,
    Description: '',
    SortOrder: 0,
    KeycloakGroupId: faker.string.uuid() as UUID,
    IsPublic: false,
    Users: [],
  };
};

export const produceKeycloak = (): KeycloakUser => {
  return {
    name: faker.string.alphanumeric(),
    preferred_username: faker.string.alphanumeric(),
    email: faker.internet.email(),
    display_name: faker.string.alphanumeric(),
    client_roles: [faker.string.alphanumeric()],
    identity_provider: 'idir',
    idir_user_guid: faker.string.uuid(),
    idir_username: faker.string.alphanumeric(),
    given_name: faker.person.firstName(),
    family_name: faker.person.lastName(),
  };
};

export const produceParcel = (): Parcel => {
  return {
    Id: faker.number.int({ max: 10 }),
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    Name: faker.string.alphanumeric(),
    LandLegalDescription: faker.string.alphanumeric(),
    PID: faker.number.int({ min: 111111111, max: 999999999 }),
    PIN: undefined,
    LandArea: undefined,
    Zoning: undefined,
    ZoningPotential: undefined,
    NotOwned: undefined,
    ParentParcelId: undefined,
    ParentParcel: undefined,
    Description: faker.string.alphanumeric(),
    ClassificationId: undefined,
    Classification: undefined,
    AgencyId: undefined,
    Agency: undefined,
    AdministrativeAreaId: undefined,
    AdministrativeArea: undefined,
    IsSensitive: undefined,
    IsVisibleToOtherAgencies: undefined,
    Location: undefined,
    ProjectNumbers: undefined,
    PropertyTypeId: undefined,
    PropertyType: undefined,
    Address1: undefined,
    Address2: undefined,
    Postal: undefined,
    SiteId: undefined,
    CreatedById: undefined,
    CreatedBy: undefined,
    UpdatedById: undefined,
    UpdatedBy: undefined,
    Fiscals: [],
    Evaluations: [],
  };
};

export const produceEmailStatus = (props: Partial<IChesStatusResponse>): IChesStatusResponse => {
  const email: IChesStatusResponse = {
    status: props.status ?? 'completed',
    tag: props.tag ?? undefined,
    txId: props.txId ?? faker.string.uuid(),
    updatedTS: new Date().getTime(),
    createdTS: new Date().getTime(),
  };
  return email;
};

export const produceEmail = (props: Partial<IEmail>): IEmail => {
  const email: IEmail = {
    from: props.from ?? faker.internet.email(),
    to: props.to ?? [faker.internet.email()],
    bodyType: props.bodyType ?? ('text' as EmailBody.Text), //I love that Jest makes you do this!!
    subject: props.subject ?? faker.lorem.sentence(),
    body: props.body ?? faker.lorem.paragraph(),
    ...props,
  };
  return email;
};

export const produceBuilding = (): Building => {
  const id = faker.string.uuid() as UUID;
  return {
    Id: faker.number.int({ max: 10 }),
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    Name: faker.string.alphanumeric(),
    Description: faker.string.alphanumeric(),
    BuildingConstructionTypeId: undefined,
    BuildingConstructionType: undefined,
    BuildingFloorCount: undefined,
    BuildingPredominateUseId: undefined,
    BuildingPredominateUse: undefined,
    BuildingTenancy: undefined,
    RentableArea: undefined,
    BuildingOccupantTypeId: undefined,
    BuildingOccupantType: undefined,
    LeaseExpiry: undefined,
    OccupantName: undefined,
    TransferLeaseOnSale: undefined,
    BuildingTenancyUpdatedOn: undefined,
    EncumbranceReason: undefined,
    LeasedLandMetadata: undefined,
    TotalArea: undefined,
    ClassificationId: undefined,
    Classification: undefined,
    AgencyId: undefined,
    Agency: produceAgency(id),
    AdministrativeAreaId: undefined,
    AdministrativeArea: undefined,
    IsSensitive: undefined,
    IsVisibleToOtherAgencies: undefined,
    Location: undefined,
    ProjectNumbers: undefined,
    PropertyTypeId: undefined,
    PropertyType: undefined,
    Address1: undefined,
    Address2: undefined,
    Postal: undefined,
    SiteId: undefined,
    CreatedById: undefined,
    CreatedBy: undefined,
    UpdatedById: undefined,
    UpdatedBy: undefined,
    Fiscals: undefined,
    Evaluations: undefined,
    PID: undefined,
    PIN: undefined,
  };
};
