import { IFilterData } from 'actions/IFilterData';
import { AccessRequestStatus } from 'constants/accessStatus';
import { IAccessRequest, IPagedItems } from 'interfaces';
import {
  deleteAccessRequest,
  storeAccessRequest,
  updateAccessRequest,
  updateAccessRequestFilter,
  updateAccessRequestPageSize,
  initialAccessRequestState,
  accessRequestSlice,
  storeAccessRequests,
  updateAccessRequestPageIndex,
} from './accessRequestSlice';

describe('Access Request slice tests', () => {
  const reducer = accessRequestSlice.reducer;
  const accessRequest: IAccessRequest = {
    id: 1,
    userId: 'test',
    user: {},
    agencies: [],
    roles: [],
    status: AccessRequestStatus.OnHold,
  };
  const accessRequests: IPagedItems<IAccessRequest> = {
    items: [accessRequest],
    pageIndex: 0,
    page: 1,
    quantity: 20,
    total: 1,
  };

  it('Should return initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialAccessRequestState);
  });

  it('Should store access requests', () => {
    expect(reducer(undefined, storeAccessRequests(accessRequests))).toEqual({
      ...initialAccessRequestState,
      pagedAccessRequests: accessRequests,
    });
  });

  it('Should store an access request', () => {
    expect(reducer(undefined, storeAccessRequest(accessRequest))).toEqual({
      ...initialAccessRequestState,
      accessRequest,
    });
  });

  it('Should delete access request from store', () => {
    expect(
      reducer(
        { ...initialAccessRequestState, pagedAccessRequests: accessRequests },
        deleteAccessRequest(accessRequest.id),
      ),
    ).toEqual({
      ...initialAccessRequestState,
      pagedAccessRequests: {
        ...accessRequests,
        items: [],
      },
    });
  });

  it('Should update store with access request', () => {
    const data: IAccessRequest = {
      ...accessRequest,
      status: AccessRequestStatus.Approved,
    };
    expect(
      reducer(
        { ...initialAccessRequestState, pagedAccessRequests: accessRequests },
        updateAccessRequest(data),
      ),
    ).toEqual({
      ...initialAccessRequestState,
      pagedAccessRequests: {
        ...accessRequests,
        items: [data],
      },
    });
  });

  it('Should update page size', () => {
    const pageSize = 5;
    expect(reducer(undefined, updateAccessRequestPageSize(pageSize))).toEqual({
      ...initialAccessRequestState,
      pageSize: pageSize,
    });
  });

  it('Should update page index', () => {
    const pageIndex = 5;
    expect(reducer(undefined, updateAccessRequestPageIndex(pageIndex))).toEqual({
      ...initialAccessRequestState,
      pageIndex: pageIndex,
    });
  });

  it('Should update filter', () => {
    const filter: IFilterData = {
      agency: 'agency',
      role: 'role',
      searchText: 'search',
    };
    expect(reducer(undefined, updateAccessRequestFilter(filter))).toEqual({
      ...initialAccessRequestState,
      filter: filter,
    });
  });
});
