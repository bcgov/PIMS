import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import * as networkSlice from 'store/slices/networkSlice';
import * as API from 'constants/API';
import * as MOCK from 'mocks/dataMocks';
import { ENVIRONMENT } from 'constants/environment';
import { useAccessRequest } from 'store/slices/hooks/useAccessRequest';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialAccessRequestState } from '..';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import React from 'react';

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);
const store = mockStore(initialAccessRequestState);

const dispatchSpy = jest.spyOn(store, 'dispatch');
const requestSpy = jest.spyOn(networkSlice, 'storeRequest');
const successSpy = jest.spyOn(networkSlice, 'storeSuccess');
const errorSpy = jest.spyOn(networkSlice, 'storeError');

const Wrapper = ({ children }: any) => <Provider store={store}>{children}</Provider>;

beforeEach(() => {
  mockAxios.reset();
  dispatchSpy.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
});

describe('Access Request hook tests', () => {
  const {
    result: {
      current: {
        getCurrentAccessRequestAction,
        getAccessRequestsAction,
        getAccessRequestsDeleteAction,
        getSubmitAccessRequestAction,
        getSubmitAdminAccessRequestAction,
      },
    },
  } = renderHook(() => useAccessRequest(), {
    wrapper: Wrapper,
  });

  describe('getCurrentAccessRequestAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS()).reply(200, mockResponse);
      return getCurrentAccessRequestAction().then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS()).reply(400, MOCK.ERROR);
      return getCurrentAccessRequestAction().then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getSubmitAccessRequestAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const accessRequest = { id: 0 } as any;
      const mockResponse = { data: { success: true } };

      mockAxios.onPost(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS()).reply(200, mockResponse);
      return getSubmitAccessRequestAction(accessRequest).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const accessRequest = { id: 0 } as any;
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS()).reply(400, MOCK.ERROR);
      return getSubmitAccessRequestAction(accessRequest).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getSubmitAdminAccessRequestAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const accessRequest = { id: 0 } as any;
      const mockResponse = { data: { success: true } };

      mockAxios.onPut(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN()).reply(200, mockResponse);
      return getSubmitAdminAccessRequestAction(accessRequest).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const accessRequest = { id: 0 } as any;
      mockAxios.onPut(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN()).reply(400, MOCK.ERROR);
      return getSubmitAdminAccessRequestAction(accessRequest).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getAccessRequestsAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const mockResponse = { data: { success: true } };

      mockAxios
        .onGet(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST({} as any))
        .reply(200, mockResponse);
      return getAccessRequestsAction({} as any).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      mockAxios
        .onGet(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST({} as any))
        .reply(400, MOCK.ERROR);
      return getAccessRequestsAction({} as any).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getAccessRequestsDeleteAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const id = 1;
      const mockResponse = { data: { success: true } };

      mockAxios
        .onDelete(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id))
        .reply(200, mockResponse);
      return getAccessRequestsDeleteAction(id, {} as any).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(5);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const id = 1;
      mockAxios.onDelete(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id)).reply(400, MOCK.ERROR);
      return getAccessRequestsDeleteAction(id, {} as any).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(4);
      });
    });
  });
});
