import { useKeycloak } from '@react-keycloak/web';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import { mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { IGenericNetworkAction, initialAccessRequestState } from 'store';
import { fillInput } from 'utils/testUtils';

import { Select } from '../../../components/common/form';
import AccessRequestPage from './AccessRequestPage';

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

Enzyme.configure({ adapter: new Adapter() });

const lCodes = {
  lookupCodes: [
    { name: 'One', id: '1', isDisabled: false, type: 'core operational' },
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
    {
      name: 'privateRole',
      id: '2',
      isDisabled: false,
      isPublic: false,
      type: API.ROLE_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const requestAccess = {
  status: 200,
  isFetching: false,
} as IGenericNetworkAction;

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();
const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});

const successStore = mockStore({
  accessRequest: { ...initialAccessRequestState, accessRequest: {} },
  lookupCode: lCodes,
  network: {
    addRequestAccess: requestAccess,
  },
});

// Store without status of 200
const store = mockStore({
  accessRequest: { ...initialAccessRequestState, accessRequest: {} },
  lookupCode: lCodes,
  network: {
    addRequestAccess: requestAccess,
  },
});
describe('AccessRequestPage functionality', () => {
  const testRender = () =>
    render(
      <Provider store={successStore}>
        <Router history={history}>
          <AccessRequestPage />
        </Router>
      </Provider>,
    );
  it('renders RequestAccessPage correctly', () => {
    const { container } = testRender();
    expect(container.firstChild).toMatchSnapshot();
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

    it('Does not display private roles', () => {
      const { queryByText } = testRender();
      expect(queryByText('privateRole')).toBeNull();
    });

    it('displays a success message', () => {
      const { container, getByText } = testRender();
      fillInput(container, 'agency', '1', 'select');
      fillInput(container, 'role', '1', 'select');
      fillInput(container, 'note', 'some notes', 'textarea');
      const submit = getByText('Submit');
      fireEvent.click(submit);
      waitFor(() => expect(getByText('Your request has been submitted.')).toBeVisible());
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
    expect(component.find('div.alert').isEmpty).toBeTruthy();
  });
});
