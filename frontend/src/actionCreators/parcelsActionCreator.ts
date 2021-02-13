import { storeParcelDetail } from './../actions/parcelsActions';
import { LifecycleToasts } from './../customAxios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as parcelsActions from 'actions/parcelsActions';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { IParcel, IBuilding } from 'actions/parcelsActions';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import * as pimsToasts from 'constants/toasts';
import _ from 'lodash';

export const fetchParcels = (parcelBounds: API.IPropertySearchParams | null) => (
  dispatch: Function,
) => {
  if (
    !parcelBounds ||
    (parcelBounds?.neLatitude !== parcelBounds?.swLatitude &&
      parcelBounds?.neLongitude !== parcelBounds?.swLongitude)
  ) {
    dispatch(request(actionTypes.GET_PARCELS));
    dispatch(showLoading());
    return CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.PROPERTIES(parcelBounds))
      .then((response: AxiosResponse) => {
        dispatch(success(actionTypes.GET_PARCELS));
        dispatch(parcelsActions.storeParcelsAction(response.data));
        dispatch(hideLoading());
        return Promise.resolve(response);
      })
      .catch((axiosError: AxiosError) =>
        dispatch(error(actionTypes.GET_PARCELS, axiosError?.response?.status, axiosError)),
      )
      .finally(() => dispatch(hideLoading()));
  }

  return Promise.resolve();
};

/**
 * fetch parcels using search query parameters, such as pid or pin.
 * @param params
 */
export const fetchParcelsDetail = (params: API.IPropertySearchParams) => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PARCELS_DETAIL(params))
    .then((response: AxiosResponse) => {
      if (response?.data !== undefined && response.data.length > 0) {
        dispatch(parcelsActions.storeParcelDetail(_.first(response.data) as any));
      }
      dispatch(success(actionTypes.GET_PARCEL_DETAIL));
      dispatch(hideLoading());
      return Promise.resolve(response);
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchParcelDetail = (params: API.IParcelDetailParams, position?: [number, number]) => (
  dispatch: Function,
): Promise<IParcel> => {
  dispatch(request(actionTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get<IParcel>(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params))
    .then((response: AxiosResponse<IParcel>) => {
      dispatch(success(actionTypes.GET_PARCEL_DETAIL));
      dispatch(parcelsActions.storeParcelDetail(response.data, position));
      dispatch(hideLoading());
      return response.data;
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchBuildingDetail = (
  params: API.IBuildingDetailParams,
  position?: [number, number],
) => (dispatch: Function): Promise<IBuilding> => {
  dispatch(request(actionTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get<IBuilding>(ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params))
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_PARCEL_DETAIL));
      dispatch(parcelsActions.storeBuildingDetail(response.data, position));
      dispatch(hideLoading());
      return response.data;
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};

export const fetchPropertyDetail = (
  id: number,
  propertyTypeId: 0 | 1,
  position?: [number, number],
) => (dispatch: Function) => {
  return propertyTypeId === 0
    ? dispatch(fetchParcelDetail({ id }, position))
    : dispatch(fetchBuildingDetail({ id }, position));
};

const parcelCreatingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.parcel.PARCEL_CREATING,
  successToast: pimsToasts.parcel.PARCEL_CREATED,
  errorToast: pimsToasts.parcel.PARCEL_CREATING_ERROR,
};

export const createParcel = (parcel: IParcel) => async (dispatch: Function) => {
  dispatch(request(actionTypes.ADD_PARCEL));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({ lifecycleToasts: parcelCreatingToasts }).post(
      ENVIRONMENT.apiUrl + API.PARCEL_ROOT,
      parcel,
    );
    dispatch(success(actionTypes.ADD_PARCEL, status));
    dispatch(storeParcelDetail(data));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    dispatch(error(actionTypes.ADD_PARCEL, axiosError?.response?.status, axiosError));
    dispatch(hideLoading());
    throw Error(axiosError.response?.data.details);
  }
};

const parcelUpdatingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.parcel.PARCEL_UPDATING,
  successToast: pimsToasts.parcel.PARCEL_UPDATED,
  errorToast: pimsToasts.parcel.PARCEL_UPDATING_ERROR,
};

export const updateParcel = (parcel: IParcel) => async (dispatch: Function) => {
  dispatch(request(actionTypes.UPDATE_PARCEL));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({ lifecycleToasts: parcelUpdatingToasts }).put(
      ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`,
      parcel,
    );
    dispatch(success(actionTypes.UPDATE_PARCEL, status));
    dispatch(storeParcelDetail(data));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    dispatch(error(actionTypes.UPDATE_PARCEL, axiosError?.response?.status, axiosError));
    dispatch(hideLoading());
    throw Error(axiosError.response?.data.details);
  }
};

const parcelDeletingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.parcel.PARCEL_DELETING,
  successToast: pimsToasts.parcel.PARCEL_DELETED,
  errorToast: pimsToasts.parcel.PARCEL_DELETING_ERROR,
};

/**
 * Make an AJAX request to delete the specified 'parcel' from inventory.
 * @param parcel IParcel object to delete from inventory.
 */
export const deleteParcel = (parcel: IParcel) => async (dispatch: Function) => {
  dispatch(request(actionTypes.DELETE_PARCEL));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({
      lifecycleToasts: parcelDeletingToasts,
    }).delete(ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`, { data: parcel });
    dispatch(success(actionTypes.DELETE_PARCEL, status));
    dispatch(storeParcelDetail(null));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    dispatch(error(actionTypes.DELETE_PARCEL, axiosError.response?.status, axiosError));
    dispatch(hideLoading());
    throw Error(axiosError.response?.data.details);
  }
};
