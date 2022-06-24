import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import { IUser } from 'interfaces';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as networkSlice from 'store/slices/networkSlice';
import * as userSlice from 'store/slices/userSlice';

import { initialUserState } from '..';
import {
  fetchUserDetail,
  getActivateUserAction,
  getUpdateUserAction,
  getUsersAction,
  getUsersPaginationAction,
} from './usersActionCreator';

const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore([thunk]);
const store = mockStore(initialUserState);

const dispatchSpy = jest.spyOn(store, 'dispatch');
const requestSpy = jest.spyOn(networkSlice, 'storeRequest');
const successSpy = jest.spyOn(networkSlice, 'storeSuccess');
const errorSpy = jest.spyOn(networkSlice, 'storeError');
const storeUsersSpy = jest.spyOn(userSlice, 'storeUsers');
const storeUserSpy = jest.spyOn(userSlice, 'storeUser');
const updateUserSpy = jest.spyOn(userSlice, 'updateUser');

beforeEach(() => {
  mockAxios.reset();
  dispatchSpy.mockClear();
  requestSpy.mockClear();
  successSpy.mockClear();
  errorSpy.mockClear();
  storeUsersSpy.mockClear();
  storeUserSpy.mockClear();
  updateUserSpy.mockClear();
});

describe('User action tests', () => {
  describe('getActivateUserAction tests', () => {
    it('Request successful, dispatch success', async () => {
      const mockResponse = { data: { success: true } };
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.ACTIVATE_USER()).reply(200, mockResponse);

      await getActivateUserAction()(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(5);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
    });

    it('Request failure, dispatch error', async () => {
      const mockResponse = {};
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.ACTIVATE_USER()).reply(500, mockResponse);

      await getActivateUserAction()(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUsersAction tests', () => {
    const filter: API.IPaginateParams = {
      page: 1,
    };

    it('Request successful, dispatch success, store response', async () => {
      const mockResponse = { data: {} };
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.POST_USERS(), filter).reply(200, mockResponse);

      await getUsersAction(filter)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(6);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(storeUsersSpy).toHaveBeenCalledTimes(1);
    });

    it('Request failure, dispatch error', async () => {
      const mockResponse = {};
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.POST_USERS(), filter).reply(500, mockResponse);

      await getUsersAction(filter)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(storeUsersSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('getUsersPaginationAction tests', () => {
    const filter: API.IGetUsersParams = {
      page: 1,
    };

    it('Request successful, dispatch success, store response', async () => {
      const mockResponse = { data: {} };
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.POST_USERS(), filter).reply(200, mockResponse);

      await getUsersPaginationAction(filter)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(requestSpy).toHaveBeenCalledTimes(0);
      expect(successSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(storeUsersSpy).toHaveBeenCalledTimes(1);
    });

    it('Request failure, dispatch error', async () => {
      const mockResponse = {};
      mockAxios.onPost(ENVIRONMENT.apiUrl + API.POST_USERS(), filter).reply(500, mockResponse);

      await getUsersPaginationAction(filter)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(3);
      expect(requestSpy).toHaveBeenCalledTimes(0);
      expect(successSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(storeUsersSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('fetchUserDetail tests', () => {
    const filter: API.IUserDetailParams = {
      id: '',
    };

    it('Request successful, dispatch success, store response', async () => {
      const mockResponse = { data: {} };
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.USER_DETAIL(filter)).reply(200, mockResponse);

      await fetchUserDetail(filter)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(6);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(storeUserSpy).toHaveBeenCalledTimes(1);
    });

    it('Request failure, dispatch error', async () => {
      const mockResponse = {};
      mockAxios.onGet(ENVIRONMENT.apiUrl + API.USER_DETAIL(filter)).reply(500, mockResponse);

      await fetchUserDetail(filter)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(storeUserSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('getUpdateUserAction tests', () => {
    const filter: API.IUserDetailParams = {
      id: '',
    };
    const user: IUser = {
      id: '',
    };

    it('Request successful, dispatch success, store response', async () => {
      const mockResponse = { data: {} };
      mockAxios
        .onPut(ENVIRONMENT.apiUrl + API.KEYCLOAK_USER_UPDATE(filter), user)
        .reply(200, mockResponse);

      await getUpdateUserAction(filter, user)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(6);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledTimes(0);
      expect(updateUserSpy).toHaveBeenCalledTimes(1);
    });

    it('Request failure, dispatch error', async () => {
      const mockResponse = {};
      mockAxios
        .onPut(ENVIRONMENT.apiUrl + API.KEYCLOAK_USER_UPDATE(filter), user)
        .reply(500, mockResponse);

      await getUpdateUserAction(filter, user)(store.dispatch);
      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(0);
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(updateUserSpy).toHaveBeenCalledTimes(0);
    });
  });
});
