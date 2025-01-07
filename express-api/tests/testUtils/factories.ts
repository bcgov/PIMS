/* eslint-disable @typescript-eslint/no-explicit-any */
import { Agency } from '@/typeorm/Entities/Agency';
import { User, UserStatus } from '@/typeorm/Entities/User';
import { faker } from '@faker-js/faker';
import { UUID, randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { Role as RolesEntity } from '@/typeorm/Entities/Role';
import { SSOUser } from '@bcgov/citz-imb-sso-express';
import { Parcel } from '@/typeorm/Entities/Parcel';
import { Building } from '@/typeorm/Entities/Building';
import {
  EmailBody,
  EmailEncoding,
  EmailPriority,
  IChesStatusResponse,
  IEmail,
} from '@/services/ches/chesServices';
import { AdministrativeArea } from '@/typeorm/Entities/AdministrativeArea';
import { PropertyClassification } from '@/typeorm/Entities/PropertyClassification';
import { BuildingPredominateUse } from '@/typeorm/Entities/BuildingPredominateUse';
import { IAddressModel } from '@/services/geocoder/interfaces/IAddressModel';
import { ISitePidsResponseModel } from '@/services/geocoder/interfaces/ISitePidsResponseModel';
import { RegionalDistrict } from '@/typeorm/Entities/RegionalDistrict';
import { TierLevel } from '@/typeorm/Entities/TierLevel';
import { Project } from '@/typeorm/Entities/Project';
import { ProjectProperty } from '@/typeorm/Entities/ProjectProperty';
import { ProjectStatusHistory } from '@/typeorm/Entities/ProjectStatusHistory';
import { Task } from '@/typeorm/Entities/Task';
import { ProjectTask } from '@/typeorm/Entities/ProjectTask';
import { ProjectStatusNotification } from '@/typeorm/Entities/ProjectStatusNotification';
import { NotificationQueue } from '@/typeorm/Entities/NotificationQueue';
import { NotificationAudience } from '@/services/notifications/notificationServices';
import { NotificationTemplate } from '@/typeorm/Entities/NotificationTemplate';
import { BuildingFiscal } from '@/typeorm/Entities/BuildingFiscal';
import { BuildingEvaluation } from '@/typeorm/Entities/BuildingEvaluation';
import { ParcelFiscal } from '@/typeorm/Entities/ParcelFiscal';
import { ParcelEvaluation } from '@/typeorm/Entities/ParcelEvaluation';
import { ProjectAgencyResponse } from '@/typeorm/Entities/ProjectAgencyResponse';
import { ProjectNote } from '@/typeorm/Entities/ProjectNote';
import { ILtsaOrder } from '@/services/ltsa/interfaces/ILtsaOrder';
import { NoteType } from '@/typeorm/Entities/NoteType';
import { ProjectTimestamp } from '@/typeorm/Entities/ProjectTimestamp';
import { ProjectMonetary } from '@/typeorm/Entities/ProjectMonetary';
import { MonetaryType } from '@/typeorm/Entities/MonetaryType';
import { TimestampType } from '@/typeorm/Entities/TimestampType';
import { ProjectRisk } from '@/typeorm/Entities/ProjectRisk';
import { PropertyType } from '@/typeorm/Entities/PropertyType';
import { ProjectType } from '@/typeorm/Entities/ProjectType';
import { ProjectStatus } from '@/typeorm/Entities/ProjectStatus';
import { PropertyUnion } from '@/typeorm/Entities/views/PropertyUnionView';
import { ImportResult } from '@/typeorm/Entities/ImportResult';
import { ProjectJoin } from '@/typeorm/Entities/views/ProjectJoinView';
import { ImportRow } from '@/services/properties/propertiesServices';
import { PimsRequestUser } from '@/middleware/userAuthCheck';
import { MapProperties } from '@/typeorm/Entities/views/MapPropertiesView';

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
  pimsUser = {};

  public setUser = (userData?: object) => {
    const defaultUserObject = {
      guid: 'W7802F34D2390EFA9E7JK15923770279',
      identity_provider: 'idir',
      username: 'JOHNDOE',
      name: 'Doe, John CITZ:EX',
      preferred_username: 'a7254c34i2755fea9e7ed15918356158@idir',
      first_name: 'John',
      display_name: 'Doe, John CITZ:EX',
      last_name: 'Doe',
      email: 'john.doe@gov.bc.ca',
      client_roles: [] as string[],
      hasRoles: () => true,
      ...userData,
    };
    this.user = defaultUserObject;
  };

  public setPimsUser = (userData?: Partial<PimsRequestUser>) => {
    const defaultObject = producePimsRequestUser();
    this.pimsUser = {
      ...defaultObject,
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

export const produceUser = (props?: Partial<User>): User => {
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
    Username: faker.internet.username(),
    Position: 'Tester',
    Note: '',
    LastLogin: faker.date.anytime(),
    ApprovedById: undefined,
    ApprovedBy: undefined,
    ApprovedOn: undefined,
    KeycloakUserId: faker.string.uuid() as UUID,
    Role: produceRole(),
    RoleId: undefined,
    Agency: produceAgency(),
    AgencyId: undefined,
    IsDisabled: false,
    ...props,
  };
};

export const produceAgency = (props?: Partial<Agency>): Agency => {
  const agency: Agency = {
    Id: faker.number.int({ max: 10 }),
    Name: faker.company.name(),
    IsDisabled: false,
    SortOrder: 0,
    Description: '',
    ParentId: undefined,
    Parent: undefined,
    Code: faker.string.alpha({ length: 4 }),
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
    ...props,
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
    Users: [],
  };
};

export const produceSSO = (props?: Partial<SSOUser>): SSOUser => {
  return {
    name: faker.string.alphanumeric(),
    preferred_username: faker.string.alphanumeric(),
    email: faker.internet.email(),
    display_name: faker.string.alphanumeric(),
    client_roles: [faker.string.alphanumeric()],
    identity_provider: 'idir',
    guid: faker.string.uuid(),
    username: faker.string.alphanumeric(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    originalData: null,
    hasRoles: null,
    ...props,
  };
};

export const producePimsRequestUser = (props?: Partial<PimsRequestUser>): PimsRequestUser => {
  const user = produceUser();
  return {
    ...user,
    hasOneOfRoles: () => true,
    ...props,
  };
};

export const produceParcel = (props?: Partial<Parcel>): Parcel => {
  const id = faker.number.int({ max: 10 });
  return {
    Id: faker.number.int({ max: 10 }),
    CreatedOn: faker.date.anytime(),
    UpdatedOn: faker.date.anytime(),
    Name: faker.string.alphanumeric(),
    PID: faker.number.int({ min: 111111111, max: 999999999 }),
    PIN: undefined,
    LandArea: undefined,
    ParentParcelId: undefined,
    ParentParcel: undefined,
    Description: faker.string.alphanumeric(),
    ClassificationId: undefined,
    Classification: undefined,
    AgencyId: 1,
    Agency: undefined,
    AdministrativeAreaId: undefined,
    AdministrativeArea: undefined,
    IsSensitive: undefined,
    Location: undefined,
    ProjectNumbers: undefined,
    PropertyTypeId: undefined,
    PropertyType: undefined,
    Address1: undefined,
    Address2: undefined,
    Postal: undefined,
    CreatedById: undefined,
    CreatedBy: undefined,
    UpdatedById: undefined,
    UpdatedBy: undefined,
    Fiscals: produceParcelFiscals(id),
    Evaluations: produceParcelEvaluations(id),
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
};

export const produceEmailStatus = (props: Partial<IChesStatusResponse>): IChesStatusResponse => {
  const email: IChesStatusResponse = {
    status: props.status ?? 'completed',
    tag: props.tag ?? undefined,
    txId: props.txId ?? faker.string.uuid(),
    updatedTS: new Date().getTime(),
    createdTS: new Date().getTime(),
    msgId: props.msgId ?? faker.string.uuid(),
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

export const produceBuilding = (props?: Partial<Building>): Building => {
  const agencyId = faker.number.int();
  const id = faker.number.int({ max: 10 });
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
    BuildingTenancyUpdatedOn: undefined,
    TotalArea: undefined,
    ClassificationId: undefined,
    Classification: undefined,
    AgencyId: undefined,
    Agency: produceAgency({ Id: agencyId }),
    AdministrativeAreaId: undefined,
    AdministrativeArea: undefined,
    IsSensitive: undefined,
    Location: undefined,
    ProjectNumbers: undefined,
    PropertyTypeId: undefined,
    PropertyType: undefined,
    Address1: undefined,
    Address2: undefined,
    Postal: undefined,
    CreatedById: undefined,
    CreatedBy: undefined,
    UpdatedById: undefined,
    UpdatedBy: undefined,
    Fiscals: produceBuildingFiscals(id),
    Evaluations: produceBuildingEvaluations(id),
    PID: undefined,
    PIN: undefined,
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
};

export const produceBuildingEvaluations = (
  buildingId: number,
  props?: Partial<BuildingEvaluation>,
): BuildingEvaluation[] => {
  let evaluation: BuildingEvaluation = new BuildingEvaluation();

  evaluation.BuildingId = buildingId;
  evaluation.Year = faker.date.past().getFullYear();
  evaluation.EvaluationKeyId = 0;
  evaluation.Value = 20000;
  evaluation.EvaluationKey = undefined;
  evaluation.Note = undefined;

  evaluation = { ...evaluation, ...props };
  return [evaluation];
};

export const produceBuildingFiscals = (
  buildingId: number,
  props?: Partial<BuildingFiscal>,
): BuildingFiscal[] => {
  let fiscal: BuildingFiscal = new BuildingFiscal();
  fiscal.BuildingId = buildingId;
  fiscal.FiscalYear = faker.date.past().getFullYear();
  fiscal.FiscalKeyId = 0;
  fiscal.Value = 20000;

  fiscal = { ...fiscal, ...props };

  return [fiscal];
};

export const produceParcelEvaluations = (
  parcelId: number,
  props?: Partial<ParcelEvaluation>,
): ParcelEvaluation[] => {
  let evaluation: ParcelEvaluation = new ParcelEvaluation();

  evaluation.ParcelId = parcelId;
  evaluation.Year = faker.date.past().getFullYear();
  evaluation.EvaluationKeyId = 0;
  evaluation.Value = 20000;
  evaluation.EvaluationKey = undefined;
  evaluation.Note = undefined;

  evaluation = { ...evaluation, ...props };

  return [evaluation];
};

export const produceParcelFiscals = (
  parcelId: number,
  props?: Partial<ParcelFiscal>,
): ParcelFiscal[] => {
  let fiscal: ParcelFiscal = new ParcelFiscal();
  fiscal.ParcelId = parcelId;
  fiscal.FiscalYear = faker.date.past().getFullYear();
  fiscal.FiscalKeyId = 0;
  fiscal.Value = 1000000;
  fiscal = { ...fiscal, ...props };
  return [fiscal];
};

export const produceAdminArea = (props?: Partial<AdministrativeArea>): AdministrativeArea => {
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
  props?: Partial<PropertyClassification>,
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
  props?: Partial<BuildingPredominateUse>,
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

export const produceConstructionType = (props?: Partial<BuildingPredominateUse>) => {
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

export const produceRegionalDistrict = (props?: Partial<RegionalDistrict>) => {
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

export const produceTierLevel = (): TierLevel => {
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

export const produceTask = (): Task => {
  const task: Task = {
    Id: faker.number.int(),
    Name: faker.commerce.product(),
    IsDisabled: faker.datatype.boolean(),
    SortOrder: 0,
    Description: faker.lorem.sentence(),
    IsOptional: false,
    StatusId: faker.number.int(),
    Status: undefined,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
  };
  return task;
};

export const produceNoteType = (): NoteType => {
  const noteType: NoteType = {
    Id: faker.number.int(),
    Name: faker.commerce.product(),
    IsDisabled: faker.datatype.boolean(),
    SortOrder: 0,
    Description: faker.lorem.sentence(),
    IsOptional: false,
    StatusId: faker.number.int(),
    Status: undefined,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
  };
  return noteType;
};

export const produceMonetaryType = (): MonetaryType => {
  const monetaryType: MonetaryType = {
    Id: faker.number.int(),
    Name: faker.commerce.product(),
    IsDisabled: faker.datatype.boolean(),
    SortOrder: 0,
    Description: faker.lorem.sentence(),
    IsOptional: false,
    StatusId: faker.number.int(),
    Status: undefined,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
  };
  return monetaryType;
};

export const produceTimestampType = (): TimestampType => {
  const timestampType: TimestampType = {
    Id: faker.number.int(),
    Name: faker.commerce.product(),
    IsDisabled: faker.datatype.boolean(),
    SortOrder: 0,
    Description: faker.lorem.sentence(),
    IsOptional: false,
    StatusId: faker.number.int(),
    Status: undefined,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
  };
  return timestampType;
};

export const produceProject = (
  props?: Partial<Project>,
  projectProperties?: ProjectProperty[],
  produceRelations?: boolean,
): Project => {
  const projectId = faker.number.int();
  const project: Project = {
    Id: projectId,
    Name: faker.lorem.word(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ProjectNumber: `SPP-${faker.number.int()}`,
    Manager: faker.person.fullName(),
    ReportedFiscalYear: faker.number.int({ min: 1990, max: 2040 }),
    ActualFiscalYear: faker.number.int({ min: 1990, max: 2040 }),
    Description: faker.string.sample(),
    NetBook: faker.number.int(),
    Assessed: faker.number.int(),
    Appraised: faker.number.int(),
    Market: faker.number.int(),
    SubmittedOn: null,
    ApprovedOn: null,
    DeniedOn: null,
    CancelledOn: null,
    CompletedOn: null,
    ProjectType: 1,
    AgencyId: 1,
    Agency: produceRelations ? produceAgency() : null,
    TierLevelId: 1,
    TierLevel: produceRelations ? produceTierLevel() : null,
    StatusId: 1,
    Status: produceRelations ? produceProjectStatus() : null,
    RiskId: 1,
    Risk: produceRelations ? produceRisk() : null,
    Tasks: produceRelations ? [produceProjectTask()] : [],
    ProjectProperties: projectProperties ?? [
      produceProjectProperty({
        ProjectId: projectId,
      }),
    ],
    Timestamps: produceRelations ? [produceProjectTimestamp()] : [],
    Monetaries: produceRelations ? [produceProjectMonetary()] : [],
    Notifications: [],
    StatusHistory: [],
    Notes: produceRelations ? [produceNote()] : [],
    AgencyResponses: [],
    DeletedBy: undefined,
    DeletedById: null,
    DeletedOn: null,
    ...props,
  };
  return project;
};

export const produceProjectJoin = (props?: Partial<ProjectJoin>) => {
  const project: ProjectJoin = {
    Id: faker.number.int(),
    ProjectNumber: 'SPP-' + faker.number.int(),
    Name: faker.company.name(),
    StatusId: faker.number.int(),
    AgencyId: faker.number.int(),
    Agency: faker.company.name(),
    Status: faker.commerce.department(),
    Market: '$' + faker.number.int(),
    NetBook: '$' + faker.number.int(),
    UpdatedBy: faker.person.fullName(),
    UpdatedOn: new Date(),
    ...props,
  };
  return project;
};

export const produceRisk = (props?: Partial<ProjectRisk>): ProjectRisk => {
  const risk: ProjectRisk = {
    Id: faker.number.int(),
    Name: 'Green',
    IsDisabled: false,
    SortOrder: 0,
    Code: 'GREEN',
    Description: 'Low risk',
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return risk;
};

export const produceProjectStatus = (props?: Partial<ProjectStatus>): ProjectStatus => {
  const status: ProjectStatus = {
    Id: faker.number.int(),
    Name: 'Submitted',
    IsDisabled: false,
    SortOrder: 0,
    Description: '',
    Code: 'SUB',
    IsMilestone: false,
    IsTerminal: false,
    GroupName: 'Submitted',
    Route: '/route',
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return status;
};
export const producePropertyType = (props?: Partial<PropertyType>): PropertyType => {
  const type: ProjectType = {
    Id: faker.number.int(),
    Name: 'Parcel',
    IsDisabled: false,
    SortOrder: 0,
    Description: '',
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return type;
};

export const produceNote = (props?: Partial<ProjectNote>): ProjectNote => {
  const note: ProjectNote = {
    Id: faker.number.int(),
    ProjectId: faker.number.int(),
    Project: undefined,
    NoteTypeId: faker.number.int(),
    NoteType: undefined,
    Note: faker.lorem.lines(),
    DeletedBy: undefined,
    DeletedById: null,
    DeletedOn: null,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return note;
};

export const produceProjectProperty = (
  props?: Partial<ProjectProperty>,
  produceRelations?: boolean,
): ProjectProperty => {
  const projectProperty: ProjectProperty = {
    Id: faker.number.int(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ProjectId: faker.number.int(),
    Project: produceRelations ? produceProject() : null,
    PropertyTypeId: faker.number.int({ min: 0, max: 2 }),
    PropertyType: produceRelations ? producePropertyType() : null,
    ParcelId: faker.number.int(),
    Parcel: produceRelations ? produceParcel() : null,
    BuildingId: faker.number.int(),
    Building: produceRelations ? produceBuilding() : null,
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
  return projectProperty;
};

export const produceProjectStatusHistory = (props?: Partial<ProjectStatusHistory>) => {
  const history: ProjectStatusHistory = {
    Id: faker.number.int(),
    CreatedById: randomUUID(),
    CreatedBy: null,
    CreatedOn: new Date(),
    UpdatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: null,
    StatusId: faker.number.int(),
    Status: null,
    ProjectId: faker.number.int(),
    Project: null,
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
  return history;
};

export const produceProjectTask = (props?: Partial<ProjectTask>) => {
  const task: ProjectTask = {
    ProjectId: faker.number.int(),
    Project: undefined,
    TaskId: faker.number.int(),
    Task: undefined,
    IsCompleted: faker.datatype.boolean(),
    CompletedOn: new Date(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
  return task;
};

export const produceProjectTimestamp = (props?: Partial<ProjectTimestamp>) => {
  const ts: ProjectTimestamp = {
    ProjectId: faker.number.int(),
    Project: undefined,
    TimestampType: undefined,
    TimestampTypeId: faker.number.int(),
    Date: undefined,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
  return ts;
};

export const produceProjectMonetary = (props?: Partial<ProjectMonetary>) => {
  const monetary: ProjectMonetary = {
    ProjectId: faker.number.int(),
    Project: undefined,
    MonetaryType: undefined,
    MonetaryTypeId: faker.number.int(),
    Value: Number(faker.commerce.price()),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };
  return monetary;
};

export const produceProjectNotification = (props?: Partial<ProjectStatusNotification>) => {
  const notif: ProjectStatusNotification = {
    Id: faker.number.int(),
    TemplateId: faker.number.int(),
    Template: undefined,
    FromStatusId: faker.number.int(),
    FromStatus: undefined,
    ToStatusId: faker.number.int(),
    ToStatus: undefined,
    Priority: faker.number.int(),
    Delay: faker.number.int(),
    DelayDays: faker.number.int(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return notif;
};

export const produceNotificationQueue = (
  props?: Partial<NotificationQueue>,
  includeProject: boolean = false,
) => {
  const queue: NotificationQueue = {
    Id: faker.number.int(),
    Key: randomUUID(),
    Status: 1,
    Priority: 'normal',
    Encoding: 'utf-8',
    SendOn: new Date(),
    To: faker.internet.email(),
    Subject: faker.lorem.word(),
    BodyType: 'html',
    Body: faker.lorem.sentences(),
    Bcc: '',
    Cc: '',
    Tag: faker.lorem.word(),
    ProjectId: faker.number.int(),
    Project: includeProject ? produceProject() : undefined,
    ToAgencyId: faker.number.int(),
    ToAgency: undefined,
    TemplateId: faker.number.int(),
    Template: undefined,
    ChesMessageId: null,
    ChesTransactionId: null,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return queue;
};

export const produceNotificationTemplate = (props?: Partial<NotificationTemplate>) => {
  const template: NotificationTemplate = {
    Id: faker.number.int(),
    Name: faker.lorem.word(),
    Description: faker.lorem.lines(),
    To: faker.internet.email(),
    Cc: '',
    Bcc: '',
    Audience: NotificationAudience.Default,
    Encoding: EmailEncoding.Utf8,
    BodyType: EmailBody.Html,
    Priority: EmailPriority.High,
    Subject: faker.lorem.word(),
    Body: faker.lorem.sentences(),
    IsDisabled: false,
    Tag: faker.lorem.word(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return template;
};

export const produceAgencyResponse = (props?: Partial<ProjectAgencyResponse>) => {
  const response: ProjectAgencyResponse = {
    ProjectId: faker.number.int(),
    Project: undefined,
    AgencyId: faker.number.int(),
    Agency: undefined,
    OfferAmount: 123,
    NotificationId: faker.number.int(),
    Notification: undefined,
    Response: 1,
    ReceivedOn: new Date(),
    Note: faker.lorem.lines(),
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    DeletedById: null,
    DeletedOn: null,
    DeletedBy: undefined,
    ...props,
  };

  return response;
};

export const producePropertyForMap = (props?: Partial<MapProperties>) => {
  const propertyTypeId = faker.number.int({ min: 0, max: 1 });
  const property: MapProperties = {
    Id: faker.number.int(),
    PID: faker.number.int({ max: 999999999 }),
    PIN: faker.number.int({ max: 999999999 }),
    PropertyTypeId: propertyTypeId,
    AgencyId: faker.number.int(),
    ClassificationId: faker.number.int(),
    AdministrativeAreaId: faker.number.int(),
    ProjectStatusId: faker.number.int(),
    Address1: faker.location.streetAddress(),
    RegionalDistrictId: faker.number.int(),
    Name: faker.location.streetAddress(),
    Location: {
      x: faker.number.int(),
      y: faker.number.int(),
    },
    ...props,
  };
  return property;
};

export const producePropertyUnion = (props?: Partial<PropertyUnion>) => {
  const propertyTypeId = faker.number.int({ min: 0, max: 1 });
  const union: PropertyUnion = {
    Id: faker.number.int(),
    PID: faker.number.int({ max: 999999999 }),
    PIN: faker.number.int({ max: 999999999 }),
    PropertyType: ['Building', 'Parcel'][propertyTypeId],
    PropertyTypeId: propertyTypeId,
    AgencyId: faker.number.int(),
    Agency: faker.company.name(),
    Address: faker.location.streetAddress(),
    IsSensitive: false,
    UpdatedOn: new Date(),
    ClassificationId: faker.number.int(),
    Classification: faker.company.buzzNoun(),
    AdministrativeAreaId: faker.number.int(),
    AdministrativeArea: faker.location.city(),
    LandArea: faker.number.float({ max: 99999 }),
    ProjectStatusId: faker.number.int(),
    ProjectStatus: faker.company.buzzNoun(),
    ...props,
  };
  return union;
};

export const produceImportResult = (props?: Partial<ImportResult>) => {
  const importResult: ImportResult = {
    Id: faker.number.int(),
    FileName: faker.person.firstName() + '.csv',
    CompletionPercentage: 0,
    Results: [],
    Message: faker.string.sample(),
    DeletedBy: undefined,
    DeletedById: randomUUID(),
    DeletedOn: null,
    CreatedById: randomUUID(),
    CreatedBy: undefined,
    CreatedOn: new Date(),
    UpdatedById: randomUUID(),
    UpdatedBy: undefined,
    UpdatedOn: new Date(),
    ...props,
  };
  return importResult;
};

export const produceLtsaOrder = (): ILtsaOrder => ({
  order: {
    productType: 'title',
    fileReference: 'Test',
    productOrderParameters: {
      titleNumber: 'ABC123',
      landTitleDistrictCode: 'VI',
      includeCancelledInfo: false,
    },
    orderId: faker.string.uuid(),
    status: 'Processing',
    billingInfo: {
      billingModel: 'PROV',
      productName: 'Searches',
      productCode: 'Search',
      feeExempted: true,
      productFee: 0,
      serviceCharge: 0,
      subtotalFee: 0,
      productFeeTax: 0,
      serviceChargeTax: 0,
      totalTax: 0,
      totalFee: 0,
    },
    orderedProduct: {
      fieldedData: {
        titleStatus: 'REGISTERED',
        titleIdentifier: { titleNumber: 'ABC123', landTitleDistrict: 'VICTORIA' },
        tombstone: {
          applicationReceivedDate: '2002-05-01T17:50:00Z',
          enteredDate: '2002-05-29T14:59:26Z',
          titleRemarks: '',
          marketValueAmount: '',
          fromTitles: [{ titleNumber: 'DEF456', landTitleDistrict: 'VICTORIA' }],
          natureOfTransfers: [{ transferReason: 'FEE SIMPLE' }],
        },
        ownershipGroups: [
          {
            jointTenancyIndication: false,
            interestFractionNumerator: '1',
            interestFractionDenominator: '1',
            ownershipRemarks: '',
            titleOwners: [
              {
                lastNameOrCorpName1: 'CORP NAME',
                givenName: '',
                incorporationNumber: '',
                occupationDescription: '',
                address: {
                  addressLine1: 'STREET NAME',
                  addressLine2: '',
                  city: 'VICTORIA',
                  province: 'BC',
                  provinceName: 'BRITISH COLUMBIA',
                  country: 'CANADA',
                  postalCode: 'POSTAL CODE',
                },
              },
            ],
          },
        ],
        taxAuthorities: [{ authorityName: 'MUNICIPALITY NAME' }],
        descriptionsOfLand: [
          {
            parcelIdentifier: '000-000-000',
            fullLegalDescription: 'LEGAL DESC',
            parcelStatus: 'A',
          },
        ],
        legalNotationsOnTitle: [
          {
            legalNotationNumber: 'AB123213',
            status: 'ACTIVE',
            legalNotation: {
              originalLegalNotationNumber: 'AB123213',
              legalNotationText: 'LEGAL TEXT',
            },
          },
          {
            legalNotationNumber: 'AB123214',
            status: 'ACTIVE',
            legalNotation: {
              originalLegalNotationNumber: 'AB123214',
              legalNotationText: 'MORE LEGAL TEXT',
            },
          },
        ],
        chargesOnTitle: [
          {
            chargeNumber: 'EF1232131',
            status: 'REGISTERED',
            enteredDate: '2002-05-29T14:59:26Z',
            interAlia: 'No',
            chargeRemarks: 'LEGAL TEXT\n',
            charge: {
              chargeNumber: 'AB123123',
              transactionType: 'LEASE',
              applicationReceivedDate: '1994-08-30T18:13:00Z',
              chargeOwnershipGroups: [
                {
                  jointTenancyIndication: false,
                  interestFractionNumerator: '1',
                  interestFractionDenominator: '1',
                  ownershipRemarks: '',
                  chargeOwners: [
                    { lastNameOrCorpName1: 'REGIONAL DISTRICT', incorporationNumber: '' },
                  ],
                },
              ],
              certificatesOfCharge: [],
              correctionsAltos1: [],
              corrections: [],
            },
            chargeRelease: {},
          },
        ],
        duplicateCertificatesOfTitle: [],
        titleTransfersOrDispositions: [],
      },
    },
  },
});

export const produceImportRow = (props?: Partial<ImportRow>) => {
  return {
    PropertyType: faker.number.binary() ? 'Building' : 'Land',
    PID: faker.number.int({ min: 1111111, max: 999999999 }),
    Classification: 'Core Operational',
    AgencyCode: 'RPD',
    AdministrativeArea: 'Victoria',
    Latitude: faker.number.float(),
    Longitude: faker.number.float(),
    // Required for Buildings
    ConstructionType: 'Wood',
    PredominateUse: 'School',
    Name: 'Test Property',
    ...props,
  } as ImportRow;
};
