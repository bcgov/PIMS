import * as actionTypes from 'constants/actionTypes';
import { IPagedItems, IAccessRequest } from 'interfaces';
import {
  IStoreAccessRequestsAction,
  IStoreAccessRequestAction,
  IUpdateAccessRequestAction,
  IFilterAccessRequestsAction,
  ISelectAccessRequestsAction,
  ISortAccessRequestsAction,
  IDeleteAccessRequestAction,
  IUpdateAccessRequestPageSizeAction,
  IFilterData,
  IUpdateAccessRequestPageIndexAction,
  ISort,
} from 'actions/accessRequestActions';

export const MAX_ACCESS_RESULTS_PER_PAGE = 100;

export interface IAccessRequestState {
  pagedAccessRequests: IPagedItems<IAccessRequest>;
  filter: IFilterData;
  selections: string[];
  sorting: ISort;
  accessRequest: IAccessRequest | null;
  pageSize: number;
  pageIndex: number;
}

const initialState: IAccessRequestState = {
  pagedAccessRequests: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  filter: { agency: '', role: '', searchText: '' },
  sorting: { column: 'username', direction: 'desc' },
  selections: [],
  accessRequest: null,
  pageSize: MAX_ACCESS_RESULTS_PER_PAGE,
  pageIndex: 0,
};

const accessRequestReducer = (
  state = initialState,
  action:
    | IStoreAccessRequestsAction
    | IStoreAccessRequestAction
    | ISortAccessRequestsAction
    | IUpdateAccessRequestAction
    | IFilterAccessRequestsAction
    | ISelectAccessRequestsAction
    | IDeleteAccessRequestAction
    | IUpdateAccessRequestPageSizeAction
    | IUpdateAccessRequestPageIndexAction,
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
    case actionTypes.DELETE_REQUEST_ACCESS_ADMIN:
      return {
        ...state,
        pagedAccessRequests: {
          ...state.pagedAccessRequests,
          items: state.pagedAccessRequests.items.filter(x => x.id !== action.id),
        },
      };
    case actionTypes.UPDATE_REQUEST_ACCESS_STATUS_ADMIN:
      const items = state.pagedAccessRequests.items.filter(
        req => req.id !== action.accessRequest.id,
      );
      return { ...state, pagedAccessRequests: { ...state.pagedAccessRequests, items: items } };
    case actionTypes.UPDATE_REQUEST_ACCESS_PAGE_SIZE:
      return { ...state, pageSize: action.pageSize };

    case actionTypes.UPDATE_REQUEST_ACCESS_PAGE_INDEX:
      return { ...state, pageIndex: action.pageIndex };

    case actionTypes.FILTER_REQUEST_ACCESS_ADMIN:
      return {
        ...state,
        filter: action.filter,
      };

    default:
      return state;
  }
};

export default accessRequestReducer;
