import * as ActionTypes from 'constants/actionTypes';
import { IPagedItems, IAccessRequest } from 'interfaces';

// User API actions

export interface IStoreAccessRequestsAction {
  type: typeof ActionTypes.STORE_ACCESS_REQUESTS;
  pagedAccessRequests: IPagedItems;
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

/**
 * Store the single access request to redux.
 * @param accessRequest - a single access request
 */
export const storeAccessRequest = (accessRequest: IStoreAccessRequestAction) => ({
  type: ActionTypes.STORE_ACCESS_REQUEST,
  accessRequest: accessRequest,
});
