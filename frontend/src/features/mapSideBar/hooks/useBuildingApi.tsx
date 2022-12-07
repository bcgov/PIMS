import { IBuilding } from 'actions/parcelsActions';
import { AxiosError } from 'axios';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import * as pimsToasts from 'constants/toasts';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { useNetworkStore } from 'store/slices/hooks';
import { storePropertyDetail } from 'store/slices/parcelSlice';

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
  const network = useNetworkStore();
  /**
   * Create the passed building, creating or updating all attached parcels as needed. Return a promise
   */
  const createBuilding = (building: IBuilding) => async (dispatch: Function) => {
    network.storeRequest(actionTypes.ADD_BUILDING);
    dispatch(showLoading());
    try {
      const { data, status } = await CustomAxios({ lifecycleToasts: buildingCreatingToasts }).post(
        ENVIRONMENT.apiUrl + API.BUILDING_ROOT,
        building,
      );
      network.storeSuccess(actionTypes.ADD_BUILDING, status);
      dispatch(
        storePropertyDetail({
          propertyTypeId: 1,
          parcelDetail: data,
        }),
      );

      dispatch(hideLoading());
      return data;
    } catch (axiosError) {
      const err = axiosError as AxiosError<any>;
      network.storeError(actionTypes.ADD_BUILDING, err?.response?.status, axiosError);
      dispatch(hideLoading());
      throw Error(err.response?.data.details);
    }
  };

  /**
   * update the passed building (requires an id and rowversions). Also create/update all associated parcels as needed.
   * @param building
   */
  const updateBuilding = (building: IBuilding) => async (dispatch: Function) => {
    network.storeRequest(actionTypes.UPDATE_BUILDING);
    dispatch(showLoading());
    try {
      const { data, status } = await CustomAxios({ lifecycleToasts: buildingUpdatingToasts }).put(
        ENVIRONMENT.apiUrl + API.BUILDING_ROOT + `/${building.id}`,
        building,
      );
      network.storeSuccess(actionTypes.UPDATE_BUILDING, status);
      dispatch(
        storePropertyDetail({
          propertyTypeId: 1,
          parcelDetail: data,
        }),
      );
      dispatch(hideLoading());
      return data;
    } catch (axiosError) {
      const err = axiosError as AxiosError<any>;
      network.storeError(actionTypes.UPDATE_BUILDING, err?.response?.status, axiosError);
      dispatch(hideLoading());
      throw Error(err.response?.data.details);
    }
  };

  return { createBuilding, updateBuilding };
};
