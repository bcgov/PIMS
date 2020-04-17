import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import ParcelDetailForm from './ParcelDetailForm';
import { ILookupCode } from 'actions/lookupActions';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { useKeycloak } from '@react-keycloak/web';
import * as reducerTypes from 'constants/reducerTypes';
import AddressForm from './subforms/AddressForm';
import BuildingForm from './subforms/BuildingForm';
import EvaluationForm from './subforms/EvaluationForm';
import PidPinForm from './subforms/PidPinForm';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

Enzyme.configure({ adapter: new Adapter() });
jest.mock('lodash/debounce', () => jest.fn(fn => fn));

const mockStore = configureMockStore([thunk]);
const history = createMemoryHistory();

jest.mock('@react-keycloak/web');
(useKeycloak as jest.Mock).mockReturnValue({
  keycloak: {
    userInfo: {
      agencies: ['1'],
    },
  },
});

const lCodes = {
  lookupCodes: [
    { name: 'agencyVal', id: '1', isDisabled: false, type: API.AGENCY_CODE_SET_NAME },
    { name: 'roleVal', id: '1', isDisabled: false, type: API.ROLE_CODE_SET_NAME },
    { name: 'test city', id: '1', isDisabled: false, type: API.CITY_CODE_SET_NAME },
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
});

const parcelDetailForm = (
  <Provider store={store}>
    <Router history={history}>
      <ParcelDetailForm updateLatLng={() => {}} agencyId={1} parcelId={0} secret="test" />
    </Router>
  </Provider>
);
describe('ParcelDetailForm', () => {
  describe('field validation', () => {
    const exampleData = {
      pid: '',
      agencyId: 1,
      address: {
        line1: 'addressval',
        cityId: 1,
        provinceId: '2222',
        postal: 'V8X3L5',
      },
      description: '',
      landLegalDescription: '',
      pin: '5',
      zoning: 'zoningVal',
      zoningPotential: 'zoningPotentialVal',
      municipality: 'municipalityVal',
      landArea: 1234,
      statusId: 1,
      classificationId: 1,
      isSensitive: false,
      latitude: 0,
      longitude: 0,
      evaluations: [],
      buildings: [],
    };
    const fillInput = async (
      container: HTMLElement,
      name: string,
      value: any,
      type: string = 'input',
    ) => {
      const input = container.querySelector(`${type}[name="${name}"]`);
      await wait(() => {
        if (type === 'input') {
          fireEvent.change(input!, {
            target: {
              value: value,
            },
          });
        } else {
          fireEvent.change(input!, {
            target: {
              value: value,
            },
          });
        }
      });
    };
    it('validates all required fields correctly', async () => {
      const form = render(parcelDetailForm);
      const submit = form.getByText('Submit');
      await wait(() => {
        fireEvent.click(submit!);
      });
      const errors = form.getAllByText('Required');
      const idErrors = form.getAllByText('pid or pin Required');
      expect(errors).toHaveLength(6);
      expect(idErrors).toHaveLength(2);
    });

    it('submits all basic fields correctly', async done => {
      const form = render(parcelDetailForm);
      const container = form.container;
      await fillInput(container, 'pin', exampleData.pin);
      await fillInput(container, 'municipality', exampleData.municipality);
      await fillInput(container, 'zoning', exampleData.zoning);
      await fillInput(container, 'zoningPotential', exampleData.zoningPotential);
      await fillInput(container, 'address.cityId', exampleData.address.cityId.toString(), 'select');
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
      const mockAxios = new MockAdapter(axios);
      const submit = form.getByText('Submit');

      mockAxios.onPost().reply(config => {
        expect(config.data).toEqual(JSON.stringify(exampleData));
        done();
        return [200, Promise.resolve()];
      });

      await wait(() => {
        fireEvent.click(submit!);
      });
    });
  });

  it('ParcelDetailForm renders correctly', () => {
    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <Provider store={store}>
          <Router history={history}>
            <ParcelDetailForm secret="test" updateLatLng={() => {}} agencyId={1} parcelId={0} />
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

it('ParcelDetailForm renders view-only correctly', () => {
  const history = createMemoryHistory();
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router history={history}>
          <ParcelDetailForm
            disabled={true}
            secret="test"
            updateLatLng={() => {}}
            agencyId={1}
            parcelId={0}
          />
        </Router>
      </Provider>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

  it('loads appropriate cities/provinces in dropwdown for address form', () => {
    const addrForm = mount(parcelDetailForm).find(AddressForm);
    expect(addrForm.text()).toContain('test city');
    expect(addrForm.text()).toContain('test province');
  });

  // Currently leaves an ugly warning but passes test
  it('provides appropriate specifications to add a new building', () => {
    const component = mount(parcelDetailForm);
    const addBuilding = component.find('[className="addBuilding btn btn-primary"]');
    act(() => {
      addBuilding.simulate('click');
    });

    const buildingForm = component.find(BuildingForm);
    expect(buildingForm).toHaveLength(1);
    expect(buildingForm.text()).toContain('construction test type');
    expect(buildingForm.text()).toContain('predominate use test type');
    expect(buildingForm.text()).toContain('occupent type test');
  });

  it('add evaluation button will display appropriate form', () => {
    const component = mount(parcelDetailForm);
    const addEval = component.find('[className="addEval btn btn-primary"]');
    act(() => {
      addEval.simulate('click');
    });

    const evalForm = component.find(EvaluationForm);
    expect(evalForm).toHaveLength(1);
  });

  it('pidpin form renders', () => {
    expect(mount(parcelDetailForm).find(PidPinForm)).toHaveLength(1);
  });
  describe('autosave functionality', () => {
    const persistFormData = async () => {
      const { container } = render(parcelDetailForm);
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
      const { container: updatedContainer } = render(parcelDetailForm);
      const address = updatedContainer.querySelector('input[name="address.line1"]');
      expect(address).toHaveValue('mockaddress');
    });

    it('a mismatched encryption key causes no form details to load.', async () => {
      await persistFormData();
      const differentKey = (
        <Provider store={store}>
          <Router history={history}>
            <ParcelDetailForm updateLatLng={() => {}} agencyId={1} parcelId={0} secret="invalid" />
          </Router>
        </Provider>
      );

      const { container: updatedContainer } = render(differentKey);
      const address = updatedContainer.querySelector('input[name="address.line1"]');
      expect(address).not.toHaveValue('mockaddress');
    });

    it('no data is loaded if this is an update or view', async () => {
      await persistFormData();
      const updateForm = (
        <Provider store={store}>
          <Router history={history}>
            <ParcelDetailForm updateLatLng={() => {}} agencyId={1} parcelId={1} secret="invalid" />
          </Router>
        </Provider>
      );

      const { container: updatedContainer } = render(updateForm);
      const address = updatedContainer.querySelector('input[name="address.line1"]');
      expect(address).not.toHaveValue('mockaddress');
    });
  });
});
