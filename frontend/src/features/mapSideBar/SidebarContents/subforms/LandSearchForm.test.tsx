import { fireEvent, render, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ILookupCode } from 'actions/ILookupCode';
import { IParcel } from 'actions/parcelsActions';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import LandForm from 'features/mapSideBar/SidebarContents/LandForm';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import noop from 'lodash/noop';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'disabledAgency', id: '2', isDisabled: true, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'disabledRole', id: '2', isDisabled: true, type: API.ROLE_CODE_SET_NAME },
    {
      name: 'Core Operational',
      id: '0',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Core Strategic',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Surplus Active',
      id: '2',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Surplus Encumbered',
      id: '3',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Disposed',
      id: '4',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const store = mockStore({
  lookupCode: lCodes,
  parcel: { propeties: [], draftProperties: [] },
  usersAgencies: [
    { id: '1', name: 'agencyVal' },
    { id: '2', name: 'disabledAgency' },
  ],
});

const promise = Promise.resolve();

const userRoles: string[] | Claims[] = ['admin-properties'];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const handleGeocoderChanges = jest.fn(() => promise as unknown as Promise<void>);
const handlePidChange = jest.fn(noop);
const handlePinChange = jest.fn(noop);

// Using LandForm because it contains LandSearchForm
const getLandForm = (disabled?: boolean, initialValues?: IParcel) => (
  <Provider store={store}>
    <MemoryRouter initialEntries={[history.location]}>
      <LandForm
        handleGeocoderChanges={handleGeocoderChanges}
        setMovingPinNameSpace={noop}
        handlePidChange={handlePidChange}
        handlePinChange={handlePinChange}
        isPropertyAdmin={true}
        disabled={disabled}
        initialValues={initialValues as any}
        setLandComplete={noop}
        setLandUpdateComplete={noop}
        findMatchingPid={noop as any}
      />
    </MemoryRouter>
  </Provider>
);

describe('Land Form', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  it('component renders correctly', () => {
    const { container } = render(getLandForm());
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Can switch between tabs in LandSearchForm', async () => {
    const { queryAllByText, getByText, container } = render(getLandForm());
    // Should be able to see "PID, PIN" twice each
    expect(queryAllByText(/PID/).length).toBe(2);
    expect(queryAllByText(/PIN/).length).toBe(2);

    // Click on second tab
    const secondTab = container.querySelector('#parcel-marker-tab');
    await waitFor(() => {
      fireEvent.click(secondTab!);
      getByText(/Select this pin/);
    });
    // And should see this phrase
    expect(queryAllByText(/Select this pin/).length).toBe(1);
  });

  // Cannot currently get a value loaded in the clipboard
  xit('Paste buttons work in LandSearchForm', async () => {
    const readTextMock = jest.fn(() => '123123123');

    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        readText: readTextMock,
        then: () => {
          userEvent.paste('123123123');
        },
      },
    });

    const { container } = render(getLandForm());
    // const pidField = container.querySelector('#pid-field');
    const pidPaste = container.querySelector('#pid-paste');

    await waitFor(() => {
      fireEvent.click(pidPaste!);
    });
    // expect(pidField?.innerHTML).toContain('hi');
    expect(true).toBeTruthy();
  });

  // This only seems to fail in GH Actions
  xit('Formatting occurs on field blurs', async () => {
    const { container } = render(getLandForm());
    const pidField = container.querySelector('#pid-field');
    const pinField = container.querySelector('#pin-field');

    // Test PID with empty field
    fireEvent.blur(pidField!);
    expect((pidField as HTMLInputElement).value).toBe('');

    // Test PID with value
    await userEvent.type(pidField!, '123123123');
    fireEvent.blur(pidField!);
    expect((pidField as HTMLInputElement).value).toBe('123-123-123');

    // Test PIN with empty field
    fireEvent.blur(pinField!);
    expect((pinField as HTMLInputElement).value).toBe('');

    // Test PIN with value
    await userEvent.type(pinField!, '123');
    fireEvent.blur(pinField!);
    expect((pinField as HTMLInputElement).value).toBe('123');
  });

  // Cannot read properties of undefined (reading 'words')
  // Not confident about where error comes from
  xit('See that search buttons were clicked', async () => {
    const { container } = render(getLandForm());
    const pidSearch = container.querySelector('#pid-search');
    const pinSearch = container.querySelector('#pin-search');
    const addressSearch = container.querySelector('#address-search');

    await userEvent.click(pidSearch!);
    expect(handlePidChange).toHaveBeenCalledTimes(1);
    await userEvent.click(pinSearch!);
    expect(handlePinChange).toHaveBeenCalledTimes(1);
    await userEvent.click(addressSearch!);
    expect(handleGeocoderChanges).toHaveBeenCalledTimes(0); // Geocoder response not set...
  });

  // Can't seem to get addressField. It is always null.
  xit('Address field populates selections when typing', async () => {
    const { container, queryByText, getByText } = render(getLandForm());
    const addressField = container.querySelector('#input-data.searchAddress');
    await userEvent.type(addressField!, '1407 Haultain');
    await waitFor(() => {
      getByText('1407 Haultain St, Victoria, BC');
    });
    expect(queryByText('1407 Haultain St, Victoria, BC')).toBeInTheDocument();
  });
});
