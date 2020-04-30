import * as ActionTypes from 'constants/actionTypes';
import { IPagedItems, IAccessRequest } from 'interfaces';

// User API actions

export interface IStoreAccessRequestsAction {
  type: typeof ActionTypes.STORE_ACCESS_REQUESTS;
  pagedAccessRequests: IPagedItems<IAccessRequest>;
}

/**
 * Store the paged access requests to redux.
 * @param pagedAccessRequests - An page of access requests
 */
export const storeAccessRequests = (pagedAccessRequests: IStoreAccessRequestsAction) => ({
  type: ActionTypes.STORE_ACCESS_REQUESTS,
  pagedAccessRequests: pagedAccessRequests,
});

export interface IStoreAccessRequestAction {
  type: typeof ActionTypes.STORE_ACCESS_REQUEST;
  accessRequest: IAccessRequest;
}

export interface IUpdateAccessRequestAction {
  type: typeof ActionTypes.UPDATE_REQUEST_ACCESS_STATUS_ADMIN;
  accessRequest: IAccessRequest;
}

export interface IFilterAccessRequestsAction {
  type: typeof ActionTypes.FILTER_REQUEST_ACCESS_ADMIN;
  filters: any;
}

export interface ISortAccessRequestsAction {
  type: typeof ActionTypes.SORT_REQUEST_ACCESS_ADMIN;
  sorting: any[];
}

export interface ISelectAccessRequestsAction {
  type: typeof ActionTypes.SELECT_REQUEST_ACCESS_ADMIN;
  selections: string[];
}

export interface IDeleteAccessRequestAction {
  type: typeof ActionTypes.DELETE_REQUEST_ACCESS_ADMIN;
  id: number;
}

/**
 * Store the single access request to redux.
 * @param accessRequest - a single access request
 */
export const storeAccessRequest = (accessRequest: IStoreAccessRequestAction) => ({
  type: ActionTypes.STORE_ACCESS_REQUEST,
  accessRequest: accessRequest,
});
