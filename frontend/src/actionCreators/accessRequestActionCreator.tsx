import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import {
  storeAccessRequest,
  IFilterAccessRequestsAction,
  ISelectAccessRequestsAction,
  ISortAccessRequestsAction,
  IFilterData,
  ISort,
} from 'actions/accessRequestActions';
import { IAccessRequest } from 'interfaces/accessRequests';
import * as actionTypes from 'constants/actionTypes';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { Dispatch } from 'react';

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
    status: values.status,
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
    .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS())
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
  dispatch(request(actionTypes.UPDATE_REQUEST_ACCESS_STATUS_ADMIN));
  dispatch(showLoading());
  return CustomAxios()
    .put(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN(), accessRequest)
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.UPDATE_REQUEST_ACCESS_ADMIN, response.status, response.data));
      dispatch({
        type: actionTypes.UPDATE_REQUEST_ACCESS_STATUS_ADMIN,
        accessRequest: accessRequest,
      });
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
    .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST(params))
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_REQUEST_ACCESS, response.status));
      dispatch({
        type: actionTypes.STORE_ACCESS_REQUESTS,
        pagedAccessRequests: response.data,
      });

      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_REQUEST_ACCESS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const getAccessRequestsFilterAction = (
  filter: IFilterData,
): IFilterAccessRequestsAction => ({
  type: actionTypes.FILTER_REQUEST_ACCESS_ADMIN,
  filter,
});

export const getAccessRequestsSelectAction = (
  selections: string[] = [],
): ISelectAccessRequestsAction => ({
  type: actionTypes.SELECT_REQUEST_ACCESS_ADMIN,
  selections,
});

export const getAccessRequestsSortAction = (sort: ISort): ISortAccessRequestsAction => ({
  type: actionTypes.UPDATE_REQUEST_ACCESS_SORT,
  sort,
});

export const getAccessRequestsDeleteAction = (id: number, data: IAccessRequest) => (
  dispatch: Dispatch<any>,
) => {
  dispatch(request(actionTypes.DELETE_REQUEST_ACCESS_ADMIN));
  dispatch(showLoading());
  return CustomAxios()
    .request({
      method: 'DELETE',
      url: ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id),
      data,
    })
    .then(() => {
      dispatch({ type: actionTypes.DELETE_REQUEST_ACCESS_ADMIN, id });
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(
        error(actionTypes.DELETE_REQUEST_ACCESS_ADMIN, axiosError?.response?.status, axiosError),
      ),
    )
    .finally(() => dispatch(hideLoading()));
};
