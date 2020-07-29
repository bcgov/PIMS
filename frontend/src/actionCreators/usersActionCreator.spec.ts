import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import * as genericActions from 'actions/genericActions';
import * as API from 'constants/API';
import * as MOCK from 'mocks/dataMocks';
import { ENVIRONMENT } from 'constants/environment';
import {
  getActivateUserAction,
  getUsersAction,
  getUsersPaginationAction,
  fetchUserDetail,
  getUpdateUserAction,
} from './usersActionCreator';

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
describe('users action creator', () => {
  describe('getActivateUserAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const url = ENVIRONMENT.apiUrl + API.ACTIVATE_USER();
      const mockResponse = { data: { success: true } };
      mockAxios.onPost(url).reply(200, mockResponse);
      return getActivateUserAction()(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(5);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const url = ENVIRONMENT.apiUrl + API.ACTIVATE_USER();
      mockAxios.onPost(url).reply(400, MOCK.ERROR);
      return getActivateUserAction()(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getUsersAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const url = ENVIRONMENT.apiUrl + API.POST_USERS();
      const mockResponse = { data: { success: true } };
      mockAxios.onPost(url).reply(200, mockResponse);
      return getUsersAction({} as any)(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(6);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const url = ENVIRONMENT.apiUrl + API.POST_USERS();
      mockAxios.onPost(url).reply(400, MOCK.ERROR);
      return getUsersAction({} as any)(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getUsersPaginationAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const url = ENVIRONMENT.apiUrl + API.POST_USERS();
      const mockResponse = { data: { success: true } };
      mockAxios.onPost(url).reply(200, mockResponse);
      return getUsersPaginationAction({} as any)(dispatch).then(() => {
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const url = ENVIRONMENT.apiUrl + API.POST_USERS();
      mockAxios.onPost(url).reply(400, MOCK.ERROR);
      return getUsersPaginationAction({} as any)(dispatch).then(() => {
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('fetchUserDetail action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const id = 1;
      const url = ENVIRONMENT.apiUrl + API.USER_DETAIL({ id } as any);
      const mockResponse = { data: { success: true } };
      mockAxios.onGet(url).reply(200, mockResponse);
      return fetchUserDetail({ id } as any)(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(6);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const id = 1;
      const url = ENVIRONMENT.apiUrl + API.USER_DETAIL({ id } as any);
      mockAxios.onGet(url).reply(400, MOCK.ERROR);
      return fetchUserDetail({ id } as any)(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('getUpdateUserAction action creator', () => {
    it('Request successful, dispatches `success` with correct response', () => {
      const id = 1;
      const url = ENVIRONMENT.apiUrl + API.KEYCLOAK_USER_UPDATE({ id } as any);
      const mockResponse = { data: { success: true } };
      mockAxios.onPut(url).reply(200, mockResponse);
      return getUpdateUserAction(
        { id } as any,
        {},
      )(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(successSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(6);
      });
    });

    it('Request failure, dispatches `error` with correct response', () => {
      const id = 1;
      const url = ENVIRONMENT.apiUrl + API.USER_DETAIL({ id } as any);
      mockAxios.onGet(url).reply(400, MOCK.ERROR);
      return getUpdateUserAction(
        { id } as any,
        {},
      )(dispatch).then(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(4);
      });
    });
  });
});
