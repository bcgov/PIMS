import { IFilterData } from 'actions/IFilterData';
import { AxiosError, AxiosResponse } from 'axios';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import * as reducerTypes from 'constants/reducerTypes';
import CustomAxios from 'customAxios';
import { IAccessRequest } from 'interfaces/accessRequests';
import React from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import {
  deleteAccessRequest,
  storeAccessRequest,
  storeAccessRequests,
  storeError,
  storeRequest,
  storeSuccess,
  updateAccessRequest,
  useAppDispatch,
} from 'store';

import { updateAccessRequestFilter, updateAccessRequestPageIndex } from '..';
import { error, request, success } from '.';

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
 * Access Request hook which provides functions to interact with the API and redux store.
 * @returns Access request actions.
 */
export const useAccessRequest = () => {
  const dispatch = useAppDispatch();

  /**
   * Update page index in the store.
   */
  const updatePageIndex = React.useCallback(
    (pageIndex: number) => {
      dispatch(updateAccessRequestPageIndex(pageIndex));
    },
    [dispatch],
  );

  /**
   * Update filter in the store.
   */
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
    dispatch(storeRequest(request(reducerTypes.GET_REQUEST_ACCESS)));
    dispatch(showLoading());
    return await CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS())
      .then((response: AxiosResponse) => {
        dispatch(storeSuccess(success(reducerTypes.GET_REQUEST_ACCESS)));
        dispatch(storeAccessRequest(response.data));
      })
      .catch((axiosError: AxiosError) =>
        dispatch(
          storeError(
            error(reducerTypes.GET_REQUEST_ACCESS, axiosError?.response?.status, axiosError),
          ),
        ),
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
      dispatch(storeRequest(request(actionTypes.ADD_REQUEST_ACCESS)));
      dispatch(showLoading());

      // POST || PUT /api/users/access/requests/${id}
      return await CustomAxios()
        .request({
          url: ENVIRONMENT.apiUrl + API.REQUEST_ACCESS(accessRequest.id),
          method: accessRequest.id === 0 ? 'post' : 'put',
          data: accessRequest,
        })
        .then((response: AxiosResponse) => {
          dispatch(storeSuccess(success(actionTypes.ADD_REQUEST_ACCESS, response.status)));
          dispatch(storeAccessRequest(response.data));
        })
        .catch((axiosError: AxiosError) =>
          dispatch(
            storeError(
              error(actionTypes.ADD_REQUEST_ACCESS, axiosError?.response?.status, axiosError),
            ),
          ),
        )
        .finally(() => dispatch(hideLoading()));
    },
    [dispatch],
  );

  /**
   * Update the access request.
   */
  const getSubmitAdminAccessRequestAction = React.useCallback(
    async (accessRequest: IAccessRequest) => {
      dispatch(storeRequest(request(actionTypes.UPDATE_REQUEST_ACCESS_STATUS_ADMIN)));
      dispatch(showLoading());
      return await CustomAxios()
        .put(ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_ADMIN(), accessRequest)
        .then((response: AxiosResponse) => {
          dispatch(
            storeSuccess(
              success(actionTypes.UPDATE_REQUEST_ACCESS_ADMIN, response.status, response.data),
            ),
          );
          dispatch(updateAccessRequest(accessRequest));
        })
        .catch((axiosError: AxiosError) =>
          dispatch(
            storeError(
              error(
                actionTypes.UPDATE_REQUEST_ACCESS_ADMIN,
                axiosError?.response?.status,
                axiosError,
              ),
            ),
          ),
        )
        .finally(() => dispatch(hideLoading()));
    },
    [dispatch],
  );

  /**
   * Get the access request.
   */
  const getAccessRequestsAction = React.useCallback(
    async (params: API.IPaginateAccessRequests) => {
      dispatch(storeRequest(request(actionTypes.GET_REQUEST_ACCESS)));
      dispatch(showLoading());
      try {
        try {
          const response = await CustomAxios().get(
            ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_LIST(params),
          );
          dispatch(storeSuccess(success(actionTypes.GET_REQUEST_ACCESS, response.status)));
          dispatch(storeAccessRequests(response.data));

          return response;
        } catch (axiosError) {
          const err = axiosError as AxiosError;
          dispatch(
            storeError(error(actionTypes.GET_REQUEST_ACCESS, err?.response?.status, axiosError)),
          );
        }
      } finally {
        dispatch(hideLoading());
      }
    },
    [dispatch],
  );

  /**
   * Delete the access request.
   */
  const getAccessRequestsDeleteAction = React.useCallback(
    async (id: number, data: IAccessRequest) => {
      dispatch(storeRequest(request(actionTypes.DELETE_REQUEST_ACCESS_ADMIN)));
      dispatch(showLoading());
      return await CustomAxios()
        .request({
          method: 'DELETE',
          url: ENVIRONMENT.apiUrl + API.REQUEST_ACCESS_DELETE(id),
          data,
        })
        .then((response) => {
          dispatch(storeSuccess(success(actionTypes.DELETE_REQUEST_ACCESS_ADMIN, response.status)));
          dispatch(deleteAccessRequest(id));
        })
        .catch((axiosError: AxiosError) =>
          dispatch(
            storeError(
              error(
                actionTypes.DELETE_REQUEST_ACCESS_ADMIN,
                axiosError?.response?.status,
                axiosError,
              ),
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
