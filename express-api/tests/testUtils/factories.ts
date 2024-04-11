/* eslint-disable @typescript-eslint/no-explicit-any */
import { Agency } from '@/typeorm/Entities/Agency';
import { User, UserStatus } from '@/typeorm/Entities/User';
import { faker } from '@faker-js/faker';
import { UUID, randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Role as RolesEntity } from '@/typeorm/Entities/Role';
import { KeycloakUser } from '@bcgov/citz-imb-kc-express';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Building } from '@/typeorm/Entities/Building';
import { EmailBody, IChesStatusResponse, IEmail } from '@/services/ches/chesServices';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { IAddressModel } from '@/services/geocoder/interfaces/IAddressModel';
import { ISitePidsResponseModel } from '@/services/geocoder/interfaces/ISitePidsResponseModel';
import { RegionalDistrict } from '@/typeorm/Entities/RegionalDistrict';
import { TierLevel } from '@/typeorm/Entities/TierLevel';

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
export const produceAdminArea = (props: Partial<AdministrativeArea>): AdministrativeArea => {
  const adminArea: AdministrativeArea = {
    Id: faker.number.int(),
    Name: faker.location.city(),
    IsDisabled: false,
    SortOrder: 0,
    RegionalDistrictId: 0,
    RegionalDistrict: undefined,
    ProvinceId: 'BC',
    Province: undefined,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedOn: new Date(),
    UpdatedBy: undefined,
    ...props,
  };
  return adminArea;
};

export const produceClassification = (
  props: Partial<PropertyClassification>,
): PropertyClassification => {
  const classification: PropertyClassification = {
    Id: faker.number.int(),
    Name: faker.lorem.word(),
    IsDisabled: false,
    SortOrder: 0,
    IsVisible: false,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return classification;
};

export const producePredominateUse = (
  props: Partial<BuildingPredominateUse>,
): BuildingPredominateUse => {
  const predominateUse: BuildingPredominateUse = {
    Id: faker.number.int(),
    Name: faker.lorem.word(),
    IsDisabled: false,
    SortOrder: 0,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return predominateUse;
};

export const produceConstructionType = (props: Partial<BuildingPredominateUse>) => {
  const constructionType: BuildingPredominateUse = {
    Id: faker.number.int(),
    Name: faker.lorem.word(),
    IsDisabled: false,
    SortOrder: 0,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return constructionType;
};

export const produceRegionalDistrict = (props: Partial<RegionalDistrict>) => {
  const regionalDistrict: RegionalDistrict = {
    Id: faker.number.int(),
    Abbreviation: faker.string.alpha(5),
    Name: faker.location.city(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return regionalDistrict;
};

export const produceGeocoderAddress = (): IAddressModel => {
  const address: IAddressModel = {
    siteId: randomUUID(),
    fullAddress: faker.location.streetAddress(),
    address1: faker.location.streetAddress(),
    administrativeArea: faker.location.city(),
    provinceCode: faker.location.state(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    score: faker.number.int({ min: 0, max: 99 }),
  };
  return address;
};

export const producePidsResponse = (): ISitePidsResponseModel => {
  const pidResponse: ISitePidsResponseModel = {
    siteID: randomUUID(),
    pids: String(faker.number.int({ min: 11111111, max: 99999999 })),
  };
  return pidResponse;
};

export const produceTierLevels = (): TierLevel => {
  const tier: TierLevel = {
    Id: faker.number.int(),
    Name: `Tier ${faker.number.int()}`,
    IsDisabled: false,
    SortOrder: faker.number.int(),
    Description: faker.lorem.sentence(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
  };
  return tier;
};
