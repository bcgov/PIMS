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
import PidPinForm from './subforms/PidPinForm';
import { render, fireEvent, wait } from '@testing-library/react';
import { act as domAct } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { mockDetails } from 'mocks/filterDataMock';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { fillInput } from 'utils/testUtils';
import { FiscalKeys } from 'constants/fiscalKeys';
import { LatLng } from 'leaflet';

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
  clickLatLng: LatLng | undefined = undefined,
  loadDraft: boolean = true,
) => (
  <Provider store={store}>
    <Router history={history}>
      <ParcelDetailForm
        agencyId={1}
        clickLatLng={clickLatLng}
        parcelDetail={null}
        secret="test"
        loadDraft={loadDraft}
      />
    </Router>
  </Provider>
);
describe('ParcelDetailForm', () => {
  describe('field validation', () => {
    const exampleData = {
      projectNumber: '',
      agencyId: 1,
      address: {
        line1: 'addressval',
        cityId: '1',
        provinceId: '2222',
        postal: 'V8X3L5',
      },
      description: '',
      landLegalDescription: '',
      pin: 5,
      zoning: 'zoningVal',
      zoningPotential: 'zoningPotentialVal',
      municipality: 'municipalityVal',
      landArea: 1234,
      statusId: 1,
      classificationId: '1',
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
          key: FiscalKeys.Estimated,
          value: 1,
        },
      ],
      financials: [],
    };

    it('ParcelDetailForm renders correctly', () => {
      act(() => {
        const tree = renderer
          .create(
            <Provider store={store}>
              <Router history={history}>
                <ParcelDetailForm secret="test" agencyId={1} parcelDetail={mockDetails[0]} />
              </Router>
            </Provider>,
          )
          .toJSON();
        expect(tree).toMatchSnapshot();
      });
    });

    it('validates all required fields correctly', async () => {
      const { getByText, getAllByText } = render(parcelDetailForm());
      const submit = getByText('Submit');
      await wait(() => {
        fireEvent.click(submit!);
      });
      const errors = getAllByText('Required');
      const idErrors = getAllByText('pid or pin Required');
      expect(errors).toHaveLength(9);
      expect(idErrors).toHaveLength(2);
    });

    it('submits all basic fields correctly', async done => {
      const form = render(parcelDetailForm());
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
      await fillInput(container, 'financials.0.value', exampleData.evaluations[0].value);
      // await fillInput(container, 'financials.1.date', exampleData.evaluations[1].date);
      // TODO: add a function capable of filling this type of field
      await fillInput(container, 'financials.2.value', exampleData.fiscals[0].value);
      await fillInput(container, 'financials.3.value', exampleData.fiscals[1].value);
      const mockAxios = new MockAdapter(axios);
      const submit = form.getByText('Submit');
      mockAxios.onPost().reply(config => {
        expect(JSON.parse(config.data)).toEqual(exampleData);
        done();
        return [200, Promise.resolve(config.data)];
      });

      await wait(() => {
        fireEvent.click(submit!);
      });
    });
    it('displays a top level error message if submit fails', async done => {
      jest.unmock('formik');
      const formik = require('formik');
      formik.validateYupSchema = jest.fn(() => Promise.resolve({}));
      const { getByText, findByText, container } = render(parcelDetailForm());
      const mockAxios = new MockAdapter(axios);
      const submit = getByText('Submit');
      mockAxios.onPost().reply(() => {
        throw Error('test message');
      });

      await fillInput(container, 'financials.0.value', exampleData.evaluations[0].value);
      await fillInput(container, 'financials.2.value', exampleData.fiscals[0].value);
      await fillInput(container, 'financials.3.value', exampleData.fiscals[1].value);
      await wait(() => {
        fireEvent.click(submit!);
      });
      await findByText('Error');
      done();
    });
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
              agencyId={1}
              parcelDetail={mockDetails[0]}
            />
          </Router>
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('loads click lat lng', () => {
    const { container } = render(parcelDetailForm(new LatLng(1, 2)));
    const latitude = container.querySelector('input[name="latitude"]');
    const longitude = container.querySelector('input[name="longitude"]');
    expect(latitude).toHaveValue(1);
    expect(longitude).toHaveValue(2);
  });

  it('loads appropriate cities/provinces in dropdown for address form', () => {
    const addrForm = mount(parcelDetailForm()).find(AddressForm);
    expect(addrForm.text()).toContain('test city');
    expect(addrForm.text()).toContain('test province');
  });

  // Currently leaves an ugly warning but passes test
  it('provides appropriate specifications to add a new building', () => {
    const component = mount(parcelDetailForm());
    const addBuilding = component
      .find('[className="pagedBuildingButton page-link btn btn-link"]')
      .first();
    act(() => {
      addBuilding.simulate('click');
    });

    const buildingForm = component.find(BuildingForm);
    expect(buildingForm).toHaveLength(1);
    expect(buildingForm.text()).toContain('construction test type');
    expect(buildingForm.text()).toContain('predominate use test type');
    expect(buildingForm.text()).toContain('occupent type test');
  });

  it('pidpin form renders', () => {
    expect(mount(parcelDetailForm()).find(PidPinForm)).toHaveLength(1);
  });
});

describe('autosave functionality', () => {
  const persistFormData = async () => {
    const { container } = render(parcelDetailForm());
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
    const { container: updatedContainer } = render(parcelDetailForm());
    const address = updatedContainer.querySelector('input[name="address.line1"]');
    expect(address).toHaveValue('mockaddress');
  });

  it('autosaved form details generate a modal window', async () => {
    await persistFormData();
    const { getByText, container } = render(parcelDetailForm(undefined, false));
    const draftButton = getByText('Resume Editing');
    domAct(() => {
      draftButton.click();
    });
    const address = container.querySelector('input[name="address.line1"]');
    expect(address).toHaveValue('mockaddress');
  });

  it('a mismatched encryption key causes no form details to load.', async () => {
    await persistFormData();
    const differentKey = (
      <Provider store={store}>
        <Router history={history}>
          <ParcelDetailForm agencyId={1} parcelDetail={null} secret="invalid" loadDraft={true} />
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
          <ParcelDetailForm agencyId={1} parcelDetail={mockDetails[0]} secret="invalid" />
        </Router>
      </Provider>
    );

    const { container: updatedContainer } = render(updateForm);
    const address = updatedContainer.querySelector('input[name="address.line1"]');
    expect(address).not.toHaveValue('mockaddress');
  });
});
