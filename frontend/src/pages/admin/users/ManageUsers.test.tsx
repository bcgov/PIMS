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
import { render } from '@testing-library/react';
import ManageUsers from './ManageUsers';

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

const emptyUserListStore = mockStore({
  [reducerTypes.USERS]: {
    pagedUsers: {
      pageIndex: 0,
      total: 0,
      quantity: 0,
      items: [],
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

// TODO: more user manage dashboard tests coming soon

describe('component functionality', () => {
  const componentRender = (store: any) =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <ManageUsers />
        </Router>
      </Provider>,
    );

  it('renders users list', () => {
    const { getAllByText, getAllByTestId, getByTestId } = componentRender(successStore);
    expect(getAllByText(/PIMS Users/i));
    expect(getAllByText(/Rows per page/i));
    expect(getAllByText(/1-2 of 2/i));
    expect(getAllByText(/testername1/i));
    expect(getAllByText(/testUserFirst1/i));
    expect(getAllByText(/testUserLast1/i));
    expect(getAllByText(/tester position/i));
    expect(getAllByText(/admin/i));
    expect(getAllByText(/HLTH/i));
    expect(getAllByTestId('1-Yes')); // test account active status display (User 1 is active)
    expect(getAllByTestId('2-No')); // test account active status display (User 2 is not active)

    // check action buttons
    expect(getByTestId('enable-1').getAttribute('aria-disabled')).toBe('true');
    expect(getByTestId('disable-1').getAttribute('aria-disabled')).toBe('false');
    expect(getByTestId('enable-2').getAttribute('aria-disabled')).toBe('false');
    expect(getByTestId('disable-2').getAttribute('aria-disabled')).toBe('true');
  });

  it('renders empty table', () => {
    const { getAllByText } = componentRender(emptyUserListStore);
    expect(getAllByText(/PIMS Users/i));
    expect(getAllByText(/Sorry, no matching records found/i));
    expect(getAllByText(/0-0 of 0/i));
  });
});
