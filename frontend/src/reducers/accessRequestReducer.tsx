import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IAccessRequest } from 'interfaces';
import {
  IStoreAccessRequestsAction,
  IStoreAccessRequestAction,
} from 'actions/accessRequestActions';

export interface IAccessRequestState {
  pagedAccessRequests: IPagedItems;
  accessRequest: IAccessRequest | null;
}

const initialState: IAccessRequestState = {
  pagedAccessRequests: { page: 0, total: 0, quantity: 0, items: [] },
  accessRequest: null,
};

const accessRequestReducer = (
  state = initialState,
  action: IStoreAccessRequestsAction | IStoreAccessRequestAction,
) => {
  switch (action.type) {
    case actionTypes.STORE_ACCESS_REQUESTS:
      return {
        ...state,
        pagedAccessRequests: {
          ...action.pagedAccessRequests,
          items: [...action.pagedAccessRequests.items],
        },
      };
    case actionTypes.STORE_ACCESS_REQUEST:
      return {
        ...state,
        accessRequest: {
          ...action.accessRequest,
        },
      };
    default:
      return state;
  }
};

export default accessRequestReducer;
