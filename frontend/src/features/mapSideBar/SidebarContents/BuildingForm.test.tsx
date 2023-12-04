import { fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import noop from 'lodash/noop';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import { BuildingForm } from '.';

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

const store = mockStore({
  lookupCode: lCodes,
  parcel: { properties: [], draftProperties: [] },
  usersAgencies: [
    { id: '1', name: 'agencyVal' },
    { id: '2', name: 'disabledAgency' },
  ],
});

const userRoles: string[] | Claims[] = ['admin-properties'];
const userAgencies: number[] = [1, 2];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const setMovingPinNameSpaceMock = jest.fn();

const getBuildingForm = (
  disabled: boolean,
  setMovingPinNameSpaceMock: jest.Mock<any, any, any> | ((...args: any[]) => void) = noop,
) => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[history.location]}>
        <BuildingForm
          setBuildingToAssociateLand={noop}
          goToAssociatedLand={noop}
          setMovingPinNameSpace={setMovingPinNameSpaceMock}
          nameSpace="building"
          disabled={disabled}
        />
      </MemoryRouter>
    </Provider>
  );
};

const buildingForm = (
  <Provider store={store}>
    <MemoryRouter initialEntries={[history.location]}>
      <BuildingForm
        setBuildingToAssociateLand={noop}
        goToAssociatedLand={noop}
        setMovingPinNameSpace={noop}
        nameSpace="building"
      />
    </MemoryRouter>
  </Provider>
);

describe('Building Form', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  it('component renders correctly', () => {
    const { container } = render(buildingForm);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays identification page on initial load', () => {
    const { getByText } = render(buildingForm);
    expect(getByText(/building information/i)).toBeInTheDocument();
  });

  it('building form goes to corresponding steps', async () => {
    const { getByText } = render(getBuildingForm(true));
    await waitFor(() => {
      fireEvent.click(getByText(/continue/i));
    });
    expect(getByText(/Net Usable Area/i)).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText('Building Valuation', { exact: true })).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText(/Review your building info/i)).toBeInTheDocument();
  });

  it('building review has appropriate subforms', async () => {
    const { getByText } = render(getBuildingForm(true));
    await waitFor(() => {
      fireEvent.click(getByText(/Review/i));
    });
    expect(getByText(/Building Identification/i)).toBeInTheDocument();
    expect(getByText(/Net Usable Area/i)).toBeInTheDocument();
    expect(getByText(/Net Book Value/i)).toBeInTheDocument();
  });

  // Tests for LatLongForm
  it('LatLong has expected text', async () => {
    const { getByText } = render(getBuildingForm(false));
    expect(getByText(/building information/i)).toBeInTheDocument(); // correct page of BuildingForm
    expect(getByText(/Select this pin/)).toBeInTheDocument();
  });

  it('LatLong Pin Can Be Picked Up and Dropped', async () => {
    const { container, getByText } = render(getBuildingForm(false, setMovingPinNameSpaceMock));
    expect(getByText(/building information/i)).toBeInTheDocument(); // correct page of BuildingForm
    expect(getByText(/Select this pin/)).toBeInTheDocument();

    // Click Pin
    const pin = container.querySelector('#draft-marker-button');
    expect(pin).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(pin!);
    });

    // Drop pin somewhere arbitrary
    await waitFor(() => {
      fireEvent.click(getByText(/Select this pin/));
    });
    expect(setMovingPinNameSpaceMock).toHaveBeenCalledTimes(1);
  });
});
