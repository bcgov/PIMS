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
import ManageAccessRequests from './ManageAccessRequests';

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
  [reducerTypes.ACCESS_REQUEST]: {},
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: {
      isFetching: false,
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
});
const successStore = mockStore({
  [reducerTypes.ACCESS_REQUEST]: {
    pagedAccessRequests: {
      page: 1,
      total: 2,
      quantity: 2,
      items: [
        {
          roles: [{ id: '1' }],
          agencies: [{ id: '1' }],
          user: {
            displayName: 'testUser',
          },
        },
      ],
    },
  },
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: {
      isFetching: false,
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
});
const loadingStore = mockStore({
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: {
      isFetching: true,
    },
  },
  [reducerTypes.NETWORK]: {
    [actionTypes.UPDATE_REQUEST_ACCESS_ADMIN]: {
      isFetching: true,
    },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
});
xit('renders Manage Access Requests page correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <ManageAccessRequests />
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
          <ManageAccessRequests />
        </Router>
      </Provider>,
    );

  xit('renders no access requests by default', () => {
    const { getByText } = componentRender(store);
    expect(getByText(/no access requests/i));
  });

  xit('renders nothing while loading', () => {
    const { queryByText } = componentRender(loadingStore);
    expect(queryByText(/Manage Access Requests/i)).toBeNull();
  });

  xit('renders a table when there are access requests to display', () => {
    const { getByText } = componentRender(successStore);
    expect(getByText(/actions/i)).toBeTruthy();
    expect(getByText(/testuser/i)).toBeTruthy();
  });

  xit('renders default values into the dropdowns', () => {
    const { getByText } = componentRender(successStore);
    expect(getByText(/agencyVal/i)).toBeTruthy();
    expect(getByText(/roleVal/i)).toBeTruthy();
  });
});
