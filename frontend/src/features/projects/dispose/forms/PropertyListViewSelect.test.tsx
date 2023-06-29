import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { ILookupCode } from 'actions/ILookupCode';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import Claims from 'constants/claims';
import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { noop } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import useKeycloakMock from 'useKeycloakWrapperMock';

import { IFilterBarState } from '../../common/components/FilterBar';
import { PropertyListViewSelect } from '../../common/components/PropertyListViewSelect';

const userRoles: string[] | Claims[] = [];
const userAgencies: number[] = [1];
const userAgency: number = 1;

jest.mock('hooks/useKeycloakWrapper');
(useKeycloakWrapper as jest.Mock).mockReturnValue(
  new (useKeycloakMock as any)(userRoles, userAgencies, userAgency),
);

const mockAxios = new MockAdapter(axios);

const filter: IFilterBarState = {
  pid: '',
  address: '',
  agencies: '',
  classificationId: '',
  maxLotSize: '',
  minLotSize: '',
  administrativeArea: '',
  projectNumber: '',
  searchBy: 'address',
};

const testData = {
  items: [
    {
      address: 'Test, Alert Bay',
      addressId: 1,
      agency: 'agencyVal',
      agencyCode: 'AEST',
      agencyId: 1,
      appraised: 0,
      assessedLand: 1,
      assessedLandDate: '2020-01-01T00:00:00',
      administrativeArea: 'Alert Bay',
      classification: 'Core Operational',
      classificationId: 0,
      constructionTypeId: 0,
      description: '',
      market: 0,
      floorCount: 0,
      id: 1,
      isSensitive: false,
      landArea: 123,
      landLegalDescription: '',
      latitude: 48.42538763146778,
      longitude: -123.39006198220181,
      netBook: 1,
      netBookFiscalYear: 2020,
      occupantTypeId: 0,
      pid: '213-221-321',
      postal: '',
      predominateUseId: 0,
      propertyTypeId: 0,
      province: 'British Columbia',
      rentableArea: 0,
      transferLeaseOnSale: false,
      zoning: '',
      zoningPotential: '',
    },
  ],
  total: 1,
};

mockAxios.onGet().reply(200, testData);

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: 1, isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
  ] as ILookupCode[],
};

const store = mockStore({
  lookupCode: lCodes,
  network: {},
  project: {
    project: {
      name: '',
      note: '',
      description: '',
      properties: [],
      tierLevelId: 1,
      statusId: 1,
      agencyId: 0,
      tasks: [],
      fiscalYear: 2020,
    },
  },
});

const setPageIndex = jest.fn().mockReturnValue(0);

describe('Property List View Select', () => {
  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = false;
  });
  afterEach(() => {
    cleanup();
  });

  it('renders correctly', () => {
    //act(() => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Formik initialValues={{ properties: testData.items }} onSubmit={noop}>
            <PropertyListViewSelect
              setPageIndex={setPageIndex}
              pageIndex={0}
              filter={filter}
              field="properties"
            />
          </Formik>
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
    //});
  });

  it('removes property from project', () => {
    const { container, queryByText, getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[history.location]}>
          <Formik initialValues={{ properties: testData.items }} onSubmit={noop}>
            <PropertyListViewSelect
              setPageIndex={setPageIndex}
              pageIndex={0}
              filter={filter}
              field="properties"
            />
          </Formik>
        </MemoryRouter>
      </Provider>,
    );
    const checkbox = container.querySelector('input[title="Toggle Row Selected"]');
    const remove = getByText('Remove Selected');
    //act(() => {
    waitFor(() => {
      expect(queryByText('Test, Alert Bay')).toBeInTheDocument();
    });

    waitFor(() => fireEvent.click(checkbox!));
    waitFor(() => fireEvent.click(remove!));

    waitFor(() => {
      expect(queryByText('Test, Alert Bay')).toBeNull();
    });
    //});
  });
});
