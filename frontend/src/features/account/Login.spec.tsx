import { cleanup, render } from '@testing-library/react';
import { ADD_ACTIVATE_USER } from 'constants/actionTypes';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import Roles from 'constants/roles';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import * as Router from 'react-router';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { IGenericNetworkAction } from 'store';
import useKeycloakMock from 'useKeycloakWrapperMock';
import * as Vitest from 'vitest';
import { vi } from 'vitest';

import Login from './Login';

vi.mock('axios');
vi.mock('hooks/useKeycloakWrapper');

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency = 1;

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
  const navigate = vi.fn();
  beforeEach(() => {
    vi.spyOn(Router, 'useNavigate').mockImplementation(() => navigate);
  });

  afterEach(() => {
    cleanup();
  });

  it('login renders correctly', () => {
    (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency, false),
    );
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
    (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
      new (useKeycloakMock as any)([Roles.SYSTEM_ADMINISTRATOR], userAgencies, userAgency, true),
    );

    renderLogin();
    expect(navigate).toHaveBeenCalledWith('/mapview');
  });

  it('new users are sent to the guest page', () => {
    (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency, true),
    );
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
    (useKeycloakWrapper as Vitest.Mock).mockReturnValue(
      new (useKeycloakMock as any)(userRoles, userAgencies, userAgency, false),
    );
    const { getAllByRole } = renderLogin();
    expect(getAllByRole('heading')[0]).toHaveTextContent(
      'Search and visualize government property information',
    );
    expect(getAllByRole('heading')[1]).toHaveTextContent(
      'PIMS enables you to search properties owned by the Government of British Columbia',
    );
  });

  it('a spinner is displayed if keycloak has not yet been initialized', () => {
    (useKeycloakWrapper as Vitest.Mock).mockReturnValue({});
    const { container } = renderLogin();
    expect(container.firstChild).toHaveClass('spinner-border');
  });
});
