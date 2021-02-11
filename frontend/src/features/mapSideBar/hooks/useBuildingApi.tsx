import { request, success, error } from 'actions/genericActions';
import { IBuilding, storeBuildingDetail } from 'actions/parcelsActions';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { ENVIRONMENT } from 'constants/environment';
import * as actionTypes from 'constants/actionTypes';
import * as pimsToasts from 'constants/toasts';
import * as API from 'constants/API';

const buildingCreatingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.building.BUILDING_CREATING,
  successToast: pimsToasts.building.BUILDING_CREATED,
  errorToast: pimsToasts.building.BUILDING_CREATING_ERROR,
};

const buildingUpdatingToasts: LifecycleToasts = {
  loadingToast: pimsToasts.building.BUILDING_UPDATING,
  successToast: pimsToasts.building.BUILDING_UPDATED,
  errorToast: pimsToasts.building.BUILDING_UPDATING_ERROR,
};

export const useBuildingApi = () => {
  /**
   * Create the passed building, creating or updating all attached parcels as needed. Return a promise
   */
  const createBuilding = (building: IBuilding) => async (dispatch: Function) => {
    dispatch(request(actionTypes.ADD_BUILDING));
    dispatch(showLoading());
    try {
      const { data, status } = await CustomAxios({ lifecycleToasts: buildingCreatingToasts }).post(
        ENVIRONMENT.apiUrl + API.BUILDING_ROOT,
        building,
      );
      dispatch(success(actionTypes.ADD_BUILDING, status));
      dispatch(storeBuildingDetail(data));
      dispatch(hideLoading());
      return data;
    } catch (axiosError) {
      dispatch(error(actionTypes.ADD_BUILDING, axiosError?.response?.status, axiosError));
      dispatch(hideLoading());
      throw Error(axiosError.response?.data.details);
    }
  };

  /**
   * update the passed building (requires an id and rowversions). Also create/update all associated parcels as needed.
   * @param building
   */
  const updateBuilding = (building: IBuilding) => async (dispatch: Function) => {
    dispatch(request(actionTypes.UPDATE_BUILDING));
    dispatch(showLoading());
    try {
      const { data, status } = await CustomAxios({ lifecycleToasts: buildingUpdatingToasts }).put(
        ENVIRONMENT.apiUrl + API.BUILDING_ROOT + `/${building.id}`,
        building,
      );
      dispatch(success(actionTypes.UPDATE_BUILDING, status));
      dispatch(storeBuildingDetail(data));
      dispatch(hideLoading());
      return data;
    } catch (axiosError) {
      dispatch(error(actionTypes.UPDATE_BUILDING, axiosError?.response?.status, axiosError));
      dispatch(hideLoading());
      throw Error(axiosError.response?.data.details);
    }
  };

  return { createBuilding, updateBuilding };
};
