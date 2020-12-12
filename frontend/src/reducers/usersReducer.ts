import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IUser, IUsersFilter } from 'interfaces';
import {
  IStoreUsersAction,
  IUpdateUserAction,
  IFilterUsersAction,
  IUsersPageSizeAction,
  ISortUsersAction,
  IUpdateUsersPageIndexAction,
} from 'actions/adminActions';
import { TableSort } from 'components/Table/TableSort';
import { IUserRecord } from 'features/admin/users/interfaces/IUserRecord';
import { DEFAULT_PAGE_SIZE } from 'components/Table/constants';

export interface IUsersState {
  pagedUsers: IPagedItems<IUser>;
  rowsPerPage: number;
  filter: IUsersFilter;
  sort: TableSort<IUserRecord>;
  pageIndex: number;
}

const initialState: IUsersState = {
  pagedUsers: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  rowsPerPage: DEFAULT_PAGE_SIZE,
  filter: {},
  sort: { username: 'asc' },
  pageIndex: 0,
};

const usersReducer = (
  state = initialState,
  action:
    | IStoreUsersAction
    | IUpdateUserAction
    | IFilterUsersAction
    | IUsersPageSizeAction
    | ISortUsersAction
    | IUpdateUsersPageIndexAction,
) => {
  switch (action.type) {
    case actionTypes.STORE_USERS:
      return {
        ...state,
        pagedUsers: {
          ...action.pagedUsers,
          items: [...action.pagedUsers.items],
        },
      };
    case actionTypes.UPDATE_USER:
      const items = [
        ...state.pagedUsers.items.map((u: IUser) => (u.id === action.user.id ? action.user : u)),
      ];
      return {
        ...state,
        pagedUsers: {
          ...state.pagedUsers,
          items,
        },
      };

    case actionTypes.FILTER_USERS:
      return { ...state, filter: action.filter };
    case actionTypes.SET_USERS_PAGE_SIZE:
      return { ...state, rowsPerPage: action.size };

    case actionTypes.SET_USERS_PAGE_INDEX:
      return { ...state, pageIndex: action.pageIndex };

    case actionTypes.SORT_USERS:
      return { ...state, sort: action.sort };
    default:
      return state;
  }
};

export default usersReducer;
