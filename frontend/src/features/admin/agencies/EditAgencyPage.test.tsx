import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialAgencyState } from 'store';
import useKeycloakMock from 'useKeycloakWrapperMock';
import { fillInput } from 'utils/testUtils';

import EditAgencyPage from './EditAgencyPage';

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
  agencies: { ...initialAgencyState, agencyDetail: selectedAgency },
  lookupCode: lCodes,
});

const mockAxios = new MockAdapter(axios);

const renderEditAgencyPage = () =>
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
        <EditAgencyPage />,
      </MemoryRouter>
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
        <MemoryRouter initialEntries={[history.location]}>
          <EditAgencyPage />,
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  describe('appropriate fields are autofilled', () => {
    it('autofills  email, name, send email, and code', () => {
      const { getByLabelText } = renderEditAgencyPage();
      expect(getByLabelText(/^Email address/i).getAttribute('value')).toEqual('test@email.com');
      expect(getByLabelText('Agency').getAttribute('value')).toEqual('Test Agency');
      expect(getByLabelText('Short Name (Code)').getAttribute('value')).toEqual('TEST');
      expect(getByLabelText(/email notifications?/i).getAttribute('value')).toEqual('true');
    });
  });

  describe('when the agency edit form is submitted', () => {
    it('displays a loading toast', async () => {
      mockAxios.onAny().replyOnce(500, {});
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/save/i);
      act(() => {
        saveButton.click();
      });
      findByText('Updating Agency...');
    });

    it('displays a success toast if the request passes', async () => {
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/save/i);
      act(() => {
        saveButton.click();
      });
      await findByText('Agency updated');
    });

    it('displays a error toast if the request fails', async () => {
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/save/i);
      mockAxios.reset();
      mockAxios.onAny().reply(500, {});
      act(() => {
        saveButton.click();
      });
      await findByText('Failed to update Agency');
    });

    it('displays an error message if a new agency is missing data', async () => {
      history.push('/new');
      const { getByText, findByText } = renderEditAgencyPage();
      const saveButton = getByText(/Submit Agency/i);
      act(() => {
        saveButton.click();
      });
      await findByText('An agency name is required.');
    });

    it('displays a success toast if the request passes for a new agency', async () => {
      history.push('/new');
      const { getByText, findByText, container } = renderEditAgencyPage();
      mockAxios.reset();
      mockAxios.onAny().reply(200, {});
      fillInput(container, 'name', 'test agency');
      fillInput(container, 'code', 'TA');
      fillInput(container, 'email', '1@1.ca');
      fillInput(container, 'addressTo', 'hello you');
      const saveButton = getByText(/Submit Agency/i);
      act(() => {
        saveButton.click();
      });
      await findByText('Agency updated');
    });

    it('can delete agencies with no properties', async () => {
      history.push('/');
      const { getByText, container } = renderEditAgencyPage();
      mockAxios.reset();
      mockAxios.onAny().reply(200, {});
      mockAxios.onGet().reply(200, { total: 0 });
      fillInput(container, 'name', 'test agency');
      fillInput(container, 'code', 'TA');
      fillInput(container, 'email', '1@1.ca');
      fillInput(container, 'addressTo', 'hello you');
      const deleteButton = getByText(/Delete Agency/i);
      act(() => {
        deleteButton.click();
      });
      await screen.findByText('Are you sure you want to permanently delete the agency?');
      const deleteConfirm = getByText(/^Delete$/i);
      act(() => {
        deleteConfirm.click();
      });
      await waitFor(() => expect(mockAxios.history.delete).toHaveLength(1));
    });

    it('can not delete agencies with properties', async () => {
      history.push('/');
      const { getByText, container } = renderEditAgencyPage();
      mockAxios.reset();
      mockAxios.onAny().reply(200, {});
      fillInput(container, 'name', 'test agency');
      fillInput(container, 'code', 'TA');
      fillInput(container, 'email', '1@1.ca');
      fillInput(container, 'addressTo', 'hello you');
      const deleteButton = getByText(/Delete Agency/i);
      act(() => {
        deleteButton.click();
      });
      await screen.findByText(
        'You are not able to delete this agency as there are properties currently associated with it.',
      );
      const deleteConfirm = getByText(/^ok$/i);
      act(() => {
        deleteConfirm.click();
      });
    });
  });
});
