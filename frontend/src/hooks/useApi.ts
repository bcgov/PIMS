import { IBuilding, IParcel } from 'actions/parcelsActions';
import { AxiosInstance } from 'axios';
import { IGeoSearchParams } from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { IApiProperty } from 'features/projects/interfaces';
import * as _ from 'lodash';
import queryString from 'query-string';
import { useCallback } from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
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

export interface PimsAPI extends AxiosInstance {
  isPidAvailable: (
    parcelId: number | '' | undefined,
    pid: string | undefined,
  ) => Promise<{ available: boolean }>;
  isPinAvailable: (
    parcelId: number | '' | undefined,
    pin: number | '' | undefined,
  ) => Promise<{ available: boolean }>;
  searchAddress: (text: string) => Promise<IGeocoderResponse[]>;
  getSitePids: (siteId: string) => Promise<IGeocoderPidsResponse>;
  loadProperties: (params?: IGeoSearchParams) => Promise<any[]>;
  getBuilding: (id: number) => Promise<IBuilding>;
  getParcel: (id: number) => Promise<IParcel>;
  updateBuilding: (id: number, data: IApiProperty) => Promise<IBuilding>;
  updateParcel: (id: number, data: IApiProperty) => Promise<IParcel>;
}

export const useApi = (): PimsAPI => {
  const dispatch = useAppDispatch();
  const token = store.getState().jwt;

  const axios = CustomAxios() as PimsAPI;
  axios.interceptors.request.use(
    (config) => {
      config!.headers!.Authorization = `Bearer ${token}`;
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

  axios.isPidAvailable = useCallback(
    async (parcelId: number | '' | undefined, pid: string | undefined) => {
      const pidParam = `pid=${Number(pid?.split('-').join('').split(',').join(''))}`;
      let params = parcelId ? `${pidParam}&parcelId=${parcelId}` : pidParam;
      const { data } = await axios.get(
        `${ENVIRONMENT.apiUrl}/properties/parcels/check/pid-available?${params}`,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  axios.isPinAvailable = useCallback(
    async (parcelId: number | '' | undefined, pin: number | '' | undefined) => {
      const pinParam = `pin=${Number(pin)}`;
      let params = parcelId ? `${pinParam}&parcelId=${parcelId}` : pinParam;
      const { data } = await axios.get(
        `${ENVIRONMENT.apiUrl}/properties/parcels/check/pin-available?${params}`,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  axios.searchAddress = useCallback(
    async (address: string): Promise<IGeocoderResponse[]> => {
      const { data } = await axios.get<IGeocoderResponse[]>(
        `${ENVIRONMENT.apiUrl}/tools/geocoder/addresses?address=${address}+BC`,
      );
      return _.orderBy(data, (r: IGeocoderResponse) => r.score, ['desc']);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  axios.getSitePids = useCallback(
    async (siteId: string): Promise<IGeocoderPidsResponse> => {
      const { data } = await axios.get<IGeocoderPidsResponse>(
        `${ENVIRONMENT.apiUrl}/tools/geocoder/parcels/pids/${siteId}`,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  axios.loadProperties = useCallback(
    async (params?: IGeoSearchParams): Promise<any[]> => {
      try {
        const { data } = await axios.get<any[]>(
          `${ENVIRONMENT.apiUrl}/properties/search/wfs?${
            params ? queryString.stringify(params) : ''
          }`,
        );
        return data;
      } catch (error) {
        throw new Error(
          `${(error as any).message}: An error occurred while fetching properties in inventory.`,
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Make an AJAX request to fetch the specified building.
   * @param id The building primary key 'id' value.
   * @returns A promise containing the building.
   */
  axios.getBuilding = useCallback(
    async (id: number) => {
      const { data } = await axios.get<IBuilding>(
        `${ENVIRONMENT.apiUrl}/properties/buildings/${id}`,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Make an AJAX request to fetch the specified parcel.
   * @param id The parcel primary key 'id' value.
   * @returns A promise containing the parcel.
   */
  axios.getParcel = useCallback(
    async (id: number) => {
      const { data } = await axios.get<IParcel>(`${ENVIRONMENT.apiUrl}/properties/parcels/${id}`);
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Make an AJAX request to update the specified parcel financials.
   * @param id The parcel primary key 'id' value.
   * @param parcel - the parcel data to be update
   * @returns A promise containing the parcel.
   */
  axios.updateParcel = useCallback(
    async (id: number, parcel: IApiProperty) => {
      const { data } = await axios.put<IParcel>(
        `${ENVIRONMENT.apiUrl}/properties/parcels/${id}/financials`,
        parcel,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Make an AJAX request to update the specified building financials.
   * @param id The building primary key 'id' value.
   * @param building - the building data to be update
   * @returns A promise containing the building.
   */
  axios.updateBuilding = useCallback(
    async (id: number, building: IApiProperty) => {
      const { data } = await axios.put<IBuilding>(
        `${ENVIRONMENT.apiUrl}/properties/buildings/${id}/financials`,
        { ...building, totalArea: building.landArea },
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return axios;
};
