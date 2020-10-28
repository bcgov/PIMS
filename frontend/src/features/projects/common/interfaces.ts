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
  administrativeArea: string;
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
  assessedFirm?: string;
  assessedRowVersion?: string;
  appraised: number;
  appraisedDate?: Date | string;
  appraisedFirm?: string;
  appraisedRowVersion?: string;

  // Parcel Properties
  landArea: number;
  landLegalDescription: string;
  zoning?: string;
  zoningPotential?: string;

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
  pid?: string;
  address?: string;
  administrativeArea?: string;
  projectNumber?: string;
  ignorePropertiesInProjects?: boolean;
  inSurplusPropertyProgram?: boolean;
  classificationId?: number;
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
  id?: number;
  projectNumber: string;
  name: string;
  description: string;
  fiscalYear: number;
  properties: IProperty[];
  projectAgencyResponses: IProjectAgencyResponse[];
  note: string;
  notes: IProjectNote[];
  publicNote: string;
  privateNote: string;
  agencyResponseNote?: string;
  offersNote?: string;
  agencyId: number;
  agency?: string;
  subAgency?: string;
  statusId: number;
  status?: IStatus;
  exemptionRationale?: string;
  exemptionRequested?: boolean;
  statusCode?: string;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
  confirmation?: boolean;
  approvedOn?: Date | string;
  deniedOn?: Date | string;
  cancelledOn?: Date | string;
  submittedOn?: Date | string;
  initialNotificationSentOn?: Date | string;
  thirtyDayNotificationSentOn?: Date | string;
  sixtyDayNoficationSentOn?: Date | string;
  ninetyDayNotificationSentOn?: Date | string;
  onHoldNotificationSentOn?: Date | string;
  transferredWithinGreOn?: Date | string;
  clearanceNotificationSentOn?: Date | string;
  marketedOn?: Date | string;
  disposedOn?: Date | string;
  assessedOn?: Date | string;
  adjustedOn?: Date | string;
  offerAcceptedOn?: Date | string;
  preliminaryFormSignedOn?: Date | string;
  finalFormSignedOn?: Date | string;
  netBook?: number | '';
  closeOutNetbook?: number | '';
  assessed?: number | '';
  appraised?: number | '';
  estimated?: number | '';
  workflowCode?: string;
  isContractConditional?: boolean;
  purchaser?: string;
  manager?: string;
  actualFiscalYear?: string;
  plannedFutureUse?: string;
  remediation?: string;
  preliminaryFormSignedBy?: string;
  finalFormSignedBy?: string;
  offerAmount?: number | '';
  interestComponent?: number | '';
  ocgFinancialStatement?: number | '';
  salesCost?: number | '';
  salesProceeds?: number | '';
  gainBeforeSpp?: number | '';
  gainAfterSpp?: number | '';
  programCost?: number | '';
  priorYearAdjustmentAmount?: number | '';
}

export enum NoteTypes {
  General = 0,
  Public = 1,
  Private = 2,
  Exemption = 3,
  AgencyInterest = 4,
  Financial = 5,
  PreMarketing = 6,
  Marketing = 7,
  ContractInPlace = 8,
  Reporting = 9,
  LoanTerms = 10,
  Adjustment = 11,
  SppCost = 12,
  SppGain = 13,
  SalesHistory = 14,
  CloseOut = 15,
  Comments = 16,
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
  OnHold = 'ERP-OH',
  ERP = 'ERP-ON',
  TransferredGRE = 'T-GRE',
  ApprovedForSpl = 'AP-SPL',
  PreMarketing = 'SPL-PM',
  OnMarket = 'SPL-M',
  ContractInPlace = 'SPL-CIP',
  NotInSpl = 'AP-!SPL',
  ApprovedForExemption = 'AP-EXE',
  Denied = 'DE',
  Disposed = 'DIS',
  Cancelled = 'CA',
  InErp = 'ERP-ON',
}

