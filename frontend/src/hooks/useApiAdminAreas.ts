import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import {
  IAddAdminArea,
  IAdminAreaFilter,
  IAdministrativeArea,
  IApiAdminArea,
} from 'features/admin/admin-areas/interfaces';
import { useCallback } from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store';
import { store } from 'store';

export interface IGeocoderResponse {
  siteId: string;
  fullAddress: string;
  address1: string;
  administrativeArea: string;
  provinceCode: string;
  latitude: number;
  longitude: number;
  score: number;
}

export interface IGeocoderPidsResponse {
  siteId: string;
  pids: string[];
}

export interface AdminAreaAPI extends AxiosInstance {
  getAdminArea: (id: number) => Promise<IAdministrativeArea>;
  getAdminAreas: (params: IAdminAreaFilter) => Promise<any>;
  deleteAdminArea: (adminArea: IApiAdminArea) => Promise<IAdministrativeArea>;
  addAdminArea: (adminArea: IAddAdminArea) => Promise<IAdministrativeArea>;
  updateAdminArea: (id: number, data: IApiAdminArea) => Promise<IAdministrativeArea>;
}

export const useAdminAreaApi = (): AdminAreaAPI => {
  const dispatch = useAppDispatch();
  const axios = CustomAxios() as AdminAreaAPI;

  axios.interceptors.request.use(
    (config) => {
      config.headers!.Authorization = `Bearer ${store.getState().jwt}`;
      dispatch(showLoading());
      return config;
    },
    (error) => {
      dispatch(hideLoading());
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    (config) => {
      dispatch(hideLoading());
      return config;
    },
    (error) => {
      dispatch(hideLoading());
      return Promise.reject(error);
    },
  );

  /** Toasts for administrative areas */
  const deleteToasts: LifecycleToasts = {
    loadingToast: () => toast.dark('Deleting Administrative Area'),
    successToast: () => toast.dark('Administrative Area Deleted'),
    errorToast: () => toast.error('Unable to Delete Administrative Area'),
  };

  const addToasts: LifecycleToasts = {
    loadingToast: () => toast.dark('Adding Administrative Area'),
    successToast: () => toast.dark('Administrative Area Added'),
    errorToast: () => toast.error('Unable to Add Administrative Area'),
  };

  const updateToasts: LifecycleToasts = {
    loadingToast: () => toast.dark('Updating Administrative Area'),
    successToast: () => toast.dark('Administrative Area Updated'),
    errorToast: () => toast.error('Unable to Update Administrative Area'),
  };

  /**
   * Make an AJAX request to fetch the specified admin area.
   * @param filter The filter which to apply to the admin areas.
   * @returns A promise containing the admin areas.
   */
  axios.getAdminAreas = useCallback(async (filter: IAdminAreaFilter) => {
    const { data } = await axios.post<IAdministrativeArea[]>(
      `${ENVIRONMENT.apiUrl}/admin/administrative/areas/filter`,
      filter,
    );
    return data;
  }, []);

  /**
   * Make an AJAX request to fetch the specified admin area.
   * @param id The admin area key 'id' value.
   * @returns A promise containing the admin area.
   */
  axios.getAdminArea = useCallback(async (id: number) => {
    const { data } = await axios.get<IAdministrativeArea>(
      `${ENVIRONMENT.apiUrl}/admin/administrative/areas/${id}`,
    );
    return data;
  }, []);

  /**
   * Make an AJAX request to delete the specified admin area.
   * @param adminArea The admin area model in which to delete.
   * @returns A promise containing the deleted admin area.
   */
  axios.deleteAdminArea = useCallback(async (adminArea: IApiAdminArea) => {
    const { data } = await CustomAxios({
      lifecycleToasts: deleteToasts,
    }).delete<IAdministrativeArea>(
      `${ENVIRONMENT.apiUrl}/admin/administrative/areas/${adminArea.id}`,
      { data: adminArea },
    );
    return data;
  }, []);

  /**
   * Make an AJAX request to update the specified admin area.
   * @param id The admin area id in which to update.
   * @param adminArea The model containing the information in which to updated with
   * @returns A promise containing the updated admin area.
   */
  axios.updateAdminArea = useCallback(async (id: number, adminArea: IApiAdminArea) => {
    const { data } = await CustomAxios({
      lifecycleToasts: updateToasts,
    }).put<IAdministrativeArea>(
      `${ENVIRONMENT.apiUrl}/admin/administrative/areas/${id}`,
      adminArea,
    );
    return data;
  }, []);

  /**
   * Make an AJAX request to delete the specified admin area.
   * @param adminArea The admin area model in which to add.
   * @returns A promise containing the added admin area.
   */
  axios.addAdminArea = useCallback(async (adminArea: IAddAdminArea) => {
    const { data } = await CustomAxios({ lifecycleToasts: addToasts }).post<IAdministrativeArea>(
      `${ENVIRONMENT.apiUrl}/admin/administrative/areas`,
      adminArea,
    );
    return data;
  }, []);
  return axios;
};
