import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as reducerTypes from 'constants/reducerTypes';
import * as API from 'constants/API';
import { IAccessRequest } from 'interfaces/accessRequests';
import * as actionTypes from 'constants/actionTypes';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import {
  request,
  success,
  error,
  deleteAccessRequest,
  storeAccessRequest,
  storeAccessRequests,
  updateAccessRequest,
  useAppDispatch,
} from 'store';
import React from 'react';
import { updateAccessRequestFilter, updateAccessRequestPageIndex } from '..';
import { IFilterData } from 'actions/IFilterData';

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

export const useAccessRequest = () => {
  const dispatch = useAppDispatch();

  const updatePageIndex = React.useCallback(
    (pageIndex: number) => {
      dispatch(updateAccessRequestPageIndex(pageIndex));
    },
    [dispatch],
  );

  const updateFilter = React.useCallback(
    (filter: IFilterData) => {
      dispatch(updateAccessRequestFilter(filter));
    },
    [dispatch],
  );

  /**
   * Get the current access request for the current user.
   * @returns The access request if one exists, or 204 if one doesn't
   */
  const getCurrentAccessRequestAction = React.useCallback(async () => {
    dispatch(request(reducerTypes.GET_REQUEST_ACCESS));
    dispatch(showLoading());
    return await CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS())
      .then((response: AxiosResponse) => {
        dispatch(success(reducerTypes.GET_REQUEST_ACCESS));
        dispatch(storeAccessRequest(response.data));
      })
      .catch((axiosError: AxiosError) =>
        dispatch(error(reducerTypes.GET_REQUEST_ACCESS, axiosError?.response?.status, axiosError)),
      )
      .finally(() => dispatch(hideLoading()));
  }, [dispatch]);

  /**
   * Get the SubmitAccessRequestAction function.
   * If the 'accessRequest' is new return the POST action.
   * If the 'accessRequest' exists, return the PUT action.
   * @param accessRequest - The access request to add
   * @returns The action function to submit the access request
   */
  const getSubmitAccessRequestAction = React.useCallback(
    async (accessRequest: IAccessRequest) => {
      dispatch(request(actionTypes.ADD_REQUEST_ACCESS));
      dispatch(showLoading());

      return await CustomAxios()
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
    },
    [dispatch],
  );

  const getSubmitAdminAccessRequestAction = React.useCallback(
    async (accessRequest: IAccessRequest) => {
      dispatch(request(actionTypes.UPDATE_REQUEST_ACCESS_STATUS_ADMIN));
      dispatch(showLoading());
      return await CustomAxios()
        .put(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN(), accessRequest)
        .then((response: AxiosResponse) => {
          dispatch(
            success(actionTypes.UPDATE_REQUEST_ACCESS_ADMIN, response.status, response.data),
          );
          dispatch(updateAccessRequest(accessRequest));
        })
        .catch((axiosError: AxiosError) =>
          dispatch(
            error(
              actionTypes.UPDATE_REQUEST_ACCESS_ADMIN,
              axiosError?.response?.status,
              axiosError,
            ),
          ),
        )
        .finally(() => dispatch(hideLoading()));
    },
    [dispatch],
  );

  const getAccessRequestsAction = React.useCallback(
    async (params: API.IPaginateAccessRequests) => {
      dispatch(request(actionTypes.GET_REQUEST_ACCESS));
      dispatch(showLoading());
      try {
        try {
          const response = await CustomAxios().get(
            ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST(params),
          );
          dispatch(success(actionTypes.GET_REQUEST_ACCESS, response.status));
          dispatch(storeAccessRequests(response.data));

          dispatch(hideLoading());
        } catch (axiosError) {
          const err = axiosError as AxiosError;
          return dispatch(error(actionTypes.GET_REQUEST_ACCESS, err?.response?.status, axiosError));
        }
      } finally {
        return dispatch(hideLoading());
      }
    },
    [dispatch],
  );

  const getAccessRequestsDeleteAction = React.useCallback(
    async (id: number, data: IAccessRequest) => {
      dispatch(request(actionTypes.DELETE_REQUEST_ACCESS_ADMIN));
      dispatch(showLoading());
      return await CustomAxios()
        .request({
          method: 'DELETE',
          url: ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id),
          data,
        })
        .then(() => {
          dispatch(deleteAccessRequest(id));
          dispatch(hideLoading());
        })
        .catch((axiosError: AxiosError) =>
          dispatch(
            error(
              actionTypes.DELETE_REQUEST_ACCESS_ADMIN,
              axiosError?.response?.status,
              axiosError,
            ),
          ),
        )
        .finally(() => dispatch(hideLoading()));
    },
    [dispatch],
  );

  return React.useMemo(
    () => ({
      getCurrentAccessRequestAction,
      getSubmitAccessRequestAction,
      getSubmitAdminAccessRequestAction,
      getAccessRequestsAction,
      getAccessRequestsDeleteAction,
      updatePageIndex,
      updateFilter,
    }),
    [
      getAccessRequestsAction,
      getAccessRequestsDeleteAction,
      getCurrentAccessRequestAction,
      getSubmitAccessRequestAction,
      getSubmitAdminAccessRequestAction,
      updateFilter,
      updatePageIndex,
    ],
  );
};
