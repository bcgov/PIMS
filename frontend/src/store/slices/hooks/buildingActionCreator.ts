import { LifecycleToasts } from '../../../customAxios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { storeRequest, storeError, storeSuccess } from 'store';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { IBuilding } from 'actions/parcelsActions';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import * as pimsToasts from 'constants/toasts';
import { AnyAction, Dispatch } from 'redux';
import { AxiosError } from 'axios';
import { error, request, success } from '.';

const buildingDeletingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.building.BUILDING_DELETING,
  successToast: pimsToasts.building.BUILDING_DELETED,
  errorToast: pimsToasts.building.BUILDING_DELETING_ERROR,
};

/**
 * Make an AJAX request to delete the specified 'building' from inventory.
 * @param parcel IBuilding object to delete from inventory.
 */
export const deleteBuilding = (building: IBuilding) => async (dispatch: Dispatch<AnyAction>) => {
  dispatch(storeRequest(request(actionTypes.DELETE_BUILDING)));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({
      lifecycleToasts: buildingDeletingToasts,
    }).delete(ENVIRONMENT.apiUrl + API.BUILDING_ROOT + `/${building.id}`, { data: building });
    dispatch(storeSuccess(success(actionTypes.DELETE_PARCEL, status)));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    dispatch(storeError(error(actionTypes.DELETE_PARCEL, err?.response?.status, axiosError)));
    dispatch(hideLoading());
    throw Error(err.response?.data.details);
  }
};
