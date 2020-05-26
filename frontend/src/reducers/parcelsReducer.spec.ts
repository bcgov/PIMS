import parcelsReducer, { IParcelState } from 'reducers/parcelsReducer';
import {
  IStoreParcelsAction,
  IStoreParcelDetail,
  IProperty,
  IParcelDetail,
} from 'actions/parcelsActions';
import * as ActionTypes from 'constants/actionTypes';
import { cloneDeep } from 'lodash';

const baseExpectedValue: IParcelState = {
  parcels: [],
  parcelDetail: null,
  pid: 0,
};

// Creates deep copy of javascript object instead of setting a reference
const getBaseExpectedValue = () => cloneDeep(baseExpectedValue);
const defaultParcel: IProperty = {
  id: 1,
  propertyTypeId: 0,
  latitude: 2,
  longitude: 3,
};

const defaultParcelDetail: IParcelDetail = {
  propertyTypeId: 0,
  parcelDetail: {
    longitude: 1,
    latitude: 2,
    id: 3,
    address: {
      city: '4',
      line1: '5',
      line2: '6',
      postal: '7',
      province: '8',
    },
    buildings: [],
    evaluations: [],
    description: '10',
    landArea: '11',
    landLegalDescription: '12',
    pid: '13',
    isSensitive: false,
    classification: '14',
    propertyStatus: '15',
    agency: '16',
    pin: '17',
    classificationId: '18',
    statusId: '19',
    zoning: '20',
    zoningPotential: '21',
    agencyId: '22',
    municipality: '23',
    projectNumber: '24',
    fiscals: [
      {
        fiscalYear: 2020,
        key: 'Key',
        value: 'Value',
      },
    ],
  },
};

describe('parcelReducer', () => {
  it('receives an empty list of parcels', () => {
    const expectedValue = getBaseExpectedValue();
    const action: IStoreParcelsAction = {
      type: ActionTypes.STORE_PARCEL_RESULTS,
      parcelList: [],
    };

    const result = parcelsReducer(undefined, action);
    expect(result).toEqual(expectedValue);
  });

  it('receives parcels', () => {
    const expectedValue = getBaseExpectedValue();
    expectedValue.parcels.push(defaultParcel);

    const action: IStoreParcelsAction = {
      type: ActionTypes.STORE_PARCEL_RESULTS,
      parcelList: [defaultParcel],
    };

    const result = parcelsReducer(undefined, action);
    expect(result).toEqual(expectedValue);
  });

  it('receives multiple parcels', () => {
    const expectedValue = getBaseExpectedValue();
    expectedValue.parcels.push(defaultParcel);
    expectedValue.parcels.push(defaultParcel);

    const action: IStoreParcelsAction = {
      type: ActionTypes.STORE_PARCEL_RESULTS,
      parcelList: [defaultParcel, defaultParcel],
    };

    const result = parcelsReducer(undefined, action);
    expect(result).toEqual(expectedValue);
  });

  it('can reset the parcel list', () => {
    const expectedValue = getBaseExpectedValue();

    const action: IStoreParcelsAction = {
      type: ActionTypes.STORE_PARCEL_RESULTS,
      parcelList: [defaultParcel, defaultParcel],
    };

    const action2: IStoreParcelsAction = {
      type: ActionTypes.STORE_PARCEL_RESULTS,
      parcelList: [],
    };

    let result = parcelsReducer(undefined, action);
    result = parcelsReducer(result, action2);
    expect(result).toEqual(expectedValue);
  });

  it('can receive parcelDetails', () => {
    const expectedValue = getBaseExpectedValue();
    expectedValue.parcelDetail = defaultParcelDetail;

    const action: IStoreParcelDetail = {
      type: ActionTypes.STORE_PARCEL_DETAIL,
      parcelDetail: defaultParcelDetail,
    };

    const result = parcelsReducer(undefined, action);
    expect(result).toEqual(expectedValue);
  });
});
