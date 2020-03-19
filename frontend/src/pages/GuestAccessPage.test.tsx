import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { FormikLookupCodeDropdown } from '../components/common/LookupCodeDropdown';
import { Formik } from 'formik';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import GuestAccessPage from './GuestAccessPage';
import { ILookupCode } from 'actions/lookupActions';
import { IGenericNetworkAction } from 'actions/genericActions';

Enzyme.configure({ adapter: new Adapter() });

const lCodes = [
  { name: 'One', id: '1', isDisabled: false, type: 'core operational' },
] as ILookupCode[];

const requestAccess = {
  status: 200,
  isFetching: false,
} as IGenericNetworkAction;

const noSuccess = {
  status: -1,
  isFetching: false,
};

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

// Simulating a succesful submit
const successStore = mockStore({ lookupCode: lCodes, postRequestAccess: requestAccess });

// Store without status of 200
const store = mockStore({ lookupCode: lCodes, postRequestAccess: noSuccess });

it('renders GuestAccessPage correctly', () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <GuestAccessPage />
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
        <GuestAccessPage />
      </Router>
    </Provider>,
  );

  it('renders dropdown for agenices and roles', () => {
    expect(componentRender.find(FormikLookupCodeDropdown).length).toBe(2);
  });

  it('initializes form with null for agencies and roles', () => {
    expect(
      componentRender
        .find(Formik)
        .first()
        .prop('initialValues'),
    ).toEqual({ agency: undefined, role: undefined });
  });

  it('displays a success message', () => {
    expect(componentRender.find('Your request has been submitted')).toBeTruthy();
  });
});

it('does not show success message by default', () => {
  const component = mount(
    <Provider store={store}>
      <Router history={history}>
        <GuestAccessPage />
      </Router>
    </Provider>,
  );
  expect(component.find('Your request has been submitted')).toHaveLength(0);
});
