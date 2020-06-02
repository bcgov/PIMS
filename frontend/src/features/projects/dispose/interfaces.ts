import { IBuilding, IAddress, IEvaluation, IFiscal } from 'actions/parcelsActions';

/**
 * IProperty interface represents the model used for searching properties.
 */
export interface IProperty {
  id: number;
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
  classificationId?: number;
  statusId?: number;
  agencies?: number | number[];
  minLandArea?: number;
  maxLandArea?: number;
  minLotArea?: number;
  maxLotArea?: number;
  all?: boolean;
}
export interface IProjectTask {
  projectNumber: number;
  taskId: number;
  taskType: string;
  isCompleted: boolean;
  name: string;
  description: string;
  isOptional: boolean;
  sortOrder: number;
  completedOn: Date;
}
export interface IProject {
  projectNumber: string;
  name: string;
  description: string;
  properties: IProperty[];
  note: string;
  agencyId: number;
  statusId: number;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
  confirmation?: boolean;
}

export enum DisposeWorkflowStatus {
  Draft = 0,
  SelectProperties,
  UpdateInformation,
  RequiredDocumentation,
  Approval,
  Submitted,
}

export interface ProjectWorkflowComponent {
  component: React.ComponentType<any>;
  workflowStatus: DisposeWorkflowStatus;
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

export const initialValues: IProject = {
  projectNumber: '',
  name: '',
  note: '',
  description: '',
  properties: [],
  tierLevelId: 1,
  statusId: 0,
  agencyId: 0,
  tasks: [],
};

export interface IApiProject {
  projectNumber: string;
  name: string;
  description: string;
  projectProperties: IProjectProperty[];
  note: string;
  agencyId: number;
  statusId: number;
  tierLevelId: number;
  tasks: IProjectTask[];
  rowVersion?: string;
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
