import * as ActionTypes from 'constants/actionTypes';
import {
  IPagedItems,
  IUser,
  IUserDetails,
  IAgency,
  IRole,
  IUsersFilter,
  IAgencyRecord,
  IAgencyDetail,
} from 'interfaces';
import { IUserRecord } from 'features/admin/users/interfaces/IUserRecord';
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

// agency admin
export interface IStoreAgencyDetail {
  type: typeof ActionTypes.STORE_AGENCY_DETAILS;
  agencyDetail: IAgency;
}

export interface IStoreAgencyAction {
  type: typeof ActionTypes.STORE_AGENCY_RESULTS;
  pagedAgencies: IPagedItems<IAgency>;
}

export interface IAgencyPaginationAction {
  type: typeof ActionTypes.STORE_AGENCY_RESULTS;
  pagedAgencies: IPagedItems<IAgency>;
}

export interface IGetAgencyAction {
  type: typeof ActionTypes.GET_AGENCY;
  pagedAgency: IAgency;
}

export interface IUpdateAgencyAction {
  type: typeof ActionTypes.UPDATE_AGENCY;
  agency: IAgency;
}

export interface ISortAgenciesAction {
  type: typeof ActionTypes.SORT_AGENCIES;
  sort: TableSort<IAgencyDetail>;
}

export const storeAgencyDetails = (agencyDetail: IAgency) => ({
  type: ActionTypes.STORE_AGENCY_DETAILS,
  agencyDetail: agencyDetail,
});

export const storeAgencies = (apiData: IPagedItems<IAgency>) => ({
  type: ActionTypes.STORE_AGENCY_RESULTS,
  pagedAgencies: { ...apiData, pageIndex: apiData.page - 1 },
});

export const updateAgency = (agency: IAgencyDetail): IUpdateAgencyAction => ({
  type: ActionTypes.UPDATE_AGENCY,
  agency,
});

export const setAgenciesPageSize = (size: number) => ({
  type: ActionTypes.SET_AGENCIES_PAGE_SIZE,
  size,
});

export const getAgenciesSortAction = (sort: TableSort<IAgencyRecord>): ISortAgenciesAction => ({
  type: ActionTypes.SORT_AGENCIES,
  sort,
});

export interface IAddNewRoleAndAgency {
  agency: IAgency;
  role: IRole;
}
