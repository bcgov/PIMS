import * as ActionTypes from 'constants/actionTypes';

//Admin API actions

export interface IStoreAccessRequestsAction {
  type: typeof ActionTypes.STORE_ACCESS_REQUESTS;
  pagedAccessRequests: IAccessRequest;
}

export interface IStoreUsersAction {
  type: typeof ActionTypes.STORE_USERS;
  pagedUsers: IUser;
}

export const storeAccessRequests = (pagedAccessRequests: IStoreAccessRequestsAction) => ({
  type: ActionTypes.STORE_ACCESS_REQUESTS,
  pagedAccessRequests: pagedAccessRequests,
});

export const storeUsers = (pagedUsers: IStoreUsersAction) => ({
  type: ActionTypes.STORE_USERS,
  pagedUsers: pagedUsers,
});

export interface IAgency {
  id: string;
}
export interface IRole {
  id: string;
}
export interface IAccessRequestParams {
  agencies: IAgency[];
  roles: IRole[];
}

export interface IUser {
  page: number;
  quantity: number;
  total: number;
  items: [];
}
export interface IAccessRequest {
  page: number;
  quantity: number;
  total: number;
  items: [];
}
