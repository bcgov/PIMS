import EditAgencyPage from './EditAgencyPage';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import { Provider } from 'react-redux';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render, cleanup, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'Test Agency', id: '111', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
  ] as ILookupCode[],
};

const selectedAgency = {
  code: 'TEST',
  id: 111,
  email: 'test@email.com',
  isDisabled: false,
  sendEmail: true,
  addressTo: 'Good morning',
  type: 'Agency',
  name: 'Test Agency',
};

const store = mockStore({
  [reducerTypes.GET_AGENCY_DETAIL]: selectedAgency,
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

const mockAxios = new MockAdapter(axios);

const renderEditAgencyPage = () =>
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
        <EditAgencyPage id={111} />,
      </Router>
    </Provider>,
  );

describe('Edit agency page', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    mockAxios.onAny().reply(200, {});
  });
  it('EditAgencyPage renders', () => {
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <EditAgencyPage id={111} />,
        </Router>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('appropriate fields are autofilled', () => {
    it('autofills  email, name, send email, and code', () => {
      const { getByLabelText } = renderEditAgencyPage();
      expect(getByLabelText(/agency e-mail address/i).getAttribute('value')).toEqual(
        'test@email.com',
      );
      expect(getByLabelText('Agency').getAttribute('value')).toEqual('Test Agency');
      expect(getByLabelText('Short Name (Code)').getAttribute('value')).toEqual('TEST');
      expect(getByLabelText(/email notifications?/i).getAttribute('value')).toEqual('true');
    });
  });

  describe('when the agency edit form is submitted', () => {
    it('displays a loading toast', async done => {
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/save/i);
      act(() => {
        saveButton.click();
      });
      await findByText('Updating Agency...');
      done();
    });

    it('displays a success toast if the request passes', async done => {
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/save/i);
      act(() => {
        saveButton.click();
      });
      await findByText('Agency updated');
      done();
    });

    it('displays a error toast if the request fails', async done => {
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/save/i);
      mockAxios.reset();
      mockAxios.onAny().reply(500, {});
      act(() => {
        saveButton.click();
      });
      await findByText('Failed to update Agency');
      done();
    });
  });
});
