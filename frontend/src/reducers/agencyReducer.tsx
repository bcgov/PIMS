import * as actionTypes from 'constants/actionTypes';
import { IStoreAgencyAction } from 'actions/adminActions';
import { IAgency, IAgencyFilter, IAgencyRecord, IPagedItems } from 'interfaces';
import { TableSort } from 'components/Table/TableSort';
import { DEFAULT_PAGE_SIZE } from 'components/Table/constants';

export interface IAgenciesState {
  pagedAgencies: IPagedItems<IAgency>;
  rowsPerPage: number;
  filter: IAgencyFilter;
  sort: TableSort<IAgencyRecord>;
  pageIndex: number;
}

const initialState: IAgenciesState = {
  pagedAgencies: { page: 1, pageIndex: 0, total: 0, quantity: 0, items: [] },
  rowsPerPage: DEFAULT_PAGE_SIZE,
  filter: {},
  sort: { column: 'name', direction: 'asc' },
  pageIndex: 0,
};

const agencyReducer = (state = initialState, action: IStoreAgencyAction) => {
  switch (action.type) {
    case actionTypes.STORE_AGENCY_RESULTS:
      return {
        ...state,
        pagedAgencies: {
          ...action.pagedAgencies,
          items: [...action.pagedAgencies.items],
        },
      };
    default:
      return state;
  }
};

export default agencyReducer;
