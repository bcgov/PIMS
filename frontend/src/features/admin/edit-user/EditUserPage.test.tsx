import { cleanup, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import EditUserPage from './EditUserPage';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
  ] as ILookupCode[],
};

const selectedUser = {
  username: 'tester',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'test@test.com',
  isDisabled: false,
  emailVerified: false,
  agencies: [1],
  roles: [],
  rowVersion: 'AAAAAAAAB9E=',
  note: 'test note',
  lastLogin: '2023-02-28T17:45:39.7381599',
};

const store = mockStore({
  users: { user: selectedUser },
  lookupCode: lCodes,
});

const noDateStore = mockStore({
  users: { user: { ...selectedUser, lastLogin: null } },
  lookupCode: lCodes,
});

const mockAxios = new MockAdapter(axios);

const testRender = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[history.location]}>
        <EditUserPage />,
      </MemoryRouter>
    </Provider>,
  );

const renderEditUserPage = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[history.location]}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
        />
        <EditUserPage />,
      </MemoryRouter>
    </Provider>,
  );

describe('Edit user page', () => {
  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = false;
  });
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockAxios.onAny().reply(200, {});
  });

  it('EditUserPage renders', () => {
    const { container } = render(
      <Provider store={noDateStore}>
        <MemoryRouter initialEntries={[history.location]}>
          <EditUserPage />,
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('contains role options from lookup code + please select disabled option', () => {
    const { getAllByText, getByTestId } = renderEditUserPage();
    expect(getAllByText(/Roles/i));
    expect(getAllByText(/agencyVal/i));
    expect(getByTestId('isDisabled').getAttribute('value')).toEqual('false');
  });

  it('displays enabled agencies', () => {
    const { queryByText } = testRender();
    expect(queryByText('agencyVal')).toBeVisible();
  });

  it('Does not display disabled agencies', () => {
    const { queryByText } = testRender();
    expect(queryByText('disabledAgency')).toBeNull();
  });

  describe('appropriate fields are autofilled', () => {
    it('autofills  email, username, first and last name', () => {
      const { getByTestId } = renderEditUserPage();
      expect(getByTestId('email').getAttribute('value')).toEqual('test@test.com');
      expect(getByTestId('username').getAttribute('value')).toEqual('tester');
      expect(getByTestId('firstName').getAttribute('value')).toEqual('firstName');
      expect(getByTestId('lastName').getAttribute('value')).toEqual('lastName');
    });
  });

  describe('when the user edit form is submitted', () => {
    it('displays a loading toast', async () => {
      mockAxios.onAny().replyOnce(500, {});
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      saveButton.click();
      findByText('Updating User...');
    });

    it('displays a success toast if the request passes', async () => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');

      saveButton.click();

      findByText('User updated');
    });

    it('displays an error toast if the request fails', async () => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      mockAxios.reset();
      mockAxios.onAny().reply(500, {});

      saveButton.click();

      findByText('Failed to update User');
    });

    it('Displays the correct last login time', () => {
      const dateTime = moment
        .utc('2023-02-28T17:45:39.7381599')
        .local()
        .format('YYYY-MM-DD hh:mm a');
      const { getByTestId } = renderEditUserPage();
      expect(getByTestId('lastLogin')).toHaveValue(dateTime);
    });
  });
});
