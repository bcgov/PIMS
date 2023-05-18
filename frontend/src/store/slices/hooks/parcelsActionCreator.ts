import { IBuilding, IParcel } from 'actions/parcelsActions';
import { AxiosError, AxiosResponse } from 'axios';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import { PropertyTypes } from 'constants/propertyTypes';
import * as pimsToasts from 'constants/toasts';
import CustomAxios from 'customAxios';
import _ from 'lodash';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { AnyAction, Dispatch } from 'redux';
import {
  storeError,
  storeProperties,
  storePropertyDetail,
  storeRequest,
  storeSuccess,
} from 'store';

import { LifecycleToasts } from '../../../customAxios';
import { error, request, success } from '.';

const parcelCreatingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.parcel.PARCEL_CREATING,
  successToast: pimsToasts.parcel.PARCEL_CREATED,
  errorToast: pimsToasts.parcel.PARCEL_CREATING_ERROR,
};

const parcelUpdatingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.parcel.PARCEL_UPDATING,
  successToast: pimsToasts.parcel.PARCEL_UPDATED,
  errorToast: pimsToasts.parcel.PARCEL_UPDATING_ERROR,
};

const parcelDeletingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.parcel.PARCEL_DELETING,
  successToast: pimsToasts.parcel.PARCEL_DELETED,
  errorToast: pimsToasts.parcel.PARCEL_DELETING_ERROR,
};

export const fetchParcels =
  (parcelBounds: API.IPropertySearchParams | null) => async (dispatch: Dispatch<AnyAction>) => {
    if (
      !parcelBounds ||
      (parcelBounds?.neLatitude !== parcelBounds?.swLatitude &&
        parcelBounds?.neLongitude !== parcelBounds?.swLongitude)
    ) {
      dispatch(storeRequest(request(actionTypes.GET_PARCELS)));
      dispatch(showLoading());
      return await CustomAxios()
        .get(ENVIRONMENT.apiUrl + API.PROPERTIES(parcelBounds))
        .then((response: AxiosResponse) => {
          dispatch(storeSuccess(success(actionTypes.GET_PARCELS)));
          dispatch(storeProperties(response.data));
          dispatch(hideLoading());
          return Promise.resolve(response);
        })
        .catch((axiosError: AxiosError) => {
          dispatch(
            storeError(error(actionTypes.GET_PARCELS, axiosError?.response?.status, axiosError)),
          );
          return Promise.reject(axiosError);
        })
        .finally(() => dispatch(hideLoading()));
    }

    return Promise.resolve();
  };

/**
 * fetch parcels using search query parameters, such as pid or pin.
 * @param params
 */
export const fetchParcelsDetail =
  (params: API.IPropertySearchParams) => async (dispatch: Dispatch<AnyAction>) => {
    dispatch(storeRequest(request(actionTypes.GET_PARCEL_DETAIL)));
    dispatch(showLoading());
    return await CustomAxios()
      .get(ENVIRONMENT.apiUrl + API.PARCELS_DETAIL(params))
      .then((response: AxiosResponse) => {
        if (response?.data !== undefined && response.data.length > 0) {
          dispatch(storePropertyDetail(_.first(response.data) as any));
        }
        dispatch(storeSuccess(success(actionTypes.GET_PARCEL_DETAIL)));
        dispatch(hideLoading());
        return Promise.resolve(response);
      })
      .catch((axiosError: AxiosError) => {
        dispatch(
          storeError(
            error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError),
          ),
        );
        return Promise.reject(axiosError);
      })
      .finally(() => dispatch(hideLoading()));
  };

