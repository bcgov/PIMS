import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as actionTypes from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import { ManageUsersPage } from './ManageUsersPage';
import { create, ReactTestInstance } from 'react-test-renderer';
import { render } from '@testing-library/react';
import moment from 'moment-timezone';

Enzyme.configure({ adapter: new Adapter() });

const history = createMemoryHistory();
history.push('admin');
const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useRouteMatch: () => ({ url: '/admin', path: '/admin' }),
}));
const getStore = (includeDate?: boolean) =>
  mockStore({
    [reducerTypes.USERS]: {
      pagedUsers: {
        pageIndex: 0,
        total: 2,
        quantity: 2,
        items: [
          {
            id: '1',
            username: 'testername1',
            firstName: 'testUserFirst1',
            lastName: 'testUserLast1',
            isDisabled: false,
            position: 'tester position',
            agencies: [{ id: '1', name: 'HLTH' }],
            roles: [{ id: '1', name: 'admin' }],
            lastLogin: includeDate ? '2020-10-14T17:45:39.7381599' : null,
          },
          {
            id: '2',
            username: 'testername2',
            firstName: 'testUser',
            lastName: 'testUser',
            isDisabled: true,
            position: 'tester',
            agencies: [{ id: '1', name: 'HLTH' }],
            roles: [{ id: '1', name: 'admin' }],
            lastLogin: includeDate ? '2020-10-14T17:46:39.7381599' : null,
          },
        ],
      },
      rowsPerPage: 10,
    },
    [reducerTypes.LOOKUP_CODE]: lCodes,
    [reducerTypes.NETWORK]: {
      [actionTypes.GET_USERS]: {
        isFetching: false,
      },
    },
  });

describe('Manage Users Component', () => {
  const componentRender = (store: any) =>
    create(
      <Provider store={store}>
        <Router history={history}>
          <ManageUsersPage />
        </Router>
      </Provider>,
    );

  const testRender = (store: any) =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <ManageUsersPage />
        </Router>
      </Provider>,
    );

  it('Snapshot matches', () => {
    const component = componentRender(getStore());
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Table row count is 2', () => {
    const component = componentRender(getStore());
    const instance = component.root;
    const table = (instance as ReactTestInstance).findByProps({ name: 'usersTable' });
    expect(table.props.data.length).toBe(2);
  });

  it('displays enabled agencies', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('agencyVal')).toBeVisible();
  });

  it('Does not display disabled agencies', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('disabledAgency')).toBeNull();
  });

  it('displays enabled roles', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('roleVal')).toBeVisible();
  });

  it('Does not display disabled roles', () => {
    const { queryByText } = testRender(getStore());
    expect(queryByText('disabledRole')).toBeNull();
  });

  it('Displays the correct last login time', () => {
    const dateTime = moment
      .utc('2020-10-14T17:45:39.7381599')
      .local()
      .format('YYYY-MM-DD hh:mm a');
    const { getByText } = testRender(getStore(true));
    expect(getByText(dateTime)).toBeVisible();
  });
});
