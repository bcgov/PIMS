import {
  fetchBuildingDetail,
  createParcel,
  updateParcel,
  deleteParcel,
} from './parcelsActionCreator';
import { IBuildingDetailParams } from './../constants/API';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { fetchParcelDetail, fetchParcels } from 'actionCreators/parcelsActionCreator';
import * as genericActions from 'actions/genericActions';
import * as API from 'constants/API';
import { IPropertySearchParams, IParcelDetailParams } from 'constants/API';
import * as MOCK from 'mocks/dataMocks';
import { ENVIRONMENT } from 'constants/environment';

const dispatch = jest.fn();
const requestSpy = jest.spyOn(genericActions, 'request');
const successSpy = jest.spyOn(genericActions, 'success');
const errorSpy = jest.spyOn(genericActions, 'error');
const mockAxios = new MockAdapter(axios);

beforeEach(() => {
  mockAxios.reset();
  dispatch.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
});

describe('fetchParcels action creator', () => {
  it('Null Params - Request successful, dispatches `success` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.PROPERTIES(null);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchParcels(null)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request successful, dispatches `success` with correct response', () => {
    const params: IPropertySearchParams = {
      neLatitude: 1,
      neLongitude: 2,
      swLatitude: 3,
      swLongitude: 4,
      address: null,
      agencies: null,
      classificationId: null,
      administrativeArea: null,
      minLandArea: null,
      maxLandArea: null,
      projectNumber: null,
      inSurplusPropertyProgram: false,
    };
    const url = ENVIRONMENT.apiUrl + API.PROPERTIES(params);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchParcels(params)(dispatch)!.then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const params: IPropertySearchParams = {
      neLatitude: 1,
      neLongitude: 2,
      swLatitude: 3,
      swLongitude: 4,
      address: null,
      agencies: null,
      classificationId: null,
      administrativeArea: null,
      minLandArea: null,
      maxLandArea: null,
      projectNumber: null,
      inSurplusPropertyProgram: false,
    };
    const url = ENVIRONMENT.apiUrl + API.PROPERTIES(params);
    mockAxios.onGet(url).reply(400, MOCK.ERROR);
    return fetchParcels(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});
describe('fetchParcelDetail action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const params: IParcelDetailParams = { id: 1 };
    const url = ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchParcelDetail(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const params: IParcelDetailParams = { id: 1 };
    const url = ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params);
    mockAxios.onGet(url).reply(400, MOCK.ERROR);
    return fetchParcelDetail(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('fetchBuildingDetail action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const params: IBuildingDetailParams = { id: 1 };
    const url = ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchBuildingDetail(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const params: IParcelDetailParams = { id: 1 };
    const url = ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params);
    mockAxios.onGet(url).reply(400, MOCK.ERROR);
    return fetchBuildingDetail(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('fetchPropertyDetail action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const params: any = { id: 1, propertyTypeId: 0, position: [0, 0] };
    const url = ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchParcelDetail(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request successful, dispatches `success` with correct response', () => {
    const params: any = { id: 1, propertyTypeId: 0, position: [0, 0] };
    const url = ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchBuildingDetail(params)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });
});

describe('createParcel action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.PARCEL_ROOT;
    const mockResponse = { data: { success: true } };
    mockAxios.onPost(url).reply(200, mockResponse);
    return createParcel({} as any)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request successful, dispatches `error` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.PARCEL_ROOT;
    mockAxios.onPost(url).reply(400, MOCK.ERROR);
    return createParcel({} as any)(dispatch).catch(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('updateParcel action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const parcel = { id: 1 } as any;
    const url = ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`;
    const mockResponse = { data: { success: true } };
    mockAxios.onPut(url).reply(200, mockResponse);
    return updateParcel(parcel)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request successful, dispatches `error` with correct response', () => {
    const parcel = { id: 1 } as any;
    const url = ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`;
    mockAxios.onPut(url).reply(400, MOCK.ERROR);
    return updateParcel(parcel)(dispatch).catch(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('deleteParcel action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const parcel = { id: 1 } as any;
    const url = ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`;
    const mockResponse = { data: { success: true } };
    mockAxios.onDelete(url).reply(200, mockResponse);
    return deleteParcel(parcel)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request successful, dispatches `error` with correct response', () => {
    const parcel = { id: 1 } as any;
    const url = ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`;
    mockAxios.onDelete(url).reply(400, MOCK.ERROR);
    return deleteParcel(parcel)(dispatch).catch(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});
