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

export interface IGetUserAction {
  type: typeof ActionTypes.GET_USER;
  pagedUsers: IUser;
}

export const storeAccessRequests = (pagedAccessRequests: IStoreAccessRequestsAction) => ({
  type: ActionTypes.STORE_ACCESS_REQUESTS,
  pagedAccessRequests: pagedAccessRequests,
});

export interface IStoreUserDetail {
  type: typeof ActionTypes.STORE_USER_DETAILS;
  userDetail: IUserDetails;
}

export const storeUserDetail = (userDetail: IUserDetails) => ({
  type: ActionTypes.STORE_USER_DETAILS,
  // Payload below
  userDetail: userDetail,
});

export const storeUsers = (pagedUsers: IStoreUsersAction) => ({
  type: ActionTypes.STORE_USERS,
  pagedUsers: pagedUsers,
});

export interface IAddNewRoleAndAgency {
  agency: IAgency;
  role: IRole;
}

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

export interface IUserDetails {
  id?: string;
  username: string;
  firstName?: string;
  displayName?: string;
  lastName?: string;
  email?: string;
  isDisabled?: boolean;
  agencies: any[];
  roles: any[];
  createdOn?: string;
  rowVersion?: string;
  note?: string;
}

export interface IPagedItems {
  page: number;
  quantity: number;
  total: number;
  items: [];
}
