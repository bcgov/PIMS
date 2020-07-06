import { getCurrentFiscalYear } from '../../../utils/utils';
import { IBuilding, IAddress, IEvaluation, IFiscal } from 'actions/parcelsActions';

/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
  projectPropertyId?: number;
  propertyTypeId: number;
  propertyType: string;
  pid: string;
  pin?: number;
  statusId: number;
  status?: string;
  classificationId: number;
  classification: string;
  description: string;
  projectNumber?: string;
  latitude: number;
  longitude: number;
  isSensitive: boolean;
  agencyId: number;
  agency: string;
  agencyCode: string;
  subAgency?: string;
  subAgencyCode?: string;

  addressId: number;
  address: string;
  cityId: number;
  city: string;
  province: string;
  postal: string;

  // Financial Values
  estimated: number;
  estimatedFiscalYear?: number;
  estimatedRowVersion?: string;
  netBook: number;
  netBookFiscalYear?: number;
  netBookRowVersion?: string;

  assessed: number;
  assessedDate?: Date | string;
  assessedRowVersion?: string;
  appraised: number;
  appraisedDate?: Date | string;
  appraisedRowVersion?: string;

  // Parcel Properties
  landArea: number;
  landLegalDescription: string;
  municipality: string;
  zoning: string;
  zoningPotential: string;

  // Building Properties
  parcelId?: number;
  localId?: string;
  constructionTypeId?: number;
  constructionType?: string;
  predominateUseId?: number;
  predominateUse?: string;
  occupantTypeId?: number;
  occupantType?: string;
  floorCount?: number;
  tenancy?: string;
  occupantName?: string;
  leaseExpiry?: Date | string;
  transferLeaseOnSale?: boolean;
  rentableArea?: number;
  rowVersion?: string;
}

/**
 * IPropertyFilter interface, provides a model for querying the API for properties.
 */
export interface IPropertyFilter {
  page: number;
  quantity: number;
  address?: string;
  municipality?: string;
  projectNumber?: string;
  ignorePropertiesInProjects?: boolean;
  projectPropertiesOnly?: boolean;
  classificationId?: number;
  statusId?: number;
  agencies?: number | number[];
  minLandArea?: number;
  maxLandArea?: number;
  minLotArea?: number;
  maxLotArea?: number;
  all?: boolean;
}

export interface ITask {
  taskId: number;
  name: string;
  description: string;
  sortOrder: number;
  taskType: number;
}
export interface IProjectTask extends ITask {
  projectNumber: number;
  taskId: number;
  taskType: number;
  isCompleted: boolean;
  name: string;
  description: string;
  isOptional: boolean;
  sortOrder: number;
  completedOn: Date;
  statusId: number;
  statusCode: string;
}
export interface IProject {
  id: number;
  projectNumber: string;
  name: string;
  description: string;
  fiscalYear: number;
  properties: IProperty[];
  projectAgencyResponses: IProjectAgencyResponse[];
  note: string;
  publicNote: string;
  privateNote: string;
  agencyResponseNote?: string;
  agencyId: number;
  statusId: number;
  status?: IStatus;
  exemptionRationale?: string;
  exemptionRequested?: boolean;
  statusCode: string;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
  confirmation?: boolean;
  approvedOn?: Date;
  deniedOn?: Date;
  cancelledOn?: Date;
  submittedOn?: Date;
  initialNotificationSentOn?: Date;
  thirtyDayNotificationSentOn?: Date;
  sixtyDayNoficationSentOn?: Date;
  ninetyDayNotificationSentOn?: Date;
  onHoldNotificationSentOn?: Date;
  transferredWithinGreOn?: Date;
  clearanceNotificationSentOn?: Date;
  netBook?: number;
  assessed?: number;
  estimated?: number;
  workflowCode?: string;
}

