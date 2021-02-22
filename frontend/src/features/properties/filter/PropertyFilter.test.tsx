import React from 'react';
import renderer from 'react-test-renderer';
import { render, wait, fireEvent, cleanup } from '@testing-library/react';
import { PropertyFilter } from './';
import * as MOCK from 'mocks/filterDataMock';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import { IGeoSearchParams } from 'constants/API';
import { createMemoryHistory } from 'history';
import { IPropertyFilter } from './IPropertyFilter';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import * as reducerTypes from 'constants/reducerTypes';
import { fetchPropertyNames } from 'actionCreators/propertyActionCreator';
import { ILookupCode } from 'actions/lookupActions';
import * as API from 'constants/API';

const onFilterChange = jest.fn<void, [IPropertyFilter]>();
//prevent web calls from being made during tests.
jest.mock('axios');
jest.mock('@react-keycloak/web');
jest.mock('actionCreators/propertyActionCreator');

(fetchPropertyNames as any).mockImplementation(jest.fn(() => () => ['test']));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockKeycloak = (claims: string[]) => {
  (useKeycloak as jest.Mock).mockReturnValue({
    keycloak: {
      subject: 'test',
      userInfo: {
        roles: claims,
        agencies: ['1'],
      },
    },
  });
};
const mockStore = configureMockStore([thunk]);
let history = createMemoryHistory();

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
    {
      name: 'Demolished',
      id: '5',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
    {
      name: 'Subdivided',
      id: '6',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const getStore = (filter: any) =>
  mockStore({
    [reducerTypes.FILTER]: filter,
    [reducerTypes.PROPERTY_NAMES]: ['test'],
    [reducerTypes.LOOKUP_CODE]: lCodes,
  });

const defaultFilter: IPropertyFilter = {
  searchBy: 'name',
  pid: '',
  address: '',
  administrativeArea: '',
  propertyType: '',
  projectNumber: '',
  agencies: '',
  classificationId: '',
  minLotSize: '',
  maxLotSize: '',
  rentableArea: '',
  name: '',
};

const getUiElement = (filter: IPropertyFilter) => (
  <Provider store={getStore(filter)}>
    <Router history={history}>
      <PropertyFilter
        defaultFilter={filter}
        agencyLookupCodes={MOCK.AGENCIES}
        adminAreaLookupCodes={MOCK.ADMINISTRATIVEAREAS}
        onChange={onFilterChange}
        showAllAgencySelect={true}
      />
    </Router>
  </Provider>
);

describe('MapFilterBar', () => {
  afterEach(() => {
    cleanup();
  });

  mockedAxios.get.mockImplementationOnce(() => Promise.resolve({}));

  beforeEach(() => {
    history = createMemoryHistory();
    mockKeycloak([]);
  });
  it('renders correctly', () => {
    mockKeycloak(['property-view']);
    // Capture any changes
    const tree = renderer.create(getUiElement(defaultFilter)).toJSON();
    expect(tree).toMatchSnapshot();
  });

  xit('submits correct values', async () => {
    // Arrange
    mockKeycloak(['admin-properties']);

    const { container } = render(getUiElement(defaultFilter));
    const address = container.querySelector('input[name="address"]');
    const agencies = container.querySelector('input[name="agencies"]');
    const classificationId = container.querySelector('select[name="classificationId"]');
    const minLotSize = container.querySelector('input[name="minLotSize"]');
    const maxLotSize = container.querySelector('input[name="maxLotSize"]');
    const inSurplusPropertyProgram = container.querySelector(
      'input[name="inSurplusPropertyProgram"]',
    );
    const submit = container.querySelector('button[type="submit"]');

    // Act
    // Enter values on the form fields, then click the Search button
    await wait(() => {
      fireEvent.change(address!, {
        target: {
          value: 'mockaddress',
        },
      });
    });

    await wait(() => {
      fireEvent.change(agencies!, {
        target: {
          value: '2',
        },
      });
    });

    await wait(() => {
      fireEvent.change(classificationId!, {
        target: {
          value: '0',
        },
      });
    });

    await wait(() => {
      fireEvent.change(minLotSize!, {
        target: {
          value: '1',
        },
      });
    });

    await wait(() => {
      fireEvent.change(maxLotSize!, {
        target: {
          value: '3',
        },
      });
    });

    await wait(() => {
      fireEvent.click(inSurplusPropertyProgram!);
    });

    await wait(() => {
      fireEvent.click(submit!);
    });

    // Assert
    expect(onFilterChange).toBeCalledWith<[IGeoSearchParams]>({
      pid: 'mockPid',
      address: 'mockaddress',
      administrativeArea: 'mockAdministrativeArea',
      projectNumber: '',
      agencies: '2',
      classificationId: 0,
      minLandArea: 1,
      maxLandArea: 3,
      inSurplusPropertyProgram: true,
    });
  });

  it('loads filter values if provided', () => {
    const providedFilter: IPropertyFilter = {
      pid: 'mockPid',
      searchBy: 'address',
      address: 'mockaddress',
      administrativeArea: 'mockAdministrativeArea',
      projectNumber: '',
      agencies: '2',
      classificationId: '0',
      minLotSize: '10',
      maxLotSize: '20',
      inSurplusPropertyProgram: true,
      rentableArea: '0',
    };
    const { getByText } = render(getUiElement(providedFilter));
    expect(getByText('Address')).toBeVisible();
    expect(getByText('Core Operational')).toBeVisible();
  });

  it('disables the property name and agencies fields when All Government is selected', () => {
    const { container, getByPlaceholderText } = render(
      getUiElement({ ...defaultFilter, includeAllProperties: true }),
    );
    expect(getByPlaceholderText('Property name')).toBeDisabled();
    expect(container.querySelector('input[name="agencies"]')).toBeDisabled();
  });

  it('enables the property name and agencies fields when My Agencies is selected', () => {
    const { container, getByPlaceholderText } = render(
      getUiElement({ ...defaultFilter, includeAllProperties: false }),
    );
    expect(getByPlaceholderText('Property name')).not.toBeDisabled();
    expect(container.querySelector('input[name="agencies"]')).not.toBeDisabled();
  });
});
