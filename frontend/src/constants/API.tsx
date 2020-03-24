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
  neLat: number;
  neLong: number;
  swLat: number;
  swLong: number;
  agencyId: number | null;
  propertyClassificationId: number | null;
}
export const PARCELS = (params: IParcelListParams | null) =>
  params ? `/my/parcel?${queryString.stringify(params)}` : '/my/parcel'; // get filtered properties or all if not specified.
export interface IParcelDetailParams {
  id: number;
}
export const PARCEL_DETAIL = (params: IParcelDetailParams) => `/my/parcel/${params.id}`;

// Lookup Codes
export const LOOKUP_CODE_SET = (codeSetName: string) => `/lookup/${codeSetName}`; // get filtered properties or all if not specified.
export const AGENCY_CODE_SET_NAME = 'Agency';
export const ROLE_CODE_SET_NAME = 'Role';
export const PROPERTY_CLASSIFICATION_CODE_SET_NAME = 'PropertyClassification';

// Auth Service
export const ACTIVATE_USER = () => `/auth/activate`; // get filtered properties or all if not specified.

// User Service
export const REQUEST_ACCESS = () => `/access/request`; //request access url.
export const REQUEST_ACCESS_ADMIN = () => `/admin/access/request`; //request access admin url.
export const REQUEST_ACCESS_LIST = (params: IPaginateAccessRequests) =>
  `/admin/access/requests/?${queryString.stringify(params)}`; // get paged access requests
export const POST_USERS = () => `/admin/my/users`; // get paged list of users
