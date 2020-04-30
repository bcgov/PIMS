import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IUser } from 'interfaces';
import { IStoreUsersAction, IUpdateUserAction } from 'actions/adminActions';

export interface IUsersState {
  pagedUsers: IPagedItems<IUser>;
}

const initialState: IUsersState = {
  pagedUsers: { page: 0, total: 0, quantity: 0, items: [] },
};

const usersReducer = (state = initialState, action: IStoreUsersAction | IUpdateUserAction) => {
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
    default:
      return state;
  }
};

export default usersReducer;
