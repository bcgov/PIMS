import * as actionTypes from 'constants/actionTypes';
import { IAccessRequest, IStoreAccessRequestsAction } from 'actions/adminActions';

export interface IAccessRequestState {
  pagedAccessRequests: IAccessRequest;
}

const initialState: IAccessRequestState = {
  pagedAccessRequests: { page: 0, total: 0, quantity: 0, items: [] },
};

const accessRequestReducer = (state = initialState, action: IStoreAccessRequestsAction) => {
  switch (action.type) {
    case actionTypes.STORE_ACCESS_REQUESTS:
      console.log('storing access request');
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
