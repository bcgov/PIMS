import { AxiosError, AxiosResponse } from 'axios';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import * as reducerTypes from 'constants/reducerTypes';
import * as pimsToasts from 'constants/toasts';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { AnyAction, Dispatch } from 'redux';
import {
  saveAgencies,
  storeError,
  storeRequest,
  storeSuccess,
  storeUser,
  storeUsers,
  updateUser,
} from 'store';
import { handleAxiosResponse } from 'utils/utils';

import { error, request, success } from '.';

const userToasts: LifecycleToasts = {
  loadingToast: pimsToasts.user.USER_UPDATING,
  successToast: pimsToasts.user.USER_UPDATED,
  errorToast: pimsToasts.user.USER_ERROR,
};

export const getActivateUserAction = () => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(storeRequest(request(actionTypes.ADD_ACTIVATE_USER)));
  dispatch(showLoading());
  return await CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.ACTIVATE_USER(), null)
    .then((response: AxiosResponse) => {
      dispatch(storeSuccess(success(actionTypes.ADD_ACTIVATE_USER, response.status)));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(
        storeError(error(actionTypes.ADD_ACTIVATE_USER, axiosError?.response?.status, axiosError)),
      ),
    )
    .finally(() => dispatch(hideLoading()));
};

export const getUsersAction =
  (params: API.IPaginateParams) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(storeRequest(request(actionTypes.GET_USERS)));
    dispatch(showLoading());
    return await CustomAxios()
      .post(ENVIRONMENT.apiUrl + API.POST_USERS(), params)
      .then((response: AxiosResponse) => {
        dispatch(storeSuccess(success(actionTypes.GET_USERS, response.status)));
        dispatch(storeUsers(response.data));
        dispatch(hideLoading());
      })
      .catch((axiosError: AxiosError) =>
        dispatch(
          storeError(error(actionTypes.GET_USERS, axiosError?.response?.status, axiosError)),
        ),
      )
      .finally(() => dispatch(hideLoading()));
  };

export const getUsersPaginationAction =
  (params: API.IGetUsersParams) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(showLoading());
    return await CustomAxios()
      .post(ENVIRONMENT.apiUrl + API.POST_USERS(), params)
      .then((response: AxiosResponse) => {
        dispatch(storeUsers(response.data));
      })
      .catch((axiosError: AxiosError) =>
        dispatch(
          storeError(error(actionTypes.GET_USERS, axiosError?.response?.status, axiosError)),
        ),
      )
      .finally(() => dispatch(hideLoading()));
  };

export const getRoles = async () => {
  let roles: string[] = [];
  try {
    roles = (
      await CustomAxios()
        .get('/api' + API.GET_KEYCLOAK_ROLES())
        .then((val) => val)
    ).data;
  } catch (e) {
    // TODO - add error handling -- not sure if having nested awaits is an issue....
  }
  roles = Object.values(roles).filter((s) => s.charAt(0) === s.charAt(0).toUpperCase());
  return roles;
};

export const getUserRoles = async (username: string | undefined) => {
  let roles: string[] = [];
  try {
    roles = (
      await CustomAxios()
        .get('/api' + API.GET_USER_ROLES(username))
        .then((val) => val)
    ).data;
  } catch (e) {
    // TODO - add error handling -- not sure if having nested awaits is an issue....
  }
  roles = Object.values(roles).filter((s) => s.charAt(0) === s.charAt(0).toUpperCase());
  return roles.toString();
};

export const fetchUserDetail =
  (id: API.IUserDetailParams) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(storeRequest(request(reducerTypes.GET_USER_DETAIL)));
    dispatch(showLoading());
    // GET /api/admin/users/${id}
    return await CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.USER_DETAIL(id))
      .then((response: AxiosResponse) => {
        dispatch(storeSuccess(success(reducerTypes.GET_USER_DETAIL)));
        dispatch(storeUser(response.data));
        dispatch(saveAgencies(response.data));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(storeError(error(reducerTypes.GET_USER_DETAIL))))
      .finally(() => dispatch(hideLoading()));
  };

export const fetchUserAgencies =
  (username: API.IUserAgenciesParams) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(storeRequest(request(reducerTypes.GET_USER_AGENCIES)));
    dispatch(showLoading());
    return await CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.USERS_AGENCIES(username))
      .then((response: AxiosResponse) => {
        dispatch(storeSuccess(success(reducerTypes.GET_USER_AGENCIES)));
        dispatch(saveAgencies(response.data ?? []));
        dispatch(hideLoading());
      })
      .catch(() => dispatch(storeError(error(reducerTypes.GET_USER_AGENCIES))))
      .finally(() => dispatch(hideLoading()));
  };

// TODO: Fix any
export const getUpdateUserAction =
  (id: API.IUserDetailParams, updatedUser: any) => async (dispatch: Dispatch<AnyAction>) => {
    const axiosPromise = CustomAxios({ lifecycleToasts: userToasts })
      .put(ENVIRONMENT.apiUrl + API.ADMIN_USER_UPDATE(id), updatedUser)
      .then((response: AxiosResponse) => {
        dispatch(updateUser(response.data));
        return Promise.resolve(response);
      });

    return await handleAxiosResponse(
      reducerTypes.PUT_USER_DETAIL,
      axiosPromise,
    )(dispatch).catch(() => {
      // swallow the exception, the error has already been displayed.
    });
  };

export const NEW_PIMS_USER = 201;
