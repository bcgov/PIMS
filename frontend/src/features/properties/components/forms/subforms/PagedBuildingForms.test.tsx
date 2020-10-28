import React from 'react';
import renderer, { act } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as API from 'constants/API';
import * as reducerTypes from 'constants/reducerTypes';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { mockDetails } from 'mocks/filterDataMock';
import { Formik } from 'formik';
import PagedBuildingForms from './PagedBuildingForms';
import { IFormParcel, getInitialValues } from '../ParcelDetailForm';
import { IFormBuilding } from './BuildingForm';
import { ILookupCode } from 'actions/lookupActions';
import _ from 'lodash';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);
mockAxios.onAny().reply(200, {});

const history = createMemoryHistory();
const mockBuilding: IFormBuilding = {
  address: {
    line1: 'line1',
    postal: 'postal',
    provinceId: '2',
    administrativeArea: 'administrativeArea',
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
  classificationId: 16,
  leaseExpiry: '2020-01-01',
  projectNumber: 'projectNumber',
};

const lCodes = {
  lookupCodes: [
    {
      name: 'test administrative area',
      id: '1',
      isDisabled: false,
      type: API.AMINISTRATIVE_AREA_CODE_SET_NAME,
    },
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

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  [reducerTypes.LOOKUP_CODE]: lCodes,
});

describe('PagedBuildingForms functionality', () => {
  afterEach(() => {
    cleanup();
  });
  const getPagedBuildingForms = (initialValues: IFormParcel, onSubmit: any) => {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <PagedBuildingForms allowEdit={true}></PagedBuildingForms>
          </Formik>
        </Router>
      </Provider>
    );
  };
  it('displays any pre-existing buildings', () => {
    const initialValues: IFormParcel = {
      ...mockDetails[0],
      financials: [],
      buildings: [mockBuilding],
    };
    const pagedBuildingForms = getPagedBuildingForms(initialValues, () => {});
    const tree = renderer.create(pagedBuildingForms).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays a page for each building', () => {
    const initialValues: IFormParcel = {
      ...mockDetails[0],
      financials: [],
      buildings: [mockBuilding, mockBuilding, mockBuilding],
    };

    const pagedBuildingForms = getPagedBuildingForms(initialValues, () => {});
    const { getAllByLabelText } = render(pagedBuildingForms);
    expect(getAllByLabelText('Page 1 is your current page')[0]).toBeVisible();
    expect(getAllByLabelText('Page 2')[0]).toBeVisible();
    expect(getAllByLabelText('Page 3')[0]).toBeVisible();
  });

  it('adds a building when add building clicked', () => {
    const pagedBuildingForms = getPagedBuildingForms(getInitialValues(), () => {});
    const { getByText, getByTitle } = render(pagedBuildingForms);
    act(() => {
      fireEvent.click(getByTitle('Add Building'));
    });
    expect(getByText('Type of Construction')).toBeVisible(); //validate that at least one of the building forms fields is displaying.
    expect(getByText('Building Information')).toBeVisible(); //the building header is hidden until one building is present.
  });

  it('removes a pre-existing building after user confirms modal', () => {
    const initialValues: IFormParcel = {
      ...mockDetails[0],
      financials: [],
      buildings: [mockBuilding],
    };
    const pagedBuildingForms = getPagedBuildingForms(initialValues, () => {});
    const { getByTitle, queryByText, getByText } = render(pagedBuildingForms);
    act(() => {
      fireEvent.click(getByTitle('Remove Building'));
    });
    expect(queryByText('Confirmation of removal')).toBeInTheDocument();
    act(() => {
      fireEvent.click(getByText('Delete'));
    });
    expect(queryByText('Type of Construction')).not.toBeInTheDocument(); //validate that no building fields are being displayed
    expect(queryByText('Building Information')).not.toBeInTheDocument(); //the building header is hidden as no buildings are present.
  });

  it('displays the building at a given page on click', () => {
    const mockBuildingTwo = _.clone(mockBuilding);
    mockBuildingTwo.projectNumber = 'building 2';
    const initialValues: IFormParcel = {
      ...mockDetails[0],
      financials: [],
      buildings: [mockBuilding, mockBuildingTwo],
    };

    const pagedBuildingForms = getPagedBuildingForms(initialValues, () => {});
    const { getByDisplayValue, getAllByLabelText } = render(pagedBuildingForms);

    act(() => {
      fireEvent.click(getAllByLabelText('Page 2')[0]);
    });
    expect(getByDisplayValue(mockBuildingTwo.projectNumber)).toBeVisible();
  });
});
