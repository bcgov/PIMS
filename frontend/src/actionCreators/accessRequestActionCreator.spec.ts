import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import * as genericActions from 'actions/genericActions';
import * as API from 'constants/API';
import * as MOCK from 'mocks/dataMocks';
import { ENVIRONMENT } from 'constants/environment';
import {
  getCurrentAccessRequestAction,
  getSubmitAdminAccessRequestAction,
  getAccessRequestsAction,
  getAccessRequestsDeleteAction,
  getSubmitAccessRequestAction,
} from './accessRequestActionCreator';

const dispatch = jest.fn();
const requestSpy = jest.spyOn(genericActions, 'request');
const successSpy = jest.spyOn(genericActions, 'success');
const errorSpy = jest.spyOn(genericActions, 'error');
const mockAxios = new MockAdapter(axios);

afterEach(() => {
  mockAxios.reset();
  dispatch.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
});

describe('getCurrentAccessRequestAction action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS();
    const mockResponse = { data: { success: true } };
    mockAxios.onGet(url).reply(200, mockResponse);
    return getCurrentAccessRequestAction()(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS();
    mockAxios.onGet(url).reply(400, MOCK.ERROR);
    return getCurrentAccessRequestAction()(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('getSubmitAccessRequestAction action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const accessRequest = { id: 0 } as any;
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS();
    const mockResponse = { data: { success: true } };

    mockAxios.onPost(url).reply(200, mockResponse);
    return getSubmitAccessRequestAction(accessRequest)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const accessRequest = { id: 0 } as any;
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS();
    mockAxios.onPost(url).reply(400, MOCK.ERROR);
    return getSubmitAccessRequestAction(accessRequest)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('getSubmitAdminAccessRequestAction action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const accessRequest = { id: 0 } as any;
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN();
    const mockResponse = { data: { success: true } };

    mockAxios.onPut(url).reply(200, mockResponse);
    return getSubmitAdminAccessRequestAction(accessRequest)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const accessRequest = { id: 0 } as any;
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN();
    mockAxios.onPut(url).reply(400, MOCK.ERROR);
    return getSubmitAdminAccessRequestAction(accessRequest)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('getAccessRequestsAction action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST({} as any);
    const mockResponse = { data: { success: true } };

    mockAxios.onGet(url).reply(200, mockResponse);
    return getAccessRequestsAction({} as any)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(6);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST({} as any);
    mockAxios.onGet(url).reply(400, MOCK.ERROR);
    return getAccessRequestsAction({} as any)(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});

describe('getAccessRequestsDeleteAction action creator', () => {
  it('Request successful, dispatches `success` with correct response', () => {
    const id = 1;
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id);
    const mockResponse = { data: { success: true } };

    mockAxios.onDelete(url).reply(200, mockResponse);
    return getAccessRequestsDeleteAction(
      id,
      {} as any,
    )(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(5);
    });
  });

  it('Request failure, dispatches `error` with correct response', () => {
    const id = 1;
    const url = ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id);
    mockAxios.onDelete(url).reply(400, MOCK.ERROR);
    return getAccessRequestsDeleteAction(
      id,
      {} as any,
    )(dispatch).then(() => {
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(4);
    });
  });
});
