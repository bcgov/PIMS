import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IStoreAccessRequestsAction } from 'actions/adminActions';
import { IPaginate } from 'utils/CommonFunctions';

export interface IAccessRequestState {
  pagedAccessRequests: IPagedItems;
}

const initialState: IAccessRequestState = {
  pagedAccessRequests: { page: 0, total: 0, quantity: 0, items: [] },
};

const accessRequestReducer = (state = initialState, action: IStoreAccessRequestsAction) => {
  switch (action.type) {
    case actionTypes.STORE_ACCESS_REQUESTS:
      return {
        ...state,
        pagedAccessRequests: {
          ...action.pagedAccessRequests,
          items: [...action.pagedAccessRequests.items],
        },
      };
    default:
      return state;
  }
};

export default accessRequestReducer;
