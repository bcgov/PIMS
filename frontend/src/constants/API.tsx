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
  params ? `/parcels?${queryString.stringify(params)}` : '/parcels'; // get filtered properties or all if not specified.
export interface IParcelDetailParams {
  id: number;
}
export const PARCEL_DETAIL = (params: IParcelDetailParams) => `/parcels/${params.id}`;

// Lookup Codes
export const LOOKUP_CODE_SET = (codeSetName: string) => `/lookup/${codeSetName}`; // get filtered properties or all if not specified.
export const AGENCY_CODE_SET_NAME = 'Agency';
export const ROLE_CODE_SET_NAME = 'Role';
export const PROPERTY_CLASSIFICATION_CODE_SET_NAME = 'PropertyClassification';

// Auth Service
export const ACTIVATE_USER = () => `/auth/activate`; // get filtered properties or all if not specified.

// User Service
export const REQUEST_ACCESS = () => `/users/access/request`; //request access url.
export const REQUEST_ACCESS_ADMIN = () => `/keycloak/users/access/requests`; //request access admin url.
export const REQUEST_ACCESS_LIST = (params: IPaginateAccessRequests) =>
  `/admin/users/access/requests/?${queryString.stringify(params)}`; // get paged access requests
export const POST_USERS = () => `/admin/users/my/agency`; // get paged list of users
