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
} from 'actions/accessRequestActions';

export interface IColumnFilter {
  filterType: string;
  type: string;
  filter: string;
}

export interface ISort {
  colId: string;
  sort: string;
}

export interface IAccessRequestState {
  pagedAccessRequests: IPagedItems<IAccessRequest>;
  filters: { [key: number]: IColumnFilter };
  selections: string[];
  sorting: ISort[];
  accessRequest: IAccessRequest | null;
}

const initialState: IAccessRequestState = {
  pagedAccessRequests: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  filters: {},
  sorting: [],
  selections: [],
  accessRequest: null,
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
    | IDeleteAccessRequestAction,
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

    case actionTypes.FILTER_REQUEST_ACCESS_ADMIN:
      return {
        ...state,
        pagedAccessRequests: { ...state.pagedAccessRequests },
        sorting: [...state.sorting],
        selections: [...state.selections],
        filter: action.filters,
      };

    case actionTypes.SELECT_REQUEST_ACCESS_ADMIN:
      return {
        ...state,
        pagedAccessRequests: { ...state.pagedAccessRequests },
        sorting: [...state.sorting],
        filters: { ...state.filters },
        selections: action.selections,
      };

    case actionTypes.SORT_REQUEST_ACCESS_ADMIN:
      return {
        ...state,
        pagedAccessRequests: { ...state.pagedAccessRequests },
        filters: { ...state.filters },
        selections: state.selections,
        sorting: action.sorting,
      };

    default:
      return state;
  }
};

export default accessRequestReducer;