export enum DisposeWorkflowStatus {
  Draft = 'DR',
  SelectProperties = 'DR-P',
  UpdateInformation = 'DR-I',
  RequiredDocumentation = 'DR-D',
  Approval = 'DR-A',
  Review = 'DR-RE',
}

export enum ReviewWorkflowStatus {
  PropertyReview = 'AS-I',
  DocumentReview = 'AS-D',
  AppraisalReview = 'AS-AP',
  FirstNationConsultation = 'AS-FNC',
  ExemptionReview = 'AS-EXE',
  ExemptionProcess = 'AS-EXP',
  ApprovedForErp = 'AP-ERP',
  ApprovedForSpl = 'AP-SPL',
  NotInSpl = 'AP-!SPL',
  ApprovedForExemption = 'AP-EXE',
  Denied = 'DE',
  Cancelled = 'CA',
  OnHold = 'ERP-OH',
  TransferredGRE = 'T-GRE',
}

export enum SPPApprovalTabs {
  projectInformation = 'Project Information',
  documentation = 'Documentation',
  erp = 'Enhanced Referral Process',
  spl = 'Surplus Properties List',
}

export interface ProjectWorkflowComponent {
  component: React.ComponentType<any>;
  workflowStatus: DisposeWorkflowStatus;
}

export interface IStatus {
  id: number;
  name: string;
  sortOrder: number;
  description: string;
  route: string;
  workflowCode: string;
  code: string;
  isMilestone: boolean;
  tasks: IProjectTask[];
  isOptional: boolean;
  toStatus?: IStatus[];
}

export interface IStepProps {
  isReadOnly?: boolean;
  formikRef?: any;
}

export interface IProjectProperty {
  id?: number;
  projectNumber: string;
  propertyType: string;
  parcelId?: number;
  parcel?: IApiProperty;
  buildingId?: number;
  building?: IApiProperty;
}

export const initialValues: any = {
  name: '',
  note: '',
  description: '',
  properties: [],
  tierLevelId: 1,
  statusId: 1,
  agencyId: 0,
  tasks: [],
  fiscalYear: getCurrentFiscalYear(),
};

export interface IApiProject {
  id: number;
  projectNumber: string;
  fiscalYear: number;
  name: string;
  description: string;
  properties: IProjectProperty[];
  projectAgencyResponses: IProjectAgencyResponse[];
  note: string;
  publicNote: string;
  privateNote: string;
  exemptionRequested?: boolean;
  agencyResponseNote?: string;
  exemptionRationale?: string;
  agencyId: number;
  statusId: number;
  statusCode: string;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
  approvedOn?: Date;
  deniedOn?: Date;
  cancelledOn?: Date;
  submittedOn?: Date;
  InitialNotificationSentOn?: Date;
  ThirtyDayNotificationSentOn?: Date;
  SixtyDayNoficationSentOn?: Date;
  NinetyDayNotificationSentOn?: Date;
  OnHoldNotificationSentOn?: Date;
  TransferredWithinGreOn?: Date;
  ClearanceNotificationSentOn?: Date;
}

export interface IApiProperty {
  id: number;
  parcelId?: number;
  buildingId?: number;
  pid?: string;
  pin?: number | '';
  projectNumber: string;
  latitude: number;
  longitude: number;
  statusId: number;
  propertyStatus?: string;
  classification?: string;
  classificationId: number;
  description: string;
  address?: IAddress;
  landArea: number;
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
  municipality: string;
  agency?: string;
  subAgency?: string;
  agencyId: number;
  isSensitive: boolean;
  buildings: IBuilding[];
  evaluations: IEvaluation[];
  fiscals: IFiscal[];
  rowVersion?: string;
}

export enum AgencyResponses {
  Ignore = 'Ignore',
  Watch = 'Watch',
}

export interface IProjectAgencyResponse {
  response: AgencyResponses;
  notificationId?: number;
  agencyId: number;
  agencyCode?: string;
  projectId: number;
}