export enum SPPApprovalTabs {
  projectInformation = 'projectInformation',
  documentation = 'documentation',
  erp = 'enhancedReferralProcess',
  spl = 'surplusPropertyList',
  closeOutForm = 'closeOutForm',
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
  isActive: boolean;
}

export interface IStepProps {
  isReadOnly?: boolean;
  formikRef?: any;
}

export interface IProjectProperty {
  id?: number;
  projectNumber?: string;
  propertyType: string;
  parcelId?: number;
  parcel?: IApiProperty;
  buildingId?: number;
  building?: IApiProperty;
}

export const initialValues: IProject = {
  projectNumber: '',
  name: '',
  note: '',
  notes: [],
  description: '',
  properties: [],
  tierLevelId: 1,
  statusId: 1,
  agencyId: 0,
  tasks: [],
  projectAgencyResponses: [],
  publicNote: '',
  privateNote: '',
  statusCode: 'DR',
  fiscalYear: getCurrentFiscalYear(),
  confirmation: false,
  approvedOn: '',
  deniedOn: '',
  cancelledOn: '',
  submittedOn: '',
  initialNotificationSentOn: '',
  thirtyDayNotificationSentOn: '',
  sixtyDayNoficationSentOn: '',
  ninetyDayNotificationSentOn: '',
  onHoldNotificationSentOn: '',
  transferredWithinGreOn: '',
  clearanceNotificationSentOn: '',
  marketedOn: '',
  disposedOn: '',
  offerAcceptedOn: '',
  assessedOn: '',
  adjustedOn: '',
  preliminaryFormSignedOn: '',
  finalFormSignedOn: '',
  netBook: '',
  assessed: '',
  appraised: '',
  estimated: '',
  workflowCode: '',
  offerAmount: '',
  isContractConditional: false,
  purchaser: '',
  manager: '',
  actualFiscalYear: '',
  plannedFutureUse: '',
  remediation: '',
  preliminaryFormSignedBy: '',
  finalFormSignedBy: '',
  interestComponent: '',
  ocgFinancialStatement: '',
  salesCost: '',
  salesProceeds: '',
  gainBeforeSpp: '',
  gainAfterSpp: '',
  programCost: '',
  priorYearAdjustmentAmount: '',
};

export interface IApiProject {
  id?: number;
  projectNumber: string;
  fiscalYear: number;
  name: string;
  description: string;
  properties: IProjectProperty[];
  projectAgencyResponses: IProjectAgencyResponse[];
  note: string;
  netBook: number | '';
  estimated: number | '';
  assessed: number | '';
  appraised?: number | '';
  publicNote: string;
  privateNote: string;
  exemptionRequested?: boolean;
  agencyResponseNote?: string;
  exemptionRationale?: string;
  agencyId: number;
  statusId: number;
  statusCode?: string;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
  approvedOn?: Date | string;
  deniedOn?: Date | string;
  cancelledOn?: Date | string;
  submittedOn?: Date | string;
  InitialNotificationSentOn?: Date | string;
  ThirtyDayNotificationSentOn?: Date | string;
  SixtyDayNoficationSentOn?: Date | string;
  NinetyDayNotificationSentOn?: Date | string;
  OnHoldNotificationSentOn?: Date | string;
  TransferredWithinGreOn?: Date | string;
  ClearanceNotificationSentOn?: Date | string;
  disposedOn?: Date | string;
  notes: IProjectNote[];
}

export interface IProjectNote {
  id?: number;
  noteType: string | NoteTypes;
  note?: string;
  rowVersion?: string;
  projectId?: number;
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
  classification?: string;
  classificationId: number;
  description: string;
  address?: IAddress;
  landArea: number;
  landLegalDescription: string;
  zoning: string;
  zoningPotential: string;
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
  receivedOn?: string;
  note?: string;
  rowVersion?: string;
  offerAmount?: number;
}
