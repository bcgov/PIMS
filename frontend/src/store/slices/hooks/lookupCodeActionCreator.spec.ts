import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import * as MOCK from 'mocks/dataMocks';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { getFetchLookupCodeAction } from 'store/slices/hooks/lookupCodeActionCreator';
import * as lookupSlice from 'store/slices/lookupCodeSlice';
import * as networkSlice from 'store/slices/networkSlice';

import { initialLookupCodeState } from '..';

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);
const store = mockStore(initialLookupCodeState);

const dispatchSpy = jest.spyOn(store, 'dispatch');
const requestSpy = jest.spyOn(networkSlice, 'storeRequest');
const successSpy = jest.spyOn(networkSlice, 'storeSuccess');
const errorSpy = jest.spyOn(networkSlice, 'storeError');
const storeLookupCodesSpy = jest.spyOn(lookupSlice, 'storeLookupCodes');

beforeEach(() => {
  mockAxios.reset();
  dispatchSpy.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
  storeLookupCodesSpy.mockClear();
});

describe('getFetchLookupCodeAction action creator', () => {
  it('gets all codes when paramaters contains all', () => {
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all')).reply(200, mockResponse);
    return getFetchLookupCodeAction()(store.dispatch)
      .then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
        expect(errorSpy).toHaveBeenCalledTimes(0);
        expect(storeLookupCodesSpy).toHaveBeenCalledTimes(1);
      })
      .catch(() => {
        fail('it should not reach here');
      });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    mockAxios.onGet(ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all')).reply(400, MOCK.ERROR);
    return getFetchLookupCodeAction()(store.dispatch)
      .then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
        expect(successSpy).toHaveBeenCalledTimes(0);
        expect(storeLookupCodesSpy).toHaveBeenCalledTimes(0);
      })
      .catch(() => {
        fail('it should not reach here');
      });
  });
});
