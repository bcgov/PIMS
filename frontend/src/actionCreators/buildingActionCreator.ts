import { LifecycleToasts } from './../customAxios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { IBuilding } from 'actions/parcelsActions';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import * as pimsToasts from 'constants/toasts';

const buildingDeletingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.building.BUILDING_DELETING,
  successToast: pimsToasts.building.BUILDING_DELETED,
  errorToast: pimsToasts.building.BUILDING_DELETING_ERROR,
};

/**
 * Make an AJAX request to delete the specified 'building' from inventory.
 * @param parcel IBuilding object to delete from inventory.
 */
export const deleteBuilding = (building: IBuilding) => async (dispatch: Function) => {
  dispatch(request(actionTypes.DELETE_BUILDING));
  dispatch(showLoading());
  try {
    const { data, status } = await CustomAxios({
      lifecycleToasts: buildingDeletingToasts,
    }).delete(ENVIRONMENT.apiUrl + API.BUILDING_ROOT + `/${building.id}`, { data: building });
    dispatch(success(actionTypes.DELETE_PARCEL, status));
    dispatch(hideLoading());
    return data;
  } catch (axiosError) {
    dispatch(error(actionTypes.DELETE_PARCEL, axiosError?.response?.status, axiosError));
    dispatch(hideLoading());
    throw Error(axiosError.response?.data.details);
  }
};
