import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as parcelsActions from 'actions/parcelsActions';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { IParcel } from 'actions/parcelsActions';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { createRequestHeader } from 'utils/RequestHeaders';

export const fetchParcels = (parcelBounds: API.IParcelListParams | null) => (
  dispatch: Function,
) => {
  if (
    !parcelBounds ||
    (parcelBounds?.neLatitude != parcelBounds?.swLatitude &&
      parcelBounds.neLongitude != parcelBounds.swLongitude)
  ) {
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
  }
};

export const fetchParcelDetail = (params: API.IParcelDetailParams) => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params), createRequestHeader())
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

export const fetchBuildingDetail = (params: API.IBuildingDetailParams) => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_PARCEL_DETAIL));
      dispatch(parcelsActions.storeBuildingDetail(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchPropertyDetail = (id: number, propertyTypeId: 0 | 1) => (dispatch: Function) => {
  return propertyTypeId === 0
    ? dispatch(fetchParcelDetail({ id }))
    : dispatch(fetchBuildingDetail({ id }));
};

export const createParcel = (parcel: IParcel) => (dispatch: Function) => {
  dispatch(request(actionTypes.ADD_PARCEL));
  dispatch(showLoading());
  return CustomAxios()
    .post(ENVIRONMENT.apiUrl + API.ADD_PARCEL, parcel, createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.ADD_PARCEL, response.status));
      dispatch(fetchParcelDetail(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) => {
      dispatch(error(actionTypes.ADD_PARCEL, axiosError?.response?.status, axiosError));
      throw axiosError;
    })
    .finally(() => dispatch(hideLoading()));
};

export const updateParcel = (parcel: IParcel) => (dispatch: Function) => {
  dispatch(request(actionTypes.UPDATE_PARCEL));
  dispatch(showLoading());
  return CustomAxios()
    .put(ENVIRONMENT.apiUrl + API.ADD_PARCEL + `/${parcel.id}`, parcel, createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.UPDATE_PARCEL, response.status));
      dispatch(fetchParcelDetail(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) => {
      dispatch(error(actionTypes.UPDATE_PARCEL, axiosError?.response?.status, axiosError));
      throw axiosError;
    })
    .finally(() => dispatch(hideLoading()));
};
