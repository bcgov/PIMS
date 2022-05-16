import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error, storeAgencies, storeAgencyDetail } from 'store';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { IAddAgency, IAgency, IAgencyDetail } from 'interfaces';
import { handleAxiosResponse } from 'utils';
import * as pimsToasts from 'constants/toasts';
import { Dispatch, AnyAction } from 'redux';

export const getAgenciesAction = (params: API.IPaginateParams) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  dispatch(request(actionTypes.GET_AGENCIES));
  dispatch(showLoading());
  return await CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.POST_AGENCIES(), params)
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_AGENCIES, response.status));
      dispatch(storeAgencies(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_AGENCIES, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchAgencyDetail = (id: API.IAgencyDetailParams) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  dispatch(request(actionTypes.GET_AGENCY_DETAILS));
  dispatch(showLoading());
  return await CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.AGENCY_DETAIL(id))
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_AGENCY_DETAILS));
      dispatch(storeAgencyDetail(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(actionTypes.GET_AGENCY_DETAILS)))
    .finally(() => dispatch(hideLoading()));
};

const agencyToasts: LifecycleToasts = {
  loadingToast: pimsToasts.agency.AGENCY_UPDATING,
  successToast: pimsToasts.agency.AGENCY_UPDATED,
  errorToast: pimsToasts.agency.AGENCY_ERROR,
};

export const getUpdateAgencyAction = (
  id: API.IAgencyDetailParams,
  updatedAgency: IAgencyDetail,
) => async (dispatch: Dispatch<AnyAction>) => {
  const axiosPromise = CustomAxios({ lifecycleToasts: agencyToasts })
    .put(ENVIRONMENT.apiUrl + API.AGENCY_DETAIL(id), updatedAgency)
    .then((response: AxiosResponse) => {
      dispatch(storeAgencyDetail(response.data));
      return Promise.resolve(response);
    });
  return await handleAxiosResponse(
    actionTypes.PUT_AGENCY_DETAILS,
    axiosPromise,
  )(dispatch).catch(() => {});
};

export const createAgency = (agency: IAddAgency) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(request(actionTypes.ADD_AGENCY));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({ lifecycleToasts: agencyToasts }).post(
      ENVIRONMENT.apiUrl + API.AGENCY_ROOT(),
      agency,
    );
    dispatch(success(actionTypes.ADD_PARCEL, status));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    dispatch(error(actionTypes.ADD_AGENCY, err?.response?.status, axiosError));
    dispatch(hideLoading());
    throw Error(err.response?.data.details);
  }
};

export const deleteAgency = (agency: IAgency) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(request(actionTypes.DELETE_AGENCY));
  dispatch(showLoading());
  return await CustomAxios()
    .delete(ENVIRONMENT.apiUrl + API.AGENCY_ROOT() + `${agency.id}`, { data: agency })
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.DELETE_AGENCY, response.status));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) => {
      dispatch(error(actionTypes.DELETE_AGENCY, axiosError?.response?.status, axiosError));
    })
    .finally(() => dispatch(hideLoading()));
};
