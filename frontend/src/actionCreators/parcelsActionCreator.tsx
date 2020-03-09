import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as parcelsActions from 'actions/parcelsActions';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse } from 'axios';
import { createRequestHeader } from 'utils/RequestHeaders';

export const fetchParcels = (parcelBounds: API.IParcelListParams | null) => (
  dispatch: Function,
) => {
  dispatch(request(reducerTypes.GET_PARCELS));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PARCELS(parcelBounds), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_PARCELS));
      dispatch(parcelsActions.storeParcelsAction(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_PARCELS)))
    .finally(() => dispatch(hideLoading()));
};

export const fetchParcelDetail = (parcelBounds: API.IParcelDetailParams) => (
  dispatch: Function,
) => {
  dispatch(request(reducerTypes.GET_PARCEL_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.PARCEL_DETAIL(parcelBounds), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_PARCEL_DETAIL));
      dispatch(parcelsActions.storeParcelDetail(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_PARCEL_DETAIL)))
    .finally(() => dispatch(hideLoading()));
};
