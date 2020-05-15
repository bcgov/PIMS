import * as ActionTypes from 'constants/actionTypes';
import { IPagedItems, IUser, IUserDetails, IAgency, IRole, IUsersFilter } from 'interfaces';
import { IUserRecord } from 'pages/admin/users/interfaces/IUserRecord';
import { TableSort } from 'components/Table/TableSort';

//Admin API actions
export interface IStoreUsersAction {
  type: typeof ActionTypes.STORE_USERS;
  pagedUsers: IPagedItems<IUser>;
}

export interface IUsersPaginationAction {
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

export interface ISortUsersAction {
  type: typeof ActionTypes.SORT_USERS;
  sort: TableSort<IUserRecord>;
}

export interface IFilterUsersAction {
  type: typeof ActionTypes.FILTER_USERS;
  filter: IUsersFilter;
}

export interface IUsersPageSizeAction {
  type: typeof ActionTypes.SET_USERS_PAGE_SIZE;
  size: number;
}

export interface IUpdateUsersPageIndexAction {
  type: typeof ActionTypes.SET_USERS_PAGE_INDEX;
  pageIndex: number;
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

export const storeUsers = (apiData: IPagedItems<IUser>) => ({
  type: ActionTypes.STORE_USERS,
  pagedUsers: { ...apiData, pageIndex: apiData.page - 1 },
});

export const updateUser = (user: IUser): IUpdateUserAction => ({
  type: ActionTypes.UPDATE_USER,
  user,
});

export const getUsersFilterAction = (filter: IUsersFilter): IFilterUsersAction => ({
  type: ActionTypes.FILTER_USERS,
  filter,
});

export const setUsersPageSize = (size: number) => ({
  type: ActionTypes.SET_USERS_PAGE_SIZE,
  size,
});

export const getUsersPageIndexAction = (pageIndex: number): IUpdateUsersPageIndexAction => ({
  type: ActionTypes.SET_USERS_PAGE_INDEX,
  pageIndex,
});

export const getUsersSortAction = (sort: TableSort<IUserRecord>): ISortUsersAction => ({
  type: ActionTypes.SORT_USERS,
  sort,
});

export interface IAddNewRoleAndAgency {
  agency: IAgency;
  role: IRole;
}
