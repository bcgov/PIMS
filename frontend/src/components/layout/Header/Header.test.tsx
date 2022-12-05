import { useKeycloak } from '@react-keycloak/web';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Header from './Header';

jest.mock('@react-keycloak/web');
afterEach(() => {
  cleanup();
});

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.NETWORK]: { requests: {} },
});

test('header renders correctly', () => {
  (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { authenticated: false } });
  const tree = renderer
    .create(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Header />
        </MemoryRouter>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('User displays default if no user name information found', () => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      subject: 'test',
      authenticated: true,
      userInfo: {
        roles: [Claims.PROJECT_ADD],
      },
    },
  });

  const { getByText } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[history.location]}>
        <Header />
      </MemoryRouter>
    </Provider>,
  );
  const name = getByText('default');
  expect(name).toBeVisible();
});

describe('UserProfile user name display', () => {
  it('Displays keycloak display name if available', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        authenticated: true,
        userInfo: {
          name: 'display name',
          firstName: 'name',
          roles: [Claims.PROJECT_ADD],
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    const name = getByText('display name');
    expect(name).toBeVisible();
  });

  it('Displays first last name if no display name', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        authenticated: true,
        userInfo: {
          roles: [Claims.PROJECT_ADD],
          firstName: 'firstName',
          lastName: 'lastName',
        },
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    const name = getByText('firstName lastName');
    expect(name).toBeVisible();
  });

  it('displays appropriate agency', () => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        subject: 'test',
        authenticated: true,
        userInfo: {
          agencies: ['1'],
          firstName: 'test',
          lastName: 'user',
        },
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    fireEvent.click(getByText(/test user/i));
    expect(getByText(/agencyVal/i)).toBeInTheDocument();
  });
});
