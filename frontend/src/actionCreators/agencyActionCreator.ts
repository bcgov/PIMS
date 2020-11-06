import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import * as adminActions from 'actions/adminActions';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { IAddAgency, IAgency, IAgencyDetail } from 'interfaces';
import { handleAxiosResponse } from 'utils';
import * as pimsToasts from 'constants/toasts';

export const getAgenciesAction = (params: API.IPaginateParams) => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_AGENCIES));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.POST_AGENCIES(), params)
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_AGENCIES, response.status));
      dispatch(adminActions.storeAgencies(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_AGENCIES, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchAgencyDetail = (id: API.IAgencyDetailParams) => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_AGENCY_DETAILS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.AGENCY_DETAIL(id))
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_AGENCY_DETAILS));
      dispatch(adminActions.storeAgencyDetails(response.data));
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
) => (dispatch: Function) => {
  const axiosPromise = CustomAxios({ lifecycleToasts: agencyToasts })
    .put(ENVIRONMENT.apiUrl + API.AGENCY_DETAIL(id), updatedAgency)
    .then((response: AxiosResponse) => {
      dispatch(adminActions.updateAgency(response.data));
      return Promise.resolve(response);
    });
  return handleAxiosResponse(
    dispatch,
    actionTypes.PUT_AGENCY_DETAILS,
    axiosPromise,
  ).catch(() => {});
};

export const createAgency = (agency: IAddAgency) => async (dispatch: Function) => {
  dispatch(request(actionTypes.ADD_AGENCY));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios().post(
      ENVIRONMENT.apiUrl + API.AGENCY_ROOT(),
      agency,
    );
    dispatch(success(actionTypes.ADD_PARCEL, status));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    dispatch(error(actionTypes.ADD_AGENCY, axiosError?.response?.status, axiosError));
    dispatch(hideLoading());
    throw Error(axiosError.response?.data.details);
  }
};

export const deleteAgency = (agency: IAgency) => async (dispatch: Function) => {
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
