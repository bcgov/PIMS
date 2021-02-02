// network
export const REQUEST = 'REQUEST';
export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR';
export const CLEAR = 'CLEAR';
export const NETWORK_ACTIONS = [REQUEST, SUCCESS, ERROR, CLEAR];

// Properties
export const STORE_PARCEL_RESULTS = 'STORE_PARCEL_RESULTS';
export const STORE_PROPERTY_NAMES = 'STORE_PROPERTY_NAMES';
export const STORE_DRAFT_PARCEL_RESULTS = 'STORE_DRAFT_PARCEL_RESULTS';
export const STORE_PARCEL_FROM_MAP_EVENT = 'STORE_PARCEL_FROM_MAP_CLICK';
export const STORE_PARCEL_DETAIL = 'STORE_PARCEL_DETAIL';
export const STORE_BUILDING_DETAIL = 'STORE_BUILDING_DETAIL';
export const STORE_ASSOCIATED_BUILDING_DETAIL = 'STORE_ASSOCIATED_BUILDING_DETAIL';
export const STORE_PARCEL_SEARCH_PARAMS = 'STORE_PARCEL_SEARCH_PARAMS';
export const GET_PARCELS = 'parcels';
export const GET_PARCEL_DETAIL = 'GET_PARCEL_DETAIL';
export const ADD_PARCEL = 'ADD_PARCEL';
export const ADD_BUILDING = 'ADD_BUILDING';
export const GET_BUILDING_DETAIL = 'GET_BUILDING_DETAIL';
export const UPDATE_PARCEL = 'UPDATE_PARCEL';
export const UPDATE_BUILDING = 'UPDATE_BUILDING';
export const DELETE_PARCEL = 'DELETE_PARCEL';
export const DELETE_BUILDING = 'DELETE_BUILDING';

// Lookup codes
export const STORE_LOOKUP_CODE_RESULTS = 'STORE_LOOKUP_CODE_RESULTS';
export const GET_LOOKUP_CODES = 'lookupCodes';

// Agencies
export const STORE_AGENCY_RESULTS = 'STORE_AGENCY_RESULTS';
export const STORE_AGENCY_DETAILS = 'STORE_AGENCY_DETAILS';
export const GET_AGENCIES = 'agencies';
export const GET_AGENCY = 'GET_AGENCY';
export const UPDATE_AGENCY = 'UPDATE_USER';
export const SORT_AGENCIES = 'SORT_AGENCIES';
export const FILTER_AGENCIES = 'FILTER_AGENCIES';
export const SET_AGENCIES_PAGE_SIZE = 'SET_AGENCIES_PAGE_SIZE';
export const SET_AGENCIES_PAGE_INDEX = 'SET_AGENCIES_PAGE_INDEX';
export const GET_AGENCY_DETAILS = 'GET_AGENCY_DETAILS';
export const PUT_AGENCY_DETAILS = 'PUT_AGENCY_DETAILS';
export const ADD_AGENCY = 'ADD_AGENCY';
export const DELETE_AGENCY = 'DELETE_AGENCY';

// access requests
export const STORE_ACCESS_REQUESTS = 'STORE_ACCESS_REQUESTS';
export const ADD_REQUEST_ACCESS = 'addRequestAccess';
export const GET_REQUEST_ACCESS = 'getRequestAccess';
export const UPDATE_REQUEST_ACCESS_ADMIN = 'updateRequestAccessAdmin';
export const UPDATE_REQUEST_ACCESS_STATUS_ADMIN = 'updateRequestAccessStatusAdmin';
export const UPDATE_REQUEST_ACCESS_PAGE_SIZE = 'updateRequestAccessPageSize';
export const UPDATE_REQUEST_ACCESS_PAGE_INDEX = 'updateRequestAccessPageIndex';
export const UPDATE_REQUEST_ACCESS_SORT = 'updateRequestAccessSort';
export const FILTER_REQUEST_ACCESS_ADMIN = 'filterRequestAccessAdmin';
export const SELECT_REQUEST_ACCESS_ADMIN = 'selectRequestAccessAdmin';
export const DELETE_REQUEST_ACCESS_ADMIN = 'deleteRequestAccessAdmin';
export const SORT_REQUEST_ACCESS_ADMIN = 'sortRequestAccessAdmin';
export const STORE_ACCESS_REQUEST = 'STORE_ACCESS_REQUEST';
export const GET_ACCESS_REQUEST = 'getAccessRequest';

// users
export const STORE_USERS = 'STORE_USERS';
export const ADD_ACTIVATE_USER = 'activateUser';
export const GET_USERS = 'getUsers';
export const STORE_USER_DETAILS = 'STORE_USER_DETAILS';
export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const FILTER_USERS = 'FILTER_USERS';
export const SORT_USERS = 'SORT_USERS';
export const SET_USERS_PAGE_SIZE = 'SET_USERS_PAGE_SIZE';
export const SET_USERS_PAGE_INDEX = 'SET_USERS_PAGE_INDEX';
export const SET_USERS_SORT = 'SET_USERS_SORT';

//projects
export enum ProjectActions {
  GET_PROJECT_WORKFLOW = 'GET_PROJECT_WORKFLOW',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  UPDATE_WORKFLOW_STATUS = 'UPDATE_WORKFLOW_STATUS',
  ADD_PROJECT = 'ADD_PROJECT',
  GET_PROJECT = 'GET_PROJECT',
  GET_PROJECT_TASKS = 'GET_PROJECT_TASKS',
  GET_PROJECT_STATUSES = 'GET_PROJECT_STATUSES',
}
