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

export interface IFilterData {
  agency?: string;
  role?: string;
  searchText?: string;
}

export interface ISort {
  column: string;
  direction: string;
}

export interface IFilterAccessRequestsAction {
  type: typeof ActionTypes.FILTER_REQUEST_ACCESS_ADMIN;
  filter: IFilterData;
}

export interface ISortAccessRequestsAction {
  type: typeof ActionTypes.UPDATE_REQUEST_ACCESS_SORT;
  sort: ISort;
}

export interface ISelectAccessRequestsAction {
  type: typeof ActionTypes.SELECT_REQUEST_ACCESS_ADMIN;
  selections: string[];
}

export interface IDeleteAccessRequestAction {
  type: typeof ActionTypes.DELETE_REQUEST_ACCESS_ADMIN;
  id: number;
}

export interface IUpdateAccessRequestPageSizeAction {
  type: typeof ActionTypes.UPDATE_REQUEST_ACCESS_PAGE_SIZE;
  pageSize: number;
}

export interface IUpdateAccessRequestPageIndexAction {
  type: typeof ActionTypes.UPDATE_REQUEST_ACCESS_PAGE_INDEX;
  pageIndex: number;
}

/**
 * Store the single access request to redux.
 * @param accessRequest - a single access request
 */
export const storeAccessRequest = (accessRequest: IStoreAccessRequestAction) => ({
  type: ActionTypes.STORE_ACCESS_REQUEST,
  accessRequest: accessRequest,
});

export const getUpdateAccessRequestPageSize = (
  pageSize: number,
): IUpdateAccessRequestPageSizeAction => ({
  type: ActionTypes.UPDATE_REQUEST_ACCESS_PAGE_SIZE,
  pageSize,
});

export const getUpdateAccessRequestPageIndex = (
  pageIndex: number,
): IUpdateAccessRequestPageIndexAction => ({
  type: ActionTypes.UPDATE_REQUEST_ACCESS_PAGE_INDEX,
  pageIndex,
});

export const getUpdateAccessRequestSort = (sort: ISort): ISortAccessRequestsAction => ({
  type: ActionTypes.UPDATE_REQUEST_ACCESS_SORT,
  sort,
});
