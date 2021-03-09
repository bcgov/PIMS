// Network URL's
import queryString from 'query-string';
import { AccessRequestStatus } from './accessStatus';

// Generic Params
export interface IPaginateParams {
  page: number;
  quantity?: number;
  sort?: string | string[];
}

export interface IGetUsersParams extends IPaginateParams {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  agency?: string;
  role?: string;
  isDisabled?: boolean;
  position?: string;
}

export interface IGetAgenciesParams extends IPaginateParams {
  name?: string;
  description?: string;
  isDisabled?: boolean;
}

export interface IPaginateAccessRequests extends IPaginateParams {
  status?: AccessRequestStatus | null;
}

// Parcels
export interface IPropertySearchParams {
  pid?: string;
  neLatitude: number;
  neLongitude: number;
  swLatitude: number;
  swLongitude: number;
  address?: string;
  administrativeArea?: string;
  projectNumber?: string;
  /** comma-separated list of agencies to filter by */
  agencies?: string;
  classificationId?: number;
  minLandArea?: number;
  maxLandArea?: number;
  inSurplusPropertyProgram?: boolean;
  inEnhancedReferralProcess?: boolean;
}
export const PROPERTIES = (params: IPropertySearchParams | null) =>
  `/properties/search?${params ? queryString.stringify(params) : ''}`; // get filtered properties or all if not specified.

export interface IGeoSearchParams {
  bbox?: string;
  address?: string;
  administrativeArea?: string;
  pid?: string;
  projectNumber?: string;
  agencies?: string; // TODO: Switch to number[]
  classificationId?: number;
  minLandArea?: number;
  maxLandArea?: number;
  inSurplusPropertyProgram?: boolean;
  inEnhancedReferralProcess?: boolean;
  name?: string;
  bareLandOnly?: boolean;
  constructionTypeId?: number;
  predominateUseId?: number;
  floorCount?: number;
  rentableArea?: number;
  propertyType?: string;
  includeAllProperties?: boolean;
}
export const PARCELS_DETAIL = (params: IPropertySearchParams | null) => {
  return `/properties/parcels?${params ? queryString.stringify(params) : ''}`; // get filtered properties or all if not specified.
};
export interface IParcelDetailParams {
  id: number;
}

export const PARCEL_DETAIL = (params: IParcelDetailParams) => `/properties/parcels/${params.id}`;
export const PARCEL_ROOT = `/properties/parcels`;

export const BUILDING_ROOT = `/properties/buildings`;

export interface IUserDetailParams {
  id: string;
}

export interface IAgencyDetailParams {
  id: string;
}

export const AGENCY_ROOT = () => `/admin/agencies/`;
export const AGENCY_DETAIL = (params: IAgencyDetailParams) => `/admin/agencies/${params.id}`;
export const USER_DETAIL = (params: IUserDetailParams) => `/admin/users/${params.id}`;
export const KEYCLOAK_USER_UPDATE = (params: IUserDetailParams) => `/keycloak/users/${params.id}`;

export interface IBuildingDetailParams {
  id: number;
}
export const BUILDING_DETAIL = (params: IBuildingDetailParams) =>
  `/properties/buildings/${params.id}`;

// Lookup Codes
export const LOOKUP_CODE = () => `/lookup`;
export const LOOKUP_CODE_SET = (codeSetName: string) => `/lookup/${codeSetName}`; // get filtered properties or all if not specified.
export const AGENCY_CODE_SET_NAME = 'Agency';
export const ROLE_CODE_SET_NAME = 'Role';
export const PROVINCE_CODE_SET_NAME = 'Province';
export const AMINISTRATIVE_AREA_CODE_SET_NAME = 'AdministrativeArea';
export const PROPERTY_CLASSIFICATION_CODE_SET_NAME = 'PropertyClassification';
export const CONSTRUCTION_CODE_SET_NAME = 'BuildingConstructionType';
export const PREDOMINATE_USE_CODE_SET_NAME = 'BuildingPredominateUse';
export const OCCUPANT_TYPE_CODE_SET_NAME = 'BuildingOccupantType';

// Agencies
export const POST_AGENCIES = () => `/admin/agencies/filter`; // get paged list of agencies

// Auth Service
export const ACTIVATE_USER = () => `/auth/activate`; // get filtered properties or all if not specified.

// User Service
export const REQUEST_ACCESS = (id?: number) => `/users/access/requests${id ? '/' + id : ''}`; //request access url.
export const REQUEST_ACCESS_ADMIN = () => `/keycloak/users/access/request`; //request access admin url.
export const REQUEST_ACCESS_LIST = (params: IPaginateAccessRequests) =>
  `/admin/access/requests?${queryString.stringify(params)}`; // get paged access requests
export const REQUEST_ACCESS_DELETE = (id: number) => `/admin/access/requests/${id}`; // delete an access request
export const POST_USERS = () => `/admin/users/my/agency`; // get paged list of users

// Projects
export const PROJECT_DISPOSE_ROOT = '/projects/disposal/';
export const PROJECT_DISPOSE_WORKFLOW = (code: string) => `/projects/workflows/${code}/status`;
export const PROJECT_DISPOSE_TASKS = (code: string | number) => `/projects/status/${code}/tasks`;
export const PROJECT_STATUSES = '/projects/status';
export const PROJECT_WORKFLOW_TASKS = (code: string) => `/projects/workflows/${code}/tasks`;
export const PROJECT_UPDATE_WORKFLOW_STATUS = (workflowCode: string, statusCode: string) =>
  `${PROJECT_DISPOSE_ROOT}workflows/${workflowCode}/${statusCode}`;
