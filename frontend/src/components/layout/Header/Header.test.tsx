import { cleanup, fireEvent, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import Header from './Header';

jest.mock('hooks/useKeycloakWrapper');
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
  usersAgencies: [{ id: '1', name: 'agencyVal' }],
});

test('header renders correctly', () => {
  (useKeycloakWrapper as jest.Mock).mockReturnValue(
    new (useKeycloakMock as any)([], [1], 1, false),
  );
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

describe('UserProfile user name display', () => {
  it('Displays keycloak display name if available', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)([Claims.PROJECT_ADD], [], 0, true),
    );

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    const name = getByText('displayName');
    expect(name).toBeVisible();
  });

  it('displays appropriate agency', () => {
    (useKeycloakWrapper as jest.Mock).mockReturnValue(
      new (useKeycloakMock as any)([], [1], 1, true),
    );

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Header />
        </MemoryRouter>
      </Provider>,
    );
    fireEvent.click(getByText('displayName'));
    expect(getByText(/agencyVal/i)).toBeInTheDocument();
  });
});
