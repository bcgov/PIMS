import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { fetchParcelDetail, fetchParcels } from 'actionCreators/parcelsActionCreator';
import * as genericActions from 'actions/genericActions';
import * as API from 'constants/API';
import { IParcelListParams, IParcelDetailParams } from 'constants/API';
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
    const url = ENVIRONMENT.apiUrl + API.PARCELS(null);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchParcels(null)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request successful, dispatches `success` with correct response', () => {
    const params: IParcelListParams = {
      neLatitude: 1,
      neLongitude: 2,
      swLatitude: 3,
      swLongitude: 4,
      address: null,
      agencies: null,
      classificationId: null,
      municipality: null,
      minLandArea: null,
      maxLandArea: null,
    };
    const url = ENVIRONMENT.apiUrl + API.PARCELS(params);
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return fetchParcels(params)(dispatch)!.then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const params: IParcelListParams = {
      neLatitude: 1,
      neLongitude: 2,
      swLatitude: 3,
      swLongitude: 4,
      address: null,
      agencies: null,
      classificationId: null,
      municipality: null,
      minLandArea: null,
      maxLandArea: null,
    };
    const url = ENVIRONMENT.apiUrl + API.PARCELS(params);
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
