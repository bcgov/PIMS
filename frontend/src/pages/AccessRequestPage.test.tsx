import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Select } from '../components/common/form';
import { Formik } from 'formik';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import AccessRequestPage from './AccessRequestPage';
import { ILookupCode } from '../actions/lookupActions';
import { IGenericNetworkAction } from '../actions/genericActions';
import { NETWORK } from '../constants/reducerTypes';
import * as actionTypes from '../constants/actionTypes';

Enzyme.configure({ adapter: new Adapter() });

const lCodes = [
  { name: 'One', id: '1', isDisabled: false, type: 'core operational' },
] as ILookupCode[];

const requestAccess = {
  status: 200,
  isFetching: false,
} as IGenericNetworkAction;

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

// Simulating a succesful submit
const successStore = mockStore({
  lookupCode: lCodes,
  [NETWORK]: {
    [actionTypes.ADD_REQUEST_ACCESS]: requestAccess,
  },
});

// Store without status of 200
const store = mockStore({
  lookupCode: lCodes,
  [NETWORK]: {
    addRequestAccess: requestAccess,
  },
});

it('renders RequestAccessPage correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <AccessRequestPage />
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('component functionality when requestAccess status is 200 and fetching is false', () => {
  const componentRender = mount(
    <Provider store={successStore}>
      <Router history={history}>
        <AccessRequestPage />
      </Router>
    </Provider>,
  );

  it('renders dropdown for agenices and roles', () => {
    expect(componentRender.find(Select).length).toBe(2);
  });

  it('initializes form with null for agencies and roles', () => {
    expect(
      componentRender
        .find(Formik)
        .first()
        .prop('initialValues'),
    ).toEqual({
      agencies: [],
      agency: undefined,
      id: 0,
      status: 'OnHold',
      note: '',
      role: undefined,
      roles: [],
      rowVersion: undefined,
      user: {
        displayName: undefined,
        email: undefined,
        firstName: undefined,
        id: undefined,
        lastName: undefined,
        position: '',
        username: undefined,
      },
      userId: undefined,
    });
  });

  it('displays a success message', () => {
    expect(
      componentRender
        .find('div.alert')
        .first()
        .text(),
    ).toContain('Your request has been submitted.');
  });
});

it('does not show success message by default', () => {
  const component = mount(
    <Provider store={store}>
      <Router history={history}>
        <AccessRequestPage />
      </Router>
    </Provider>,
  );
  expect(
    component
      .find('div.alert')
      .first()
      .text(),
  ).toContain('Your request has been submitted.');
});
