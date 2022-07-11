import { useKeycloak } from '@react-keycloak/web';
import { ILookupCode } from 'actions/ILookupCode';
import { AccessRequestStatus } from 'constants/accessStatus';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { create, ReactTestInstance } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ManageAccessRequests from './ManageAccessRequests';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

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
    requests: {
      [actionTypes.GET_REQUEST_ACCESS]: {
        isFetching: false,
      },
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const componentRender = (store: any) => {
  let component = create(
    <Formik initialValues={{}} onSubmit={noop}>
      <Router history={history}>
        <Provider store={store}>
          <ManageAccessRequests />
        </Provider>
      </Router>
    </Formik>,
  );
  return component;
};

describe('Manage access requests', () => {
  afterEach(() => jest.restoreAllMocks());
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
