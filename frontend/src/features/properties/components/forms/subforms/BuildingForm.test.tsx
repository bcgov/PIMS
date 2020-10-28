import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import BuildingForm, { defaultBuildingValues } from './BuildingForm';
import { render, fireEvent, wait, cleanup } from '@testing-library/react';
import { fillInput } from 'utils/testUtils';
import { Formik, Form } from 'formik';
import { IFormBuilding } from './BuildingForm';
import { ILookupCode } from 'actions/lookupActions';
import * as YupSchema from 'utils/YupSchema';
import { Button } from 'components/common/form';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});

const mockBuilding: IFormBuilding = {
  address: {
    cityId: 1,
    line1: 'line1',
    postal: 'v8x3P5',
    provinceId: '2',
    city: 'city',
    province: 'province',
  },
  name: 'name',
  classification: 'class',
  agencyId: 3,
  buildingConstructionTypeId: 4,
  buildingFloorCount: 5,
  buildingOccupantTypeId: 6,
  buildingPredominateUseId: 7,
  buildingTenancy: 'buildingTenancy',
  description: 'description',
  evaluations: [],
  financials: [],
  fiscals: [],
  id: 8,
  latitude: 9,
  longitude: 10,
  localId: 'localId',
  occupantName: 'occupantName',
  parcelId: 11,
  rentableArea: 12,
  transferLeaseOnSale: true,
  buildingConstructionType: '13',
  buildingOccupantType: '14',
  buildingPredominateUse: '15',
  leaseExpiry: '2020-01-01',
  projectNumber: 'projectNumber',
  classificationId: 16,
};

const lCodes = {
  lookupCodes: [
    {
      name: 'test aDministrative area',
      id: '1',
      isDisabled: false,
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
    {
      name: 'test province',
      id: mockBuilding.address.provinceId,
      isDisabled: false,
      type: API.PROVINCE_CODE_SET_NAME,
    },
    {
      name: 'construction test type',
      id: mockBuilding.buildingConstructionTypeId,
      isDisabled: false,
      type: API.CONSTRUCTION_CODE_SET_NAME,
    },
    {
      name: 'predominate use test type',
      id: mockBuilding.buildingPredominateUseId,
      isDisabled: false,
      type: API.PREDOMINATE_USE_CODE_SET_NAME,
    },
    {
      name: 'occupent type test',
      id: mockBuilding.buildingOccupantTypeId,
      isDisabled: false,
      type: API.OCCUPANT_TYPE_CODE_SET_NAME,
    },
    {
      name: 'classification test',
      id: mockBuilding.classificationId,
      isDisabled: false,
      type: API.PROPERTY_CLASSIFICATION_CODE_SET_NAME,
    },
  ] as ILookupCode[],
};

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

describe('sub-form BuildingForm functionality', () => {
  afterEach(() => {
    cleanup();
  });
  const getBuildingForm = (initialValues: IFormBuilding, onSubmit: any) => {
    return (
      <Provider store={store}>
        <Formik
          initialValues={initialValues as any}
          onSubmit={onSubmit}
          validationSchema={YupSchema.Building}
        >
          {formikProps => (
            <Form>
              <BuildingForm {...formikProps}></BuildingForm>
              <Button type="submit">Submit</Button>
            </Form>
          )}
        </Formik>
      </Provider>
    );
  };
  it('loads initial building data', () => {
    const pagedBuildingForms = getBuildingForm(mockBuilding, () => {});
    const tree = renderer.create(pagedBuildingForms).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders EvaluationForm as expected', () => {
    const { getAllByText } = render(getBuildingForm(defaultBuildingValues, () => {}));
    expect(getAllByText('Value')).toHaveLength(2);
  });

  it('validates all required fields', async () => {
    const { getByText, getAllByText } = render(getBuildingForm(defaultBuildingValues, () => {}));
    const submit = getByText('Submit');
    await wait(() => {
      fireEvent.click(submit!);
    });
    const errors = await getAllByText('Required');
    expect(errors).toHaveLength(10);
  });

  xit('submits all required field values', async done => {
    const validateSubmit = (values: any) => {
      expect(values).toEqual(mockBuilding);
    };
    const form = render(getBuildingForm(mockBuilding, validateSubmit));
    const container = form.container;
    await fillInput(
      container,
      'address.administrativeArea',
      Number(mockBuilding.address.administrativeArea),
    );
    await fillInput(container, 'address.line1', mockBuilding.address.line1);
    await fillInput(container, 'address.provinceId', mockBuilding.address.provinceId, 'select');

    await fillInput(
      container,
      'buildingConstructionTypeId',
      mockBuilding.buildingConstructionTypeId,
      'select',
    );
    await fillInput(container, 'buildingFloorCount', mockBuilding.buildingFloorCount);
    await fillInput(
      container,
      'buildingOccupantTypeId',
      mockBuilding.buildingOccupantTypeId,
      'select',
    );
    await fillInput(
      container,
      'buildingPredominateUseId',
      mockBuilding.buildingPredominateUseId,
      'select',
    );

    await fillInput(container, 'name', mockBuilding.name);
    await fillInput(container, 'description', mockBuilding.description, 'textArea');
    await fillInput(container, 'latitude', mockBuilding.latitude);
    await fillInput(container, 'longitude', mockBuilding.longitude);
    await fillInput(container, 'occupantName', mockBuilding.occupantName);
    await fillInput(container, 'rentableArea', mockBuilding.rentableArea);
    await fillInput(container, 'buildingTenancy', mockBuilding.buildingTenancy);
    const submit = form.getByText('Submit');

    await wait(() => {
      fireEvent.click(submit!);
    });
    done();
  });
});
