import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import * as adminActions from 'actions/adminActions';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse } from 'axios';
import { createRequestHeader } from 'utils/RequestHeaders';

export const getActivateUserAction = () => (dispatch: Function) => {
  dispatch(request(reducerTypes.POST_ACTIVATE_USER));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.ACTIVATE_USER(), null, createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.POST_ACTIVATE_USER, response.status));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.POST_ACTIVATE_USER)))
    .finally(() => dispatch(hideLoading()));
};

export const getSubmitAccessRequestAction = (accessRequest: adminActions.IAccessRequestParams) => (
  dispatch: Function,
) => {
  dispatch(request(reducerTypes.POST_REQUEST_ACCESS));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS(), accessRequest, createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.POST_REQUEST_ACCESS, response.status));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.POST_REQUEST_ACCESS)))
    .finally(() => dispatch(hideLoading()));
};

export const getAccessRequestsAction = (params: API.IPaginateParams) => (dispatch: Function) => {
  dispatch(request(reducerTypes.GET_REQUEST_ACCESS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST(params), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_REQUEST_ACCESS, response.status));
      dispatch(adminActions.storeAccessRequests(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_REQUEST_ACCESS)))
    .finally(() => dispatch(hideLoading()));
};

export const getUsersAction = (params: API.IPaginateParams) => (dispatch: Function) => {
  dispatch(request(reducerTypes.GET_USERS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.GET_USERS(params), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_USERS, response.status));
      dispatch(adminActions.storeUsers(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_USERS)))
    .finally(() => dispatch(hideLoading()));
};

export const NEW_PIMS_USER = 201;
