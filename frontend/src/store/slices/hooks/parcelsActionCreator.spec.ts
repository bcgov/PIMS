import {
  fetchBuildingDetail,
  createParcel,
  updateParcel,
  deleteParcel,
  fetchParcelDetail,
  fetchParcels,
} from './parcelsActionCreator';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import * as networkSlice from 'store/slices/networkSlice';
import * as API from 'constants/API';
import { IPropertySearchParams, IParcelDetailParams } from 'constants/API';
import * as MOCK from 'mocks/dataMocks';
import { ENVIRONMENT } from 'constants/environment';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { initialParcelState } from 'store/slices/parcelSlice';
import * as parcelSlice from 'store/slices/parcelSlice';

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);
const store = mockStore(initialParcelState);

const dispatchSpy = jest.spyOn(store, 'dispatch');
const requestSpy = jest.spyOn(networkSlice, 'request');
const successSpy = jest.spyOn(networkSlice, 'success');
const errorSpy = jest.spyOn(networkSlice, 'error');
const storePropertiesSpy = jest.spyOn(parcelSlice, 'storeProperties');
const storeDraftPropertiesSpy = jest.spyOn(parcelSlice, 'storeDraftProperties');
const storePropertyDetailSpy = jest.spyOn(parcelSlice, 'storePropertyDetail');
const storeAssociatedPropertyDetailSpy = jest.spyOn(parcelSlice, 'storeAssociatedPropertyDetail');
const storePidSpy = jest.spyOn(parcelSlice, 'storePid');

beforeEach(() => {
  mockAxios.reset();
  dispatchSpy.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
  storePropertiesSpy.mockClear();
  storeDraftPropertiesSpy.mockClear();
  storePropertyDetailSpy.mockClear();
  storeAssociatedPropertyDetailSpy.mockClear();
  storePidSpy.mockClear();
});

describe('Parcel action tests', () => {
  describe('fetchParcels tests', () => {
    const filter: IPropertySearchParams = {
      neLatitude: 1,
      neLongitude: 2,
      swLatitude: 3,
      swLongitude: 4,
      address: undefined,
      agencies: undefined,
      classificationId: undefined,
      administrativeArea: undefined,
      minLandArea: undefined,
      maxLandArea: undefined,
      projectNumber: undefined,
      inSurplusPropertyProgram: false,
    };

    it('Null Params - Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.PROPERTIES(null)).reply(200, mockResponse);
      return fetchParcels(null)(store.dispatch).then(() => {
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertiesSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.PROPERTIES(filter)).reply(200, mockResponse);
      return fetchParcels(filter)(store.dispatch)!.then(() => {
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertiesSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.PROPERTIES(filter)).reply(400, MOCK.ERROR);
      return fetchParcels(filter)(store.dispatch).catch(() => {
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(storePropertiesSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('fetchParcelDetail action creator', () => {
    const filter: IParcelDetailParams = { id: 1 };

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(filter)).reply(200, mockResponse);
      return fetchParcelDetail(filter)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(filter)).reply(400, MOCK.ERROR);
      return fetchParcelDetail(filter)(store.dispatch).catch(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('fetchBuildingDetail action creator', () => {
    const params: IParcelDetailParams = { id: 1 };

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params)).reply(200, mockResponse);
      return fetchBuildingDetail(params)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params)).reply(400, MOCK.ERROR);
      return fetchBuildingDetail(params)(store.dispatch).catch(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('fetchPropertyDetail action creator', () => {
    const params: any = { id: 1, propertyTypeId: 0, position: [0, 0] };

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params)).reply(200, mockResponse);
      return fetchParcelDetail(params)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params)).reply(200, mockResponse);
      return fetchBuildingDetail(params)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('createParcel action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.PARCEL_ROOT).reply(200, mockResponse);
      return createParcel({} as any)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request successful, dispatches `error` with correct response', () => {
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.PARCEL_ROOT).reply(400, MOCK.ERROR);
      return createParcel({} as any)(store.dispatch).catch(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('updateParcel action creator', () => {
    const parcel = { id: 1 } as any;

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios
        .onPut(ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`)
        .reply(200, mockResponse);
      return updateParcel(parcel)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request successful, dispatches `error` with correct response', () => {
      mockAxios
        .onPut(ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`)
        .reply(400, MOCK.ERROR);
      return updateParcel(parcel)(store.dispatch).catch(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('deleteParcel action creator', () => {
    const parcel = { id: 1 } as any;

    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios
        .onDelete(ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`)
        .reply(200, mockResponse);
      return deleteParcel(parcel)(store.dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('Request successful, dispatches `error` with correct response', () => {
      mockAxios
        .onDelete(ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`)
        .reply(400, MOCK.ERROR);
      return deleteParcel(parcel)(store.dispatch).catch(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(storePropertyDetailSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
