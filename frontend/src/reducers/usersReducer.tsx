import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IStoreUsersAction } from 'actions/adminActions';

export interface IUsersState {
  pagedUsers: IPagedItems;
}

const initialState: IUsersState = {
  pagedUsers: { page: 0, total: 0, quantity: 0, items: [] },
};

const usersReducer = (state = initialState, action: IStoreUsersAction) => {
  switch (action.type) {
    case actionTypes.STORE_USERS:
      return {
        ...state,
        pagedUsers: {
          ...action.pagedUsers,
          items: [...action.pagedUsers.items],
        },
      };
    default:
      return state;
  }
};

export default usersReducer;
