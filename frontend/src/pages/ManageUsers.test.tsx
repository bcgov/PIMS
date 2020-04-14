import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
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

// Empty response
const store = mockStore({
  [reducerTypes.USERS]: { pagedUsers: [] },
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.NETWORK]: { [actionTypes.GET_USERS]: {} },
});
const successStore = mockStore({
  [reducerTypes.USERS]: {
    pagedUsers: {
      page: 1,
      total: 2,
      quantity: 2,
      items: [
        {
          id: 1,
          displayName: 'testUser',
          agencies: [{ id: '1', name: 'HLTH' }],
          roles: [{ id: '1', name: 'admin' }],
        },
      ],
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.NETWORK]: { [actionTypes.GET_USERS]: {} },
});
const loadingStore = mockStore({
  [reducerTypes.USERS]: {},
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.NETWORK]: { [actionTypes.GET_USERS]: { isFetching: true } },
});

it('renders Manage Users page correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <ManageUsers />
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('component functionality', () => {
  const componentRender = (store: any) =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <ManageUsers />
        </Router>
      </Provider>,
    );

  it('renders no users by default', () => {
    const { getByText } = componentRender(store);
    expect(getByText(/No Users available to be managed/i));
  });

  it('renders nothing while loading', () => {
    const { queryByText } = componentRender(loadingStore);
    expect(queryByText(/Manage Users/i)).toBeNull();
  });

  it('renders a table with users and their associated values', () => {
    const { getByText } = componentRender(successStore);
    expect(getByText(/testUser/i));
    expect(getByText(/HLTH/i));
    expect(getByText(/admin/i));
  });

  it('allows useres the option to edit', () => {
    const { getByText } = componentRender(successStore);
    expect(getByText(/edit/i));
    //
  });
});
