import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Administration from './Administration';
import { ILookupCode } from 'actions/lookupActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { render, fireEvent } from '@testing-library/react';

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
  [reducerTypes.NETWORK]: {
    [actionTypes.GET_REQUEST_ACCESS]: { isFetching: false },
    [actionTypes.ADD_REQUEST_ACCESS]: {},
    [actionTypes.GET_USERS]: { isFetching: false },
  },
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.USERS]: {},
});

it('renders Administration page correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <Administration />
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('component functionality', () => {
  const componentRender = () =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <Administration />
        </Router>
      </Provider>,
    );

  it('renders manage users tab by default', () => {
    const { getAllByText } = componentRender();
    expect(getAllByText(/manage users/i)).toHaveLength(2);
  });

  it('the Manage Access Requests tab is hidden by default', () => {
    const { getByText } = componentRender();
    expect(getByText(/manage access requests/i)).toBeTruthy();
  });

  it('Shows access request tab when clicked', () => {
    const { getAllByText, getByText } = componentRender();
    fireEvent.click(getByText(/manage access requests/i));
    expect(getAllByText('Manage Access Requests')).toHaveLength(2);
  });

  it('Shows access request tab when navigated to directly', () => {
    history.push('/admin/requests');
    const { getAllByText } = componentRender();
    expect(getAllByText('Manage Access Requests')).toHaveLength(2);
  });
});
