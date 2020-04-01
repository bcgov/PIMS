import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error, clear } from 'actions/genericActions';
import * as parcelsActions from 'actions/parcelsActions';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { createRequestHeader } from 'utils/RequestHeaders';

export const fetchParcels = (parcelBounds: API.IParcelListParams | null) => (
  dispatch: Function,
) => {
  dispatch(request(actionTypes.GET_PARCELS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PARCELS(parcelBounds), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_PARCELS));
      dispatch(parcelsActions.storeParcelsAction(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_PARCELS, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchParcelDetail = (parcelBounds: API.IParcelDetailParams) => (
  dispatch: Function,
) => {
  dispatch(request(actionTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(parcelBounds), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_PARCEL_DETAIL));
      dispatch(parcelsActions.storeParcelDetail(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const createParcel = (parcel: API.IParcel) => (dispatch: Function) => {
  dispatch(request(actionTypes.ADD_PARCEL));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.ADD_PARCEL, parcel, createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.ADD_PARCEL, response.status));
      dispatch(clear(actionTypes.ADD_PARCEL));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.ADD_PARCEL, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};
