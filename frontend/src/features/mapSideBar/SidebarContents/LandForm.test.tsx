import React from 'react';
import noop from 'lodash/noop';
import { LandForm } from '.';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useKeycloak } from '@react-keycloak/web';
import * as API from 'constants/API';
import { ILookupCode } from 'actions/lookupActions';
import * as reducerTypes from 'constants/reducerTypes';
import { fireEvent, render, wait, screen } from '@testing-library/react';
import { Classifications } from 'constants/classifications';
import { fillInput } from 'utils/testUtils';
import { IParcel } from 'actions/parcelsActions';

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
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
});

const promise = Promise.resolve();

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

const defaultInitialValues: IParcel = {
  id: 1,
  pid: '111-111-111',
  pin: '',
  classificationId: Classifications.CoreOperational,
  encumbranceReason: '',
  landArea: 123,
  landLegalDescription: 'legal',
  zoning: 'zoning',
  zoningPotential: 'zoningPotential',
  agencyId: 1,
  isSensitive: false,
  buildings: [],
  evaluations: [],
  fiscals: [],
  rowVersion: '',
  latitude: 51,
  longitude: -122,
  assessedLand: '',
  assessedBuilding: '',
  address: {
    line1: 'address line 1',
    administrativeArea: 'Victoria',
    postal: 'V8T3X8',
    provinceId: 'BC',
  },
};

const getLandForm = (disabled?: boolean, initialValues?: IParcel) => (
  <Provider store={store}>
    <Router history={history}>
      <LandForm
        handleGeocoderChanges={() => (promise as unknown) as Promise<void>}
        setMovingPinNameSpace={noop}
        handlePidChange={noop}
        handlePinChange={noop}
        isPropertyAdmin={true}
        disabled={disabled}
        initialValues={initialValues as any}
        setLandComplete={noop}
        setLandUpdateComplete={noop}
      />
    </Router>
  </Provider>
);

describe('Land Form', () => {
  it('component renders correctly', () => {
    const { container } = render(getLandForm());
    expect(container.firstChild).toMatchSnapshot();
  });

  it('displays identification page on initial load', () => {
    const { getByText } = render(getLandForm());
    expect(getByText(/parcel identification/i)).toBeInTheDocument();
  });

  it('goes to corresponding steps', async () => {
    const { getByText, queryByText, getAllByText } = render(getLandForm(true));
    await wait(() => {
      fireEvent.click(getByText(/continue/i));
    });
    expect(getByText(/Strategic Real Estate Classification/i)).toBeInTheDocument();
    await wait(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getAllByText(/Net Book Value/i)).toHaveLength(2);
    await wait(() => {
      fireEvent.click(getByText(/Continue/i));
    });
    expect(getByText(/Review your land info/i)).toBeInTheDocument();
    expect(queryByText(/continue/i)).toBeNull();
  });

  it('Displays a reminder on the classification form if the classification is changed and there is at least one building', async () => {
    const { getByText, container } = render(
      getLandForm(false, { ...defaultInitialValues, buildings: [{} as any] }),
    );
    await wait(() => {
      fireEvent.click(getByText(/continue/i));
    });
    expect(getByText(/Strategic Real Estate Classification/i)).toBeInTheDocument();
    await fillInput(container, 'data.classificationId', '1', 'select');
    screen.getByText('Land Classification Changed');
  });

  it('Does not display a reminder on the classification form if the classification is changed and there are no buildings', async () => {
    const { getByText, container } = render(
      getLandForm(false, { ...defaultInitialValues, buildings: [] }),
    );
    await wait(() => {
      fireEvent.click(getByText(/continue/i));
    });
    expect(getByText(/Strategic Real Estate Classification/i)).toBeInTheDocument();
    await fillInput(container, 'data.classificationId', '1', 'select');
    expect(screen.queryByText('Land Classification Changed')).toBeNull();
  });

  it('review has appropriate subforms', async () => {
    const { getByText } = render(getLandForm());
    await wait(() => {
      fireEvent.click(getByText(/Review/i));
    });
    expect(getByText(/parcel identification/i)).toBeInTheDocument();
    expect(getByText(/usage/i)).toBeInTheDocument();
    expect(getByText(/valuation/i)).toBeInTheDocument();
  });
});
