import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterData } from 'actions/IFilterData';
import { ISort } from 'actions/ISort';
import { IAccessRequest, IPagedItems } from 'interfaces';

export const MAX_ACCESS_RESULTS_PER_PAGE = 100;
export const storeAccessRequests = createAction<IPagedItems<IAccessRequest>>('storeAccessRequests');
export const storeAccessRequest = createAction<IAccessRequest>('storeAccessRequest');
export const deleteAccessRequest = createAction<number>('deleteAccessRequest');
export const updateAccessRequest = createAction<IAccessRequest>('updateAccessRequest');
export const updateAccessRequestPageSize = createAction<number>('updateAccessRequestPageSize');
export const updateAccessRequestPageIndex = createAction<number>('updateAccessRequestPageIndex');
export const updateAccessRequestFilter = createAction<IFilterData>('updateAccessRequestFilter');

export interface IAccessRequestState {
  pagedAccessRequests: IPagedItems<IAccessRequest>;
  filter: IFilterData;
  selections: string[];
  sorting: ISort;
  accessRequest: IAccessRequest | null;
  pageSize: number;
  pageIndex: number;
}

export const initialAccessRequestState: IAccessRequestState = {
  pagedAccessRequests: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  filter: { agency: '', role: '', searchText: '' },
  sorting: { column: 'username', direction: 'desc' },
  selections: [],
  accessRequest: null,
  pageSize: MAX_ACCESS_RESULTS_PER_PAGE,
  pageIndex: 0,
};

export const accessRequestSlice = createSlice({
  name: 'accessRequest',
  initialState: initialAccessRequestState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      storeAccessRequests,
      (state: IAccessRequestState, action: PayloadAction<IPagedItems<IAccessRequest>>) => {
        return {
          ...state,
          pagedAccessRequests: {
            ...action.payload,
            items: [...action.payload.items],
          },
        };
      },
    );
    builder.addCase(
      storeAccessRequest,
      (state: IAccessRequestState, action: PayloadAction<IAccessRequest>) => {
        return {
          ...state,
          accessRequest: {
            ...action.payload,
          },
        };
      },
    );
    builder.addCase(
      deleteAccessRequest,
      (state: IAccessRequestState, action: PayloadAction<number>) => {
        return {
          ...state,
          pagedAccessRequests: {
            ...state.pagedAccessRequests,
            items: state.pagedAccessRequests.items.filter((x) => x.id !== action.payload),
          },
        };
      },
    );
    builder.addCase(
      updateAccessRequest,
      (state: IAccessRequestState, action: PayloadAction<IAccessRequest>) => {
        const items = [
          ...state.pagedAccessRequests.items.filter((req) => req.id !== action.payload.id),
          action.payload,
        ];
        return { ...state, pagedAccessRequests: { ...state.pagedAccessRequests, items: items } };
      },
    );
    builder.addCase(
      updateAccessRequestPageSize,
      (state: IAccessRequestState, action: PayloadAction<number>) => {
        return { ...state, pageSize: action.payload };
      },
    );
    builder.addCase(
      updateAccessRequestPageIndex,
      (state: IAccessRequestState, action: PayloadAction<number>) => {
        return { ...state, pageIndex: action.payload };
      },
    );
    builder.addCase(
      updateAccessRequestFilter,
      (state: IAccessRequestState, action: PayloadAction<IFilterData>) => {
        return {
          ...state,
          filter: action.payload,
        };
      },
    );
  },
});

export default accessRequestSlice;
