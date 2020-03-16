import EditUserPage from './EditUserPage';
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import { Provider } from 'react-redux';
import * as reducerTypes from 'constants/reducerTypes';

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureMockStore([thunk]);

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
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
  roles: [],
  rowVersion: 'AAAAAAAAB9E=',
};

const store = mockStore({
  [reducerTypes.GET_USER_DETAIL]: selectedUser,
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const component = mount(
  <Provider store={store}>
    <EditUserPage id="TEST-ID" />,
  </Provider>,
);

it('EditUserPage renders', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <EditUserPage id="TEST-ID" />,
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains role options from lookup code + please select disabled option', () => {
  const roleSelect = component.find('[field="role"]');
  expect(roleSelect.find('option')).toHaveLength(2);
});

it('contains agency options from lookup code + please select disabled option', () => {
  const agencySelect = component.find('[field="agency"]');
  expect(agencySelect.find('option')).toHaveLength(2);
});

it('shows idir as read only field and autofilled', () => {
  const usernameField = component.find('[field="username"]').first();
  expect(usernameField.props().readOnly).toEqual(true);
  expect(usernameField.props().value).toEqual('test.user');
});

describe('appropriate fields are autofilled', () => {
  it('autofills first and last name', () => {
    expect(
      component
        .find('[field="firstName"]')
        .first()
        .props().placeholder,
    ).toEqual('Test');
    expect(
      component
        .find('[field="lastName"]')
        .first()
        .props().placeholder,
    ).toEqual('User');
  });

  it('autofills email', () => {
    expect(
      component
        .find('[field="email"]')
        .first()
        .props().placeholder,
    ).toEqual('test@user.com');
  });
});