export const fetchParcelDetail =
  (params: API.IParcelDetailParams, position?: [number, number]) =>
  async (dispatch: Dispatch<AnyAction>): Promise<IParcel> => {
    dispatch(storeRequest(request(actionTypes.GET_PARCEL_DETAIL)));
    dispatch(showLoading());
    return await CustomAxios()
      .get<IParcel>(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(params))
      .then((response: AxiosResponse<IParcel>) => {
        dispatch(storeSuccess(success(actionTypes.GET_PARCEL_DETAIL)));
        dispatch(
          storePropertyDetail({
            propertyTypeId: response.data?.propertyTypeId as PropertyTypes,
            parcelDetail: response.data,
            position,
          }),
        );
        dispatch(hideLoading());
        return response.data;
      })
      .catch((axiosError: AxiosError) => {
        dispatch(
          storeError(
            error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError),
          ),
        );
        return Promise.reject(axiosError);
      })
      .finally(() => dispatch(hideLoading()));
  };

export const fetchBuildingDetail =
  (params: API.IBuildingDetailParams, position?: [number, number]) =>
  async (dispatch: Dispatch<AnyAction>): Promise<IBuilding> => {
    dispatch(storeRequest(request(actionTypes.GET_PARCEL_DETAIL)));
    dispatch(showLoading());
    return await CustomAxios()
      .get<IBuilding>(ENVIRONMENT.apiUrl + API.BUILDING_DETAIL(params))
      .then((response: AxiosResponse) => {
        dispatch(storeSuccess(success(actionTypes.GET_PARCEL_DETAIL)));
        dispatch(
          storePropertyDetail({
            propertyTypeId: 1,
            parcelDetail: response.data,
            position,
          }),
        );
        dispatch(hideLoading());
        return response.data;
      })
      .catch((axiosError: AxiosError) => {
        dispatch(
          storeError(
            error(actionTypes.GET_PARCEL_DETAIL, axiosError?.response?.status, axiosError),
          ),
        );
        return Promise.reject(axiosError);
      })
      .finally(() => dispatch(hideLoading()));
  };

export const fetchPropertyDetail =
  (id: number, propertyTypeId: 0 | 1, position?: [number, number]) =>
  async (dispatch: Dispatch<AnyAction>) => {
    return propertyTypeId === 0
      ? await fetchParcelDetail({ id }, position)(dispatch)
      : await fetchBuildingDetail({ id }, position)(dispatch);
  };

export const createParcel = (parcel: IParcel) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(storeRequest(request(actionTypes.ADD_PARCEL)));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({ lifecycleToasts: parcelCreatingToasts }).post(
      ENVIRONMENT.apiUrl + API.PARCEL_ROOT,
      parcel,
    );
    dispatch(storeSuccess(success(actionTypes.ADD_PARCEL, status)));
    dispatch(storePropertyDetail(data));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    const err = axiosError as AxiosError<any>;
    dispatch(storeError(error(actionTypes.ADD_PARCEL, err?.response?.status, axiosError)));
    dispatch(hideLoading());
    throw Error(err.response?.data.details);
  }
};

export const updateParcel = (parcel: IParcel) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(storeRequest(request(actionTypes.UPDATE_PARCEL)));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({ lifecycleToasts: parcelUpdatingToasts }).put(
      ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`,
      parcel,
    );
    dispatch(storeSuccess(success(actionTypes.UPDATE_PARCEL, status)));
    dispatch(storePropertyDetail(data));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    const err = axiosError as AxiosError<any>;
    dispatch(storeError(error(actionTypes.UPDATE_PARCEL, err?.response?.status, axiosError)));
    dispatch(hideLoading());
    throw Error(err.response?.data.details);
  }
};

/**
 * Make an AJAX request to delete the specified 'parcel' from inventory.
 * @param parcel IParcel object to delete from inventory.
 */
export const deleteParcel = (parcel: IParcel) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(storeRequest(request(actionTypes.DELETE_PARCEL)));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({
      lifecycleToasts: parcelDeletingToasts,
    }).delete(ENVIRONMENT.apiUrl + API.PARCEL_ROOT + `/${parcel.id}`, { data: parcel });
    dispatch(storeSuccess(success(actionTypes.DELETE_PARCEL, status)));
    dispatch(storePropertyDetail(null));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    const err = axiosError as AxiosError<any>;
    dispatch(storeError(error(actionTypes.DELETE_PARCEL, err.response?.status, axiosError)));
    dispatch(hideLoading());
    throw Error(err.response?.data.details);
  }
};
