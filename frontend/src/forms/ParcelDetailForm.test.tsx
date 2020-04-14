import React from 'react';
import renderer from 'react-test-renderer';
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
import LandForm from './subforms/LandForm';
import PidPinForm from './subforms/PidPinForm';
import { render, getByText, fireEvent, act, wait } from '@testing-library/react';

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

it('loads appropriate cities/provinces in dropwdown for address form', () => {
  const addrForm = mount(parcelDetailForm).find(AddressForm);
  expect(addrForm.text()).toContain('test city');
  expect(addrForm.text()).toContain('test province');
});

// Currently leaves an ugly warning but passes test
it('provides appropriate specifications to add a new building', () => {
  const component = mount(parcelDetailForm);
  const addBuilding = component.find('[className="addBuilding btn btn-primary"]');
  addBuilding.simulate('click');
  const buildingForm = component.find(BuildingForm);
  expect(buildingForm).toHaveLength(1);
  expect(buildingForm.text()).toContain('construction test type');
  expect(buildingForm.text()).toContain('predominate use test type');
  expect(buildingForm.text()).toContain('occupent type test');
});

it('add evaluation button will display appropriate form', () => {
  const component = mount(parcelDetailForm);
  const addEval = component.find('[className="addEval btn btn-primary"]');
  addEval.simulate('click');
  const evalForm = component.find(EvaluationForm);
  expect(evalForm).toHaveLength(1);
});

it('contains appropriate classifcations to add to land', () => {
  const landForm = mount(parcelDetailForm).find(LandForm);
  expect(landForm).toHaveLength(1);
  expect(landForm.text()).toContain('classification test');
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
