import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import {
  IStoreAccessRequestsAction,
  storeAccessRequests,
  storeAccessRequest,
} from 'actions/accessRequestActions';
import { IAccessRequest } from 'interfaces/accessRequests';
import * as actionTypes from 'constants/actionTypes';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { createRequestHeader } from 'utils/RequestHeaders';

/**
 * Converts the 'values' object into an IAccessRequest object
 * @param values - An object containing values
 * @returns A new access request
 */
export const toAccessRequest = (values: any): IAccessRequest => {
  return {
    id: values.id,
    userId: values.userId,
    user: {
      id: values.userId,
      username: values.user.username,
      email: values.user.email,
      position: values.user.position,
    },
    agencies: isNaN(values.agency) ? [] : [{ id: parseInt(values.agency) }],
    roles: [{ id: values.role }],
    isGranted: values.isGranted,
    note: values.note,
    rowVersion: values.rowVersion,
  };
};

/**
 * Get the current access request for the current user.
 * @returns The access request if one exists, or 204 if one doesn't
 */
export const getCurrentAccessRequestAction = () => (dispatch: Function) => {
  dispatch(request(reducerTypes.GET_REQUEST_ACCESS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS(), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_REQUEST_ACCESS));
      dispatch(storeAccessRequest(response.data));
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(reducerTypes.GET_REQUEST_ACCESS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

/**
 * Get the SubmitAccessRequestAction function.
 * If the 'accessRequest' is new return the POST action.
 * If the 'accessRequest' exists, return the PUT action.
 * @param accessRequest - The access request to add
 * @returns The action function to submit the access request
 */
export const getSubmitAccessRequestAction = (accessRequest: IAccessRequest) => (
  dispatch: Function,
) => {
  dispatch(request(actionTypes.ADD_REQUEST_ACCESS));
  dispatch(showLoading());

  return CustomAxios()
    .request({
      url: ENVIRONMENT.apiUrl + API.REQUEST_ACCESS(accessRequest.id),
      method: accessRequest.id === 0 ? 'post' : 'put',
      headers: createRequestHeader().headers,
      data: accessRequest,
    })
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.ADD_REQUEST_ACCESS, response.status));
      dispatch(storeAccessRequest(response.data));
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.ADD_REQUEST_ACCESS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const getSubmitAdminAccessRequestAction = (accessRequest: IAccessRequest) => (
  dispatch: Function,
) => {
  dispatch(request(actionTypes.UPDATE_REQUEST_ACCESS_ADMIN));
  dispatch(showLoading());
  return CustomAxios()
    .put(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN(), accessRequest, createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.UPDATE_REQUEST_ACCESS_ADMIN, response.status));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(
        error(actionTypes.UPDATE_REQUEST_ACCESS_ADMIN, axiosError?.response?.status, axiosError),
      ),
    )
    .finally(() => dispatch(hideLoading()));
};

export const getAccessRequestsAction = (params: API.IPaginateAccessRequests) => (
  dispatch: Function,
) => {
  dispatch(request(actionTypes.GET_REQUEST_ACCESS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST(params), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_REQUEST_ACCESS, response.status));
      const clearAction: IStoreAccessRequestsAction = {
        type: actionTypes.STORE_ACCESS_REQUESTS,
        pagedAccessRequests: { page: 0, quantity: 0, total: 0, items: [] },
      };
      dispatch(clearAction); //TODO: this should not be necessary.
      dispatch(storeAccessRequests(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_REQUEST_ACCESS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};
