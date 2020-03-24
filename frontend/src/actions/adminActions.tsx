import * as ActionTypes from 'constants/actionTypes';

//Admin API actions

export interface IStoreAccessRequestsAction {
  type: typeof ActionTypes.STORE_ACCESS_REQUESTS;
  pagedAccessRequests: IPagedItems;
}

export interface IStoreUsersAction {
  type: typeof ActionTypes.STORE_USERS;
  pagedUsers: IPagedItems;
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
  id?: string;
}
export interface IRole {
  id?: string;
}
export interface IAccessRequest {
  agencies: IAgency[];
  roles: IRole[];
  id: string;
  user: IUser;
  isGranted?: boolean;
}

export interface IUser {
  id: string;
  displayName?: string;
}

export interface IPagedItems {
  page: number;
  quantity: number;
  total: number;
  items: [];
}
