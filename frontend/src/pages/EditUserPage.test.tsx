import EditUserPage from './EditUserPage';
import React from 'react';
import renderer from 'react-test-renderer';
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
import { render } from '@testing-library/react';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '2', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
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
};

const store = mockStore({
  [reducerTypes.GET_USER_DETAIL]: selectedUser,
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

it('EditUserPage renders', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <EditUserPage id="TEST-ID" />,
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains role options from lookup code + please select disabled option', () => {
  const { getAllByText, getByTestId } = render(
    <Provider store={store}>
      <Router history={history}>
        <EditUserPage id="TEST-ID" />,
      </Router>
    </Provider>,
  );
  expect(getAllByText(/Roles/i));
  expect(getAllByText(/roleVal/i));
  expect(getAllByText(/agencyVal/i));
  expect(getByTestId('isDisabled').getAttribute('value')).toEqual('false');
});

describe('appropriate fields are autofilled', () => {
  it('autofills  email, username, first and last name', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Router history={history}>
          <EditUserPage id="TEST-ID" />,
        </Router>
      </Provider>,
    );
    expect(getByTestId('email').getAttribute('value')).toEqual('test@user.com');
    expect(getByTestId('username').getAttribute('value')).toEqual('test.user');
    expect(getByTestId('firstName').getAttribute('value')).toEqual('Test');
    expect(getByTestId('lastName').getAttribute('value')).toEqual('User');
    expect(getByTestId('lastName').getAttribute('value')).toEqual('User');
  });
});
