import EditUserPage from './EditUserPage';
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import { Provider } from 'react-redux';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import moment from 'moment-timezone';

Enzyme.configure({ adapter: new Adapter() });

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
  [reducerTypes.GET_USER_DETAIL]: selectedUser,
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const noDateStore = mockStore({
  [reducerTypes.GET_USER_DETAIL]: { ...selectedUser, lastLogin: null },
  [reducerTypes.LOOKUP_CODE]: lCodes,
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
    const tree = renderer
      .create(
        <Provider store={noDateStore}>
          <Router history={history}>
            <EditUserPage id="TEST-ID" />,
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
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
    it('displays a loading toast', async done => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      act(() => {
        saveButton.click();
      });
      await findByText('Updating User...');
      done();
    });

    it('displays a success toast if the request passes', async done => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      act(() => {
        saveButton.click();
      });
      await findByText('User updated');
      done();
    });

    it('displays a error toast if the request fails', async done => {
      const { getByText, findByText } = renderEditUserPage();
      const saveButton = getByText('Save');
      mockAxios.reset();
      mockAxios.onAny().reply(500, {});
      act(() => {
        saveButton.click();
      });
      await findByText('Failed to update User');
      done();
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
