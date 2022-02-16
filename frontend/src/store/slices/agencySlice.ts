import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_SIZE } from 'components/Table/constants';
import { TableSort } from 'components/Table/TableSort';
import { IAgencyDetail } from 'interfaces';
import { IAgency, IAgencyFilter, IAgencyRecord, IPagedItems } from 'interfaces';

export const storeAgency = createAction<IAgency>('storeAgency');
export const storeAgencyDetail = createAction<IAgencyDetail>('storeAgencyDetail');
export const storeAgencies = createAction<IPagedItems<IAgency>>('storeAgencies');
export const storeAgencyPageIndex = createAction<number>('storeAgencyPageIndex');
export const storeAgencyPageQuantity = createAction<number>('storeAgencyPageQuantity');
export const storeAgencySort = createAction<TableSort<IAgencyRecord>>('storeAgencySort');
export const storeAgencyFilter = createAction<IAgencyFilter>('storeAgencyFilter');

const initialAgency: IAgencyDetail = {
  parentId: -1,
  code: '',
  id: -1,
  name: '',
  description: '',
  email: '',
  addressTo: '',
  isDisabled: false,
  sendEmail: false,
  rowVersion: '',
};

export interface IAgenciesState {
  agency: IAgency | null;
  agencyDetail: IAgencyDetail;
  pagedAgencies: IPagedItems<IAgency>;
  rowsPerPage: number;
  filter: IAgencyFilter;
  sort: TableSort<IAgencyRecord>;
  pageIndex: number;
}

export const initialAgencyState: IAgenciesState = {
  agency: null,
  agencyDetail: initialAgency,
  pagedAgencies: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  rowsPerPage: DEFAULT_PAGE_SIZE,
  filter: {},
  sort: { name: 'asc' },
  pageIndex: 0,
};

export const agencySlice = createSlice({
  name: 'agencies',
  initialState: initialAgencyState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(storeAgency, (state: IAgenciesState, action: PayloadAction<IAgency>) => {
      return { ...state, agency: action.payload };
    });
    builder.addCase(
      storeAgencyDetail,
      (state: IAgenciesState, action: PayloadAction<IAgencyDetail>) => {
        return { ...state, agencyDetail: action.payload };
      },
    );
    builder.addCase(
      storeAgencies,
      (state: IAgenciesState, action: PayloadAction<IPagedItems<IAgency>>) => {
        return {
          ...state,
          pagedAgencies: {
            ...action.payload,
            items: [...action.payload.items],
          },
        };
      },
    );
    builder.addCase(
      storeAgencyPageIndex,
      (state: IAgenciesState, action: PayloadAction<number>) => {
        return {
          ...state,
          pageIndex: action.payload,
        };
      },
    );
    builder.addCase(
      storeAgencyPageQuantity,
      (state: IAgenciesState, action: PayloadAction<number>) => {
        return {
          ...state,
          rowsPerPage: action.payload,
        };
      },
    );
    builder.addCase(
      storeAgencySort,
      (state: IAgenciesState, action: PayloadAction<TableSort<IAgencyRecord>>) => {
        return {
          ...state,
          sort: action.payload,
        };
      },
    );
    builder.addCase(
      storeAgencyFilter,
      (state: IAgenciesState, action: PayloadAction<IAgencyFilter>) => {
        return {
          ...state,
          filter: action.payload,
        };
      },
    );
  },
});

export default agencySlice;
