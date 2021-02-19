import React from 'react';
import noop from 'lodash/noop';
import { BuildingForm } from '.';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useKeycloak } from '@react-keycloak/web';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/lookupActions';
import * as reducerTypes from 'constants/reducerTypes';
import { fireEvent, render, wait } from '@testing-library/react';

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
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
});

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
      roles: ['admin-properties'],
    },
    subject: 'test',
  },
});

const getBuildingForm = (disabled: boolean) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <BuildingForm
          setBuildingToAssociateLand={noop}
          goToAssociatedLand={noop}
          setMovingPinNameSpace={noop}
          nameSpace="building"
          disabled={disabled}
        />
      </Router>
    </Provider>
  );
};

const buildingForm = (
  <Provider store={store}>
    <Router history={history}>
      <BuildingForm
        setBuildingToAssociateLand={noop}
        goToAssociatedLand={noop}
        setMovingPinNameSpace={noop}
        nameSpace="building"
      />
    </Router>
  </Provider>
);

describe('Building Form', () => {
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
    await wait(() => {
      fireEvent.click(getByText(/continue/i));
    });
    expect(getByText(/Net Usable Area/i)).toBeInTheDocument();
    await wait(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText('Building Valuation', { exact: true })).toBeInTheDocument();
    await wait(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText(/Review your building info/i)).toBeInTheDocument();
  });

  it('building review has appropriate subforms', async () => {
    const { getByText } = render(getBuildingForm(true));
    await wait(() => {
      fireEvent.click(getByText(/Review/i));
    });
    expect(getByText(/Building Identification/i)).toBeInTheDocument();
    expect(getByText(/Net Usable Area/i)).toBeInTheDocument();
    expect(getByText(/Net Book Value/i)).toBeInTheDocument();
  });
});
