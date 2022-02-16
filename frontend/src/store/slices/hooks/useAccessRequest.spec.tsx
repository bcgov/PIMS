import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import * as MOCK from 'mocks/dataMocks';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { useAccessRequest } from 'store/slices/hooks/useAccessRequest';
import * as networkSlice from 'store/slices/networkSlice';

import { initialAccessRequestState } from '..';

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);
const store = mockStore(initialAccessRequestState);

const dispatchSpy = jest.spyOn(store, 'dispatch');
const requestSpy = jest.spyOn(networkSlice, 'request');
const successSpy = jest.spyOn(networkSlice, 'success');
const errorSpy = jest.spyOn(networkSlice, 'error');

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
        expect(dispatchSpy).toHaveBeenCalledTimes(6);
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
