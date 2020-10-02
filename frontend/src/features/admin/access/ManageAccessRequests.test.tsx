import React from 'react';
import { createMemoryHistory } from 'history';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as actionTypes from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import ManageAccessRequests from './ManageAccessRequests';
import { create, ReactTestInstance } from 'react-test-renderer';
import { AccessRequestStatus } from 'constants/accessStatus';
import { Router } from 'react-router-dom';

const accessRequests = {
  page: 1,
  total: 2,
  quantity: 2,
  items: [
    {
      id: 1,
      status: AccessRequestStatus.OnHold,
      roles: [{ id: '1', name: 'role1' }],
      agencies: [{ id: '1', name: 'agency 1' }],
      user: {
        id: 'userid',
        displayName: 'testUser',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'user@email.com',
        position: 'position 1',
      },
    },
  ],
};

Enzyme.configure({ adapter: new Adapter() });

const history = createMemoryHistory();
history.push('admin');
const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useRouteMatch: () => ({ url: '/admin', path: '/admin' }),
}));

const successStore = mockStore({
  [reducerTypes.ACCESS_REQUEST]: {
    pageSize: 10,
    filter: { searchText: '', role: '', agency: '' },
    pagedAccessRequests: accessRequests,
  },
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: {
      isFetching: false,
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const componentRender = (store: any) => {
  let component = create(
    <Router history={history}>
      <Provider store={store}>
        <ManageAccessRequests />
      </Provider>
    </Router>,
  );
  return component;
};

describe('Manage access requests', () => {
  afterEach(() => jest.resetAllMocks());
  it('Snapshot matches', () => {
    const component = componentRender(successStore);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Table row count is 1', () => {
    const component = componentRender(successStore);
    const instance = component.root;
    const table = (instance as ReactTestInstance).findByProps({ name: 'accessRequestsTable' });
    expect(table.props.data.length).toBe(1);
  });

  it('On Hold menu button is disabled', () => {
    const component = componentRender(successStore);
    const instance = component.root;
    const holdMenuItem = (instance as ReactTestInstance).findByProps({ label: 'Hold' });
    expect(holdMenuItem.props.disabled).toBeTruthy();
  });

  it('On Approve menu button is enabled', () => {
    const component = componentRender(successStore);
    const instance = component.root;
    const holdMenuItem = (instance as ReactTestInstance).findByProps({ label: 'Approve' });
    expect(holdMenuItem.props.disabled).toBeFalsy();
  });

  it('On Decline menu button is enabled', () => {
    const component = componentRender(successStore);
    const instance = component.root;
    const holdMenuItem = (instance as ReactTestInstance).findByProps({ label: 'Decline' });
    expect(holdMenuItem.props.disabled).toBeFalsy();
  });
});
