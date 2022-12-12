import { useKeycloak } from '@react-keycloak/web';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { ADD_ACTIVATE_USER } from 'constants/actionTypes';
import * as reducerTypes from 'constants/reducerTypes';
import React from 'react';
import { Provider } from 'react-redux';
import * as Router from 'react-router';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { IGenericNetworkAction } from 'store';

import Login from './Login';

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
  return render(
    <Provider store={store}>
      <Router.MemoryRouter initialEntries={['/login']}>
        <Login />
      </Router.MemoryRouter>
    </Provider>,
  );
};

describe('login', () => {
  // Mock react-router Navigate
  const navigate = jest.fn();
  beforeEach(() => {
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
  });

  afterEach(() => {
    cleanup();
  });

  it('login renders correctly', () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router.MemoryRouter initialEntries={['/login']}>
            <Login />
          </Router.MemoryRouter>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('authenticated users are redirected to the mapview', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: { authenticated: true, userInfo: { groups: ['System Administrator'] } },
    });

    renderLogin();
    expect(navigate).toHaveBeenCalledWith('/mapview');
  });

  it('new users are sent to the guest page', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: { authenticated: true, realmAccess: { roles: [{}] } },
    });
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
        <Router.MemoryRouter initialEntries={['/login']}>
          <Login />
        </Router.MemoryRouter>
      </Provider>,
    );

    expect(navigate).toHaveBeenCalledWith('/access/request');
  });

  it('unAuthenticated users are shown the login screen', () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
    const { getAllByRole } = renderLogin();
    expect(getAllByRole('heading')[0]).toHaveTextContent(
      'Search and visualize government property information',
    );
    expect(getAllByRole('heading')[1]).toHaveTextContent(
      'PIMS enables you to search properties owned by the Government of British Columbia',
    );
  });

  it('a spinner is displayed if keycloak has not yet been initialized', () => {
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: undefined });
    const { container } = renderLogin();
    expect(container.firstChild).toHaveClass('spinner-border');
  });

  it('the login button calls keycloaks login() method', () => {
    const login = jest.fn();
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: { login: login, authenticated: false },
    });

    const { getByText } = renderLogin();
    fireEvent.click(getByText(/Sign In/));

    expect(login.mock.calls.length).toBe(1);
  });
});
