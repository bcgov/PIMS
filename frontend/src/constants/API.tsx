// Network URL's
import queryString from 'query-string';

// Generic Params
export interface IPaginateParams {
  page: number;
  quantity?: number;
  sort?: string;
}

export interface IPaginateAccessRequests {
  page: number;
  quantity?: number;
  sort?: string;
  isGranted?: boolean | null;
}

// Parcels
export interface IParcelListParams {
  neLatitude: number;
  neLongitude: number;
  swLatitude: number;
  swLongitude: number;
  address: string | null;
  /** comma-separated list of agencies to filter by */
  agencies: string | null;
  classificationId: number | null;
  minLandArea: number | null;
  maxLandArea: number | null;
}
export const PARCELS = (params: IParcelListParams | null) =>
  params ? `/properties?${queryString.stringify(params)}` : '/properties'; // get filtered properties or all if not specified.
export interface IParcelDetailParams {
  id: number;
}

export const PARCEL_DETAIL = (params: IParcelDetailParams) => `/parcels/${params.id}`;
export const ADD_PARCEL = `/parcels`;

export interface IUserDetailParams {
  id: string;
}
export const USER_DETAIL = (params: IUserDetailParams) => `/keycloak/users/${params.id}`;

export interface IBuildingDetailParams {
  id: number;
}
export const BUILDING_DETAIL = (params: IBuildingDetailParams) => `/buildings/${params.id}`;

// Lookup Codes
export const LOOKUP_CODE = () => `/lookup`;
export const LOOKUP_CODE_SET = (codeSetName: string) => `/lookup/${codeSetName}`; // get filtered properties or all if not specified.
export const AGENCY_CODE_SET_NAME = 'Agency';
export const ROLE_CODE_SET_NAME = 'Role';
export const PROVINCE_CODE_SET_NAME = 'Province';
export const CITY_CODE_SET_NAME = 'City';
export const PROPERTY_CLASSIFICATION_CODE_SET_NAME = 'PropertyClassification';
export const CONSTRUCTION_CODE_SET_NAME = 'BuildingConstructionType';
export const PREDOMINATE_USE_CODE_SET_NAME = 'BuildingPredominateUse';
export const OCCUPANT_TYPE_CODE_SET_NAME = 'BuildingOccupantType';

// Auth Service
export const ACTIVATE_USER = () => `/auth/activate`; // get filtered properties or all if not specified.

// User Service
export const REQUEST_ACCESS = () => `/users/access/request`; //request access url.
export const REQUEST_ACCESS_ADMIN = () => `/keycloak/users/access/request`; //request access admin url.
export const REQUEST_ACCESS_LIST = (params: IPaginateAccessRequests) =>
  `/admin/users/access/requests/?${queryString.stringify(params)}`; // get paged access requests
export const POST_USERS = () => `/admin/users/my/agency`; // get paged list of users
