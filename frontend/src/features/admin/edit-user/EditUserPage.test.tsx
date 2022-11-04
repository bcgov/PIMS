import { useKeycloak } from '@react-keycloak/web';
import { act, cleanup, render } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import { createMemoryHistory } from 'history';
import moment from 'moment-timezone';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import EditUserPage from './EditUserPage';

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
      roles: [],
    },
    subject: 'test',
  },
});

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

const selectedUser = {
  username: 'test.user',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@user.com',
  isDisabled: false,
  emailVerified: false,
  agencies: [],
  roles: [{ id: '2' }],
  rowVersion: 'AAAAAAAAB9E=',
  note: 'test note',
  lastLogin: '2020-10-14T17:45:39.7381599',
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
      <Router history={history}>
        <EditUserPage id="TEST-ID" />,
      </Router>
    </Provider>,
  );

const renderEditUserPage = () =>
  render(
    <Provider store={store}>
      <Router history={history}>
        <ToastContainer
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
        />
        <EditUserPage id="TEST-ID" />,
      </Router>
    </Provider>,
  );

describe('Edit user page', () => {
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
        <Router history={history}>
          <EditUserPage id="TEST-ID" />,
        </Router>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('contains role options from lookup code + please select disabled option', () => {
    const { getAllByText, getByTestId } = renderEditUserPage();
    expect(getAllByText(/Roles/i));
    expect(getAllByText(/roleVal/i));
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

  it('displays enabled roles', () => {
    const { queryByText } = testRender();
    expect(queryByText('roleVal')).toBeVisible();
  });

  it('Does not display disabled roles', () => {
    const { queryByText } = testRender();
    expect(queryByText('disabledRole')).toBeNull();
  });

  describe('appropriate fields are autofilled', () => {
    it('autofills  email, username, first and last name', () => {
      const { getByTestId } = renderEditUserPage();
      expect(getByTestId('email').getAttribute('value')).toEqual('test@user.com');
      expect(getByTestId('username').getAttribute('value')).toEqual('test.user');
      expect(getByTestId('firstName').getAttribute('value')).toEqual('Test');
      expect(getByTestId('lastName').getAttribute('value')).toEqual('User');
      expect(getByTestId('lastName').getAttribute('value')).toEqual('User');
    });
  });

  describe('when the user edit form is submitted', () => {
    it('displays a loading toast', async () => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      act(() => {
        saveButton.click();
      });
      await findByText('Updating User...');
    });

    it('displays a success toast if the request passes', async () => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      act(() => {
        saveButton.click();
      });
      await findByText('User updated');
    });

    it('displays an error toast if the request fails', async () => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      mockAxios.reset();
      mockAxios.onAny().reply(500, {});
      act(() => {
        saveButton.click();
      });
      await findByText('Failed to update User');
    });

    it('Displays the correct last login time', () => {
      const dateTime = moment
        .utc('2020-10-14T17:45:39.7381599')
        .local()
        .format('YYYY-MM-DD hh:mm a');
      const { getByTestId } = renderEditUserPage();
      expect(getByTestId('lastLogin')).toHaveValue(dateTime);
    });
  });
});
