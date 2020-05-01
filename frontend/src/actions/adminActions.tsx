import * as ActionTypes from 'constants/actionTypes';
import { IPagedItems, IUser, IUserDetails, IAgency, IRole } from 'interfaces';

//Admin API actions
export interface IStoreUsersAction {
  type: typeof ActionTypes.STORE_USERS;
  pagedUsers: IPagedItems<IUser>;
}

export interface IGetUserAction {
  type: typeof ActionTypes.GET_USER;
  pagedUsers: IUser;
}

export interface IUpdateUserAction {
  type: typeof ActionTypes.UPDATE_USER;
  user: IUser;
}

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

export const updateUser = (user: IUser): IUpdateUserAction => ({
  type: ActionTypes.UPDATE_USER,
  user,
});

export interface IAddNewRoleAndAgency {
  agency: IAgency;
  role: IRole;
}
