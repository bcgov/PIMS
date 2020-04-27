import React from 'react';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { useKeycloak } from '@react-keycloak/web';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import Login from '../pages/Login';
import * as reducerTypes from 'constants/reducerTypes';
import {} from 'reducers/networkReducer';
import { IGenericNetworkAction } from 'actions/genericActions';
import { Provider } from 'react-redux';
import { ADD_ACTIVATE_USER } from 'constants/actionTypes';

jest.mock('axios');
jest.mock('@react-keycloak/web');
const mockStore = configureMockStore([thunk]);

const store = mockStore({
  [reducerTypes.NETWORK]: {
    [ADD_ACTIVATE_USER]: {},
  },
});

//boilerplate function used by most tests to wrap the Login component with a router.
const renderLogin = () => {
  const history = createMemoryHistory();
  return render(
    <Provider store={store}>
      <Router history={history}>
        <Login />
      </Router>
    </Provider>,
  );
};

it('login renders correctly', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const history = createMemoryHistory();
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <Login></Login>
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('authenticated users are redirected to the mapview', () => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: { authenticated: true, userInfo: { groups: ['System Administrator'] } },
  });
  const history = createMemoryHistory();

  render(
    <Provider store={store}>
      <Router history={history}>
        <Login />
      </Router>
    </Provider>,
  );
  expect(history.location.pathname).toBe('/mapview');
});

it('new users are sent to the guest page', () => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: { authenticated: true, realmAccess: { roles: [{}] } },
  });
  const history = createMemoryHistory();
  const activatedAction: IGenericNetworkAction = {
    isFetching: false,
    name: 'test',
    type: 'POST',
    status: 201,
  };
  const store = mockStore({
    [reducerTypes.NETWORK]: {
      activateUser: activatedAction,
    },
  });

  render(
    <Provider store={store}>
      <Router history={history}>
        <Login />
      </Router>
    </Provider>,
  );
  expect(history.location.pathname).toBe('/access/request');
});

it('unAuthenticated users are shown the login screen', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const { getByRole } = renderLogin();
  expect(getByRole('heading')).toHaveTextContent('Search and manage government properties');
});

it('a spinner is displayed if keycloak has not yet been initialized', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: undefined });
  const { container } = renderLogin();
  expect(container.firstChild).toHaveClass('spinner-border');
});

it('the login button calls keycloaks login() method', () => {
  const login = jest.fn();
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { login: login, authenticated: false } });

  const { getByText } = renderLogin();
  fireEvent.click(getByText(/sign in/i));

  expect(login.mock.calls.length).toBe(1);
});
