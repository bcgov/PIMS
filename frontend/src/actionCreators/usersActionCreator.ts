import { handleAxiosResponse } from './../utils/utils';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import * as adminActions from 'actions/adminActions';
import * as actionTypes from 'constants/actionTypes';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import * as pimsToasts from 'constants/toasts';

export const getActivateUserAction = () => (dispatch: Function) => {
  dispatch(request(actionTypes.ADD_ACTIVATE_USER));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.ACTIVATE_USER(), null)
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.ADD_ACTIVATE_USER, response.status));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.ADD_ACTIVATE_USER, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const getUsersAction = (params: API.IPaginateParams) => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_USERS));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.POST_USERS(), params)
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_USERS, response.status));
      dispatch(adminActions.storeUsers(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_USERS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const getUsersPaginationAction = (params: API.IGetUsersParams) => (dispatch: Function) => {
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.POST_USERS(), params)
    .then((response: AxiosResponse) => {
      dispatch(adminActions.storeUsers(response.data));
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_USERS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchUserDetail = (id: API.IUserDetailParams) => (dispatch: Function) => {
  dispatch(request(reducerTypes.GET_USER_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.USER_DETAIL(id))
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_USER_DETAIL));
      dispatch(adminActions.storeUserDetail(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_USER_DETAIL)))
    .finally(() => dispatch(hideLoading()));
};

const userToasts: LifecycleToasts = {
  loadingToast: pimsToasts.user.USER_UPDATING,
  successToast: pimsToasts.user.USER_UPDATED,
  errorToast: pimsToasts.user.USER_ERROR,
};

export const getUpdateUserAction = (id: API.IUserDetailParams, updatedUser: any) => (
  dispatch: Function,
) => {
  const axiosPromise = CustomAxios({ lifecycleToasts: userToasts })
    .put(ENVIRONMENT.apiUrl + API.KEYCLOAK_USER_UPDATE(id), updatedUser)
    .then((response: AxiosResponse) => {
      dispatch(adminActions.updateUser(response.data));
      return Promise.resolve(response);
    });

  return handleAxiosResponse(dispatch, reducerTypes.PUT_USER_DETAIL, axiosPromise).catch(() => {
    // swallow the exception, the error has already been displayed.
  });
};

export const NEW_PIMS_USER = 201;
