import { TableSort } from 'components/Table/TableSort';
import { IAgency, IAgencyDetail, IAgencyFilter, IAgencyRecord, IPagedItems } from 'interfaces';

import {
  initialAgencyState,
  storeAgencies,
  storeAgency,
  storeAgencyDetail,
  storeAgencyFilter,
  storeAgencyPageIndex,
  storeAgencyPageQuantity,
  storeAgencySort,
} from '.';
import { agencySlice } from './agencySlice';

describe('Agency slice tests', () => {
  const reducer = agencySlice.reducer;
  const agency: IAgency = {
    id: 1,
    code: 'AGENCY',
    name: 'agency',
  };
  const agencyDetail: IAgencyDetail = {
    id: 1,
    code: 'AGENCY',
    name: 'AGENCY',
    email: 'email',
    isDisabled: false,
    addressTo: 'John Doe',
    sendEmail: true,
    rowVersion: 'version',
  };
  const agencies: IPagedItems<IAgency> = {
    items: [agency],
    page: 1,
    pageIndex: 0,
    quantity: 20,
    total: 1,
  };

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialAgencyState);
  });

  it('Should store agency', () => {
    expect(reducer(undefined, storeAgency(agency))).toEqual({
      ...initialAgencyState,
      agency,
    });
  });

  it('Should store agency detail', () => {
    expect(reducer(undefined, storeAgencyDetail(agencyDetail))).toEqual({
      ...initialAgencyState,
      agencyDetail,
    });
  });

  it('Should store agencies', () => {
    expect(reducer(undefined, storeAgencies(agencies))).toEqual({
      ...initialAgencyState,
      pagedAgencies: { ...agencies },
    });
  });

  it('Should update page size', () => {
    const pageSize = 5;
    expect(reducer(undefined, storeAgencyPageQuantity(pageSize))).toEqual({
      ...initialAgencyState,
      rowsPerPage: pageSize,
    });
  });

  it('Should update page index', () => {
    const pageIndex = 5;
    expect(reducer(undefined, storeAgencyPageIndex(pageIndex))).toEqual({
      ...initialAgencyState,
      pageIndex: pageIndex,
    });
  });

  it('Should update filter', () => {
    const filter: IAgencyFilter = {
      name: 'name',
      description: 'description',
      id: 1,
    };
    expect(reducer(undefined, storeAgencyFilter(filter))).toEqual({
      ...initialAgencyState,
      filter: filter,
    });
  });

  it('Should update sort', () => {
    const sort: TableSort<IAgencyRecord> = {
      name: 'asc',
      id: 'asc',
      code: 'desc',
      description: 'asc',
      parentId: 'desc',
      parent: 'asc',
      email: 'desc',
      sendEmail: 'asc',
    };
    expect(reducer(undefined, storeAgencySort(sort))).toEqual({
      ...initialAgencyState,
      sort: sort,
    });
  });
});
