import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ParcelDetailFormContainer from '../../containers/ParcelDetailFormContainer';
import { ILookupCode } from 'actions/lookupActions';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { useKeycloak } from '@react-keycloak/web';
import * as reducerTypes from 'constants/reducerTypes';
import AddressForm from './subforms/AddressForm';
import PidPinForm from './subforms/PidPinForm';
import { render, fireEvent, wait, cleanup, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { act as domAct } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { mockDetails } from 'mocks/filterDataMock';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { fillInput, getInput } from 'utils/testUtils';
import { FiscalKeys } from 'constants/fiscalKeys';
import { useApi, PimsAPI } from 'hooks/useApi';
import { storeDraftParcelsAction, IProperty } from 'actions/parcelsActions';
import { updateParcel, deleteParcel } from 'actionCreators/parcelsActionCreator';
import ParcelDetailContainer, {
  ParcelDetailTabs,
} from 'features/properties/containers/ParcelDetailContainer';
import { noop } from 'lodash';
import { ToastContainer } from 'react-toastify';
import pretty from 'pretty';
import { Roles } from 'constants/roles';
import { useLayerQuery } from 'components/maps/leaflet/LayerPopup';

Enzyme.configure({ adapter: new Adapter() });
jest.mock('lodash/debounce', () => jest.fn(fn => fn));
jest.mock('actions/parcelsActions');
jest.mock('actionCreators/parcelsActionCreator');
jest.mock('components/maps/leaflet/LayerPopup');

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

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

// mock useApi hook - for geocoder integration tests
jest.mock('hooks/useApi');
((useApi as unknown) as jest.Mock<Partial<PimsAPI>>).mockReturnValue({
  isPidAvailable: async () => {
    return { available: true };
  },
  isPinAvailable: async () => {
    return { available: true };
  },
  getSitePids: async () => {
    return {
      siteId: '00000000-0000-0000-0000-000000000000',
      pids: ['123456789'],
    };
  },
  searchAddress: async () => {
    return [
      {
        siteId: '00000000-0000-0000-0000-000000000000',
        fullAddress: '525 Superior St, Victoria, BC',
        address1: '525 Superior St',
        administrativeArea: 'Victoria',
        latitude: 90,
        longitude: -90,
        provinceCode: 'BC',
        score: 83,
      },
    ];
  },
});

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME, code: 'TEST' },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    {
      name: 'administrativeArea',
      id: '1',
      isDisabled: false,
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
    {
      name: 'Victoria',
      id: '2',
      isDisabled: false,
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
    {
      name: 'The Corporation of the City of Victoria',
      id: '3',
      isDisabled: false,
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
    { name: 'test city', id: '1', isDisabled: false, type: API.AMINISTRATIVE_AREA_CODE_SET_NAME },
    { name: 'test province', id: '2222', isDisabled: false, type: API.PROVINCE_CODE_SET_NAME },
    {
      name: 'construction test type',
      id: '1',
      isDisabled: false,
      type: API.CONSTRUCTION_CODE_SET_NAME,
    },
    {
      name: 'predominate use test type',
      id: '1',
      isDisabled: false,
      type: API.PREDOMINATE_USE_CODE_SET_NAME,
    },
    {
      name: 'occupent type test',
      id: '1',
      isDisabled: false,
      type: API.OCCUPANT_TYPE_CODE_SET_NAME,
    },
    {
      name: 'classification test',
      id: '1',
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const store = mockStore({
  [reducerTypes.NETWORK]: {
    [actionTypes.ADD_PARCEL]: {
      status: 201,
    },
  },
  [reducerTypes.PARCEL]: { parcelDetail: {} },
  [reducerTypes.LOOKUP_CODE]: lCodes,
  [reducerTypes.PARCEL_LAYER_DATA]: {},
  [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
});

const parcelDetailForm = ({
  loadDraft,
  data,
  tab,
  disabled,
  properties,
  onDelete,
  storeOverride,
}: {
  loadDraft?: boolean;
  data?: any;
  tab?: ParcelDetailTabs;
  disabled?: boolean;
  properties?: IProperty[];
  onDelete?: () => void;
  storeOverride?: any;
}) => (
  <Provider store={storeOverride ?? store}>
    <Router history={history}>
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
      />
      <ParcelDetailContainer
        parcelDetail={data ?? null}
        disabled={disabled}
        loadDraft={loadDraft ?? true}
        onDelete={onDelete ?? noop}
        persistCallback={noop}
        properties={properties ?? []}
        defaultTab={tab}
        movingPinNameSpace={''}
      />
    </Router>
  </Provider>
);

describe('ParcelDetail Functionality', () => {
  let findOneWhereContains = jest.fn().mockReturnValue(Promise.resolve());
  let findByPid = jest.fn().mockReturnValue(Promise.resolve());
  let findByPin = jest.fn().mockReturnValue(Promise.resolve());
  beforeEach(() => {
    (useLayerQuery as jest.Mock).mockReturnValue({
      findOneWhereContains: findOneWhereContains,
      findByPid: findByPid,
      findByPin: findByPin,
    });
    (storeDraftParcelsAction as jest.Mock).mockReturnValue({ type: 'test' });
    findOneWhereContains.mockReset();
    findByPid.mockReset();
    findByPin.mockReset();
  });
  afterEach(() => {
    cleanup();
  });
  describe('parcel detail form actions', () => {
    beforeEach(() => {
      (deleteParcel as jest.Mock).mockResolvedValue({ type: 'test' });
      (storeDraftParcelsAction as jest.Mock).mockReturnValue({ type: 'test' });
      (useKeycloak as jest.Mock).mockReturnValue({
        keycloak: {
          userInfo: {
            agencies: ['1'],
            groups: [Roles.SYSTEM_ADMINISTRATOR],
            roles: ['admin-properties'],
          },
          subject: 'test',
        },
      });
    });
    it('Displays modal when delete button is clicked', async () => {
      const onDelete = jest.fn();
      const { findByTestId } = render(
        parcelDetailForm({ data: mockDetails[0], onDelete: onDelete }),
      );
      const deleteButton = await findByTestId('delete');

      await act(async () => {
        fireEvent.click(deleteButton);
        const modalDeleteButton = await screen.findByText('Delete');
        expect(modalDeleteButton).toBeVisible();
      });
    });
    it('Displays the cancel and save buttons when the edit button is clicked', async () => {
      const onDelete = jest.fn();
      const { getByText, getAllByText } = render(
        parcelDetailForm({ data: mockDetails[0], onDelete: onDelete, disabled: true }),
      );
      const editButton = getByText('Edit');

      fireEvent.click(editButton);
      expect(getAllByText('Cancel')[0]).toBeVisible();
      expect(getByText('Save')).toBeVisible();
    });
  });
  describe('field validation', () => {
    const exampleData = {
      id: 1,
      projectNumber: '',
      name: 'name',
      agencyId: 1,
      address: {
        line1: 'addressval',
        administrativeArea: 'administrativeArea',
        provinceId: '2222',
        postal: 'V8X 3L5',
      },
      description: '',
      landLegalDescription: '',
      pin: 5,
      zoning: 'zoningVal',
      zoningPotential: 'zoningPotentialVal',
      municipality: 'municipalityVal',
      landArea: 1234,
      classificationId: 1,
      isSensitive: false,
      latitude: 0,
      longitude: 0,
      evaluations: [
        {
          date: '2020-01-01',
          fiscalYear: 2020,
          year: 2020,
          key: EvaluationKeys.Assessed,
          value: 1,
        },
      ],
      buildings: [],
      fiscals: [
        {
          date: '',
          year: 2020,
          fiscalYear: 2020,
          key: FiscalKeys.NetBook,
          value: 1,
        },
        {
          date: '',
          year: 2020,
          fiscalYear: 2020,
          key: FiscalKeys.Market,
          value: 1,
        },
      ],
      financials: [],
    };

    it('ParcelDetailForm renders correctly', () => {
      act(() => {
        const { container } = render(
          <Provider store={store}>
            <Router history={history}>
              <ParcelDetailFormContainer
                agencyId={1}
                parcelDetail={mockDetails[0]}
                formikRef={undefined}
                persistCallback={noop}
              />
            </Router>
          </Provider>,
        );
        expect(pretty(container.innerHTML)).toMatchSnapshot();
      });
    });

    xit('properly renders EvaluationForm', () => {
      const { getByText, getAllByText } = render(parcelDetailForm({}));
      expect(getByText('Assessment Year')).toBeInTheDocument();
      expect(getByText('Assessed Building Value')).toBeInTheDocument();
      expect(getByText('Fiscal Year')).toBeInTheDocument();
      expect(getByText('Effective Date')).toBeInTheDocument();
      expect(getAllByText('Net Book Value')).toHaveLength(2);
    });

    xit('validates all required fields correctly', async () => {
      const { getByText, getAllByText } = render(parcelDetailForm({}));
      const submit = getByText('Submit');
      await wait(() => {
        fireEvent.click(submit!);
      });
      const errors = getAllByText('Required');
      const idErrors = getAllByText('PID must be in the format ###-###-###');
      expect(errors).toHaveLength(6);
      expect(idErrors).toHaveLength(1);
    });

    xit('detail submits all basic fields correctly', async () => {
      const form = render(
        parcelDetailForm({
          data: {
            id: 1,
            address: { cityId: 1 },
            buildings: [],
            evaluations: [],
            fiscals: [],
          },
        }),
      );
      const container = form.container;
      await fillInput(container, 'pin', exampleData.pin);
      await fillInput(container, 'name', exampleData.name);
      await fillInput(container, 'description', exampleData.description, 'textArea');
      await fillInput(container, 'zoning', exampleData.zoning);
      await fillInput(container, 'zoningPotential', exampleData.zoningPotential);
      await fillInput(
        container,
        'address.administrativeArea',
        exampleData.address.administrativeArea,
        'typeahead',
      );
      await fillInput(container, 'address.provinceId', exampleData.address.provinceId, 'select');
      await fillInput(container, 'address.postal', exampleData.address.postal);
      await fillInput(container, 'address.line1', exampleData.address.line1);
      await fillInput(
        container,
        'classificationId',
        exampleData.classificationId.toString(),
        'select',
      );

      await fillInput(container, 'latitude', exampleData.latitude);
      await fillInput(container, 'longitude', exampleData.longitude);
      await fillInput(container, 'landArea', exampleData.landArea);
      await fillInput(container, 'isSensitive', true, 'radio');

      const submit = form.getByText('Submit');
      await wait(() => {
        fireEvent.click(submit!);
      });
      expect(updateParcel).toHaveBeenCalledWith({
        id: 1,
        address: {
          id: 0,
          line2: undefined,
          province: undefined,
          administrativeArea: 'administrativeArea',
          cityId: 1,
          line1: 'addressval',
          postal: 'V8X 3L5',
          provinceId: '2222',
        },
        agencyId: '1',
        description: '',
        buildings: [],
        evaluations: [],
        fiscals: [],
        pid: undefined,
        pin: 5,
        projectNumber: '',
        financials: [],
        name: 'name',
        zoning: 'zoningVal',
        zoningPotential: 'zoningPotentialVal',
        classificationId: 1,
        latitude: 0,
        longitude: 0,
        landArea: 1234,
        isSensitive: true,
      });
    });

    xit('allows admin to change agency', async done => {
      const form = render(parcelDetailForm({}));
      const container = form.container;
      await fillInput(container, 'agencyId', 2);
      const mockAxios = new MockAdapter(axios);
      const submit = form.getByText('Submit');
      mockAxios.onPost().reply(config => {
        expect(JSON.parse(config.data)).toContain({ agencyId: 2 });
        return [200, Promise.resolve(config.data)];
      });
      await wait(() => {
        fireEvent.click(submit!);
      });
      done();
    });
  });

  it('ParcelDetailForm renders view-only correctly', () => {
    const { container } = render(parcelDetailForm({ data: mockDetails[0] }));

    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it('loads click lat lng', () => {
    const { container } = render(
      parcelDetailForm({
        storeOverride: mockStore({
          [reducerTypes.LOOKUP_CODE]: lCodes,
          [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
          [reducerTypes.LEAFLET_CLICK_EVENT]: {
            mapClickEvent: {
              originalEvent: null,
              latlng: { lat: 1, lng: 2 },
            },
          },
        }),
      }),
    );
    const latitude = container.querySelector('input[name="latitude"]');
    const longitude = container.querySelector('input[name="longitude"]');
    expect(latitude).toHaveValue(1);
    expect(longitude).toHaveValue(2);
  });

  it('loads appropriate provinces in dropdown for address form', () => {
    jest.useFakeTimers();
    domAct(() => {
      const addrForm = mount(parcelDetailForm({})).find(AddressForm);
      jest.runAllImmediates();
      expect(addrForm.text()).toContain('test province');
    });
  });

  // Currently leaves an ugly warning but passes test
  it('provides appropriate specifications to add a new building', async () => {
    const { getByTitle, findByText } = render(
      parcelDetailForm({ tab: ParcelDetailTabs.buildings }),
    );
    const addBuilding = getByTitle('Add Building');
    act(() => {
      fireEvent.click(addBuilding);
    });
    const buildingComponent = await findByText('Name');
    expect(buildingComponent).toBeVisible();
  });

  it('pidpin form renders', () => {
    jest.useFakeTimers();
    domAct(() => {
      expect(mount(parcelDetailForm({})).find(PidPinForm)).toHaveLength(1);
      jest.runAllImmediates();
    });
  });
  xit('integrates with geocoder endpoints', async () => {
    const { container, findByText } = render(parcelDetailForm({}));
    // type a civic address, then click on first suggestion
    await fillInput(container, 'address.line1', '525 Superior St');
    const suggestion = await findByText(/525 Superior St/);
    expect(suggestion).not.toBeNull();
    act(() => {
      fireEvent.click(suggestion);
    });
    await wait(() => {
      // assert --> PID value was set
      expect(getInput(container, 'pid')).toHaveValue('123-456-789');
      expect(findOneWhereContains).toHaveBeenCalled();
    });
  });
  it('calls parcel layer when pid updated', async () => {
    const { container } = render(parcelDetailForm({}));

    await act(async () => {
      await fillInput(container, 'pid', '123456789');
    });
    wait(() => {
      expect(getInput(container, 'pid')).toHaveValue('123-456-789');
      expect(findByPid).toHaveBeenCalled();
    });
  });
  it('calls parcel layer when pin updated', async () => {
    const { container } = render(parcelDetailForm({}));

    await act(async () => {
      await fillInput(container, 'pin', 987654321);
    });
    wait(() => {
      expect(getInput(container, 'pin')).toHaveValue('987654321');
      expect(findByPin).toHaveBeenCalled();
    });
  });
  describe('parcel layer data tests', () => {
    xit('parcel layer data is populated on parcel detail form', () => {
      const { getByDisplayValue } = render(
        parcelDetailForm({
          storeOverride: mockStore({
            parcelLayerData: { parcelLayerData: { e: null, data: { PID: '123456789' } } },
            [reducerTypes.LOOKUP_CODE]: lCodes,
            [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
          }),
        }),
      );

      expect(getByDisplayValue('123-456-789')).toBeVisible();
    });
    xit('parcel layer parses municipality with alternate structure', () => {
      const { getByDisplayValue } = render(
        parcelDetailForm({
          storeOverride: mockStore({
            parcelLayerData: {
              parcelLayerData: {
                e: null,
                data: {
                  PID: '123456789',
                  MUNICIPALITY: 'Victoria, The Corporation of the City of',
                },
              },
            },
            [reducerTypes.LOOKUP_CODE]: lCodes,
            [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
          }),
        }),
      );
      expect(getByDisplayValue('The Corporation of the City of Victoria')).toBeVisible();
    });
    xit('parcel layer  populates pid and pin', () => {
      const { getByDisplayValue, queryByDisplayValue } = render(
        parcelDetailForm({
          storeOverride: mockStore({
            parcelLayerData: {
              parcelLayerData: {
                e: null,
                data: {
                  PID: '123456789',
                  PIN: '987654321',
                },
              },
            },
            [reducerTypes.LOOKUP_CODE]: lCodes,
            [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
          }),
        }),
      );
      expect(getByDisplayValue('123-456-789')).toBeVisible();
      expect(queryByDisplayValue('987654321')).toBeVisible();
    });
    xit('parcel layer gets converted m2 value', () => {
      const { getByDisplayValue } = render(
        parcelDetailForm({
          storeOverride: mockStore({
            parcelLayerData: {
              parcelLayerData: {
                e: null,
                data: {
                  PID: '123456789',
                  FEATURE_AREA_SQM: '10000',
                },
              },
            },
            [reducerTypes.LOOKUP_CODE]: lCodes,
            [reducerTypes.PARCEL]: { parcels: [], draftParcels: [] },
          }),
        }),
      );
      expect(getByDisplayValue('1.00')).toBeVisible();
    });
  });
  describe('useDraftMarkerSynchronizer hook tests', () => {
    beforeEach(() => {
      (storeDraftParcelsAction as jest.Mock).mockReset();
      (storeDraftParcelsAction as jest.Mock).mockReturnValue({ type: 'test' });
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    it('will create draft markers based on the current form state', async () => {
      render(parcelDetailForm({ data: mockDetails[0] }));
      expect(storeDraftParcelsAction).toHaveBeenCalledWith([
        { latitude: 48, longitude: 123, name: 'test name', propertyTypeId: 2 },
      ]);
    });

    it('will not create draft markers if the current lat/lngs match what is displayed on the map', async () => {
      const { container } = render(
        parcelDetailForm({
          data: mockDetails[0],
          properties: [{ id: 0, latitude: 123, longitude: 456, propertyTypeId: 0 }],
        }),
      );
      await fillInput(container, 'latitude', '123');
      await fillInput(container, 'longitude', '456');
      expect(storeDraftParcelsAction).not.toHaveBeenCalledWith([
        { latitude: 123, longitude: 456, name: 'test name', propertyTypeId: 2 },
      ]);
    });
  });
});

describe('autosave functionality', () => {
  beforeEach(() => {
    (useKeycloak as jest.Mock).mockReturnValue({
      keycloak: {
        userInfo: {
          agencies: ['1'],
          roles: ['admin-properties'],
        },
        subject: 'test',
      },
    });
    (storeDraftParcelsAction as jest.Mock).mockReset();
    (storeDraftParcelsAction as jest.Mock).mockReturnValue({ type: 'test' });
  });
  const persistFormData = async () => {
    const { container } = render(parcelDetailForm({}));
    const address = container.querySelector('input[name="address.line1"]');

    await wait(() => {
      fireEvent.change(address!, {
        target: {
          value: 'mockaddress',
        },
      });
    });
  };
  it('form details are autosaved', async () => {
    await persistFormData();
    const { container: updatedContainer } = render(parcelDetailForm({}));
    const address = updatedContainer.querySelector('input[name="address.line1"]');
    expect(address).toHaveValue('mockaddress');
  });

  it('autosaved form details generate a modal window', async () => {
    await persistFormData();
    const { getByText, container } = render(parcelDetailForm({ loadDraft: false }));
    const draftButton = getByText('Resume Editing');
    domAct(() => {
      draftButton.click();
    });
    const address = container.querySelector('input[name="address.line1"]');
    expect(address).toHaveValue('mockaddress');
  });

  it('a mismatched encryption key causes no form details to load.', async () => {
    await persistFormData();
    (useKeycloak as jest.Mock).mockReturnValue({ keycloak: { subject: 'test2' } });
    const differentKey = parcelDetailForm({});

    const { container: updatedContainer } = render(differentKey);
    const address = updatedContainer.querySelector('input[name="address.line1"]');
    expect(address).not.toHaveValue('mockaddress');
  });

  it('no data is loaded if this is an update or view', async () => {
    await persistFormData();
    const updateForm = parcelDetailForm({ disabled: true });

    const { container: updatedContainer } = render(updateForm);
    const address = updatedContainer.querySelector('input[name="address.line1"]');
    expect(address).not.toHaveValue('mockaddress');
  });
});
