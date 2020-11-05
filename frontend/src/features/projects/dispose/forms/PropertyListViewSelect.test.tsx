import React from 'react';
import renderer from 'react-test-renderer';
import * as reducerTypes from 'constants/reducerTypes';
import { createMemoryHistory } from 'history';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { IFilterBarState } from '../../common/components/FilterBar';
import { useFormikContext, getIn } from 'formik';
import { PropertyListViewSelect } from '../../common/components/PropertyListViewSelect';
import { useKeycloak } from '@react-keycloak/web';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';

jest.mock('formik');
(useFormikContext as jest.Mock).mockReturnValue({
  setFieldValue: jest.fn(),
});

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: [1],
    },
    subject: 'test',
  },
});

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
      assessed: 1,
      assessedDate: '2020-01-01T00:00:00',
      administrativeArea: 'Alert Bay',
      classification: 'Core Operational',
      classificationId: 0,
      constructionTypeId: 0,
      description: '',
      estimated: 0,
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

(getIn as jest.Mock).mockReturnValue(testData.items);

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
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.NETWORK]: {},
  [reducerTypes.ProjectReducers.PROJECT]: {
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

const getComponent = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <PropertyListViewSelect
          setPageIndex={setPageIndex}
          pageIndex={0}
          filter={filter}
          field="properties"
        />
      </Router>
    </Provider>
  );
};

describe('Property List View Select', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders correctly', () => {
    const tree = renderer.create(getComponent()).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('removes property from project', async () => {
    const { container, queryByText, getByText } = render(getComponent());
    expect(queryByText('Test, Alert Bay')).toBeInTheDocument();
    const checkbox = container.querySelector('input[title="Toggle Row Selected"]');
    const remove = getByText('Remove Selected');
    await wait(() => {
      fireEvent.click(checkbox!);
    });
    await wait(() => {
      fireEvent.click(remove!);
    });
    expect(queryByText('Test, Alert Bay')).toBeNull();
  });
});
