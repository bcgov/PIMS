import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IUser } from 'interfaces';
import {
  IStoreUsersAction,
  IUpdateUserAction,
  IFilterUsersAction,
  IUsersPageSizeAction,
  IUsersSort,
  ISortUsersAction,
} from 'actions/adminActions';

export const MAX_USERS_PER_PAGE: number = 10;

export interface IUsersState {
  pagedUsers: IPagedItems<IUser>;
  rowsPerPage: number;
  filterList: string[][];
  sort: IUsersSort;
}

const initialState: IUsersState = {
  pagedUsers: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  rowsPerPage: MAX_USERS_PER_PAGE,
  filterList: [[], [], [], [], [], [], [], [], [], []],
  sort: { sortBy: 'username', direction: 'asc' },
};

const usersReducer = (
  state = initialState,
  action:
    | IStoreUsersAction
    | IUpdateUserAction
    | IFilterUsersAction
    | IUsersPageSizeAction
    | ISortUsersAction,
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
      return { ...state, filterList: action.filter };
    case actionTypes.SET_USERS_PAGE_SIZE:
      return { ...state, rowsPerPage: action.size };

    case actionTypes.SORT_USERS:
      return { ...state, sort: action.sort };
    default:
      return state;
  }
};

export default usersReducer;
