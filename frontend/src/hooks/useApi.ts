import CustomAxios from 'customAxios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';
import * as _ from 'lodash';
import { LatLngTuple } from 'leaflet';
import { useCallback } from 'react';
import { IGeoSearchParams } from 'constants/API';
import queryString from 'query-string';
import { IBuilding, IParcel } from 'actions/parcelsActions';
import { store } from 'App';
import { IApiProperty } from 'features/projects/common';

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
  getAdministrativeAreaLatLng: (city: string) => Promise<LatLngTuple | null>;
  loadProperties: (params?: IGeoSearchParams) => Promise<any[]>;
  getBuilding: (id: number) => Promise<IBuilding>;
  getParcel: (id: number) => Promise<IParcel>;
  updateBuilding: (id: number, data: IApiProperty) => Promise<IBuilding>;
  updateParcel: (id: number, data: IApiProperty) => Promise<IParcel>;
}

export const useApi = (): PimsAPI => {
  const dispatch = useDispatch();
  const axios = CustomAxios() as PimsAPI;

  axios.interceptors.request.use(
    config => {
      config.headers.Authorization = `Bearer ${store.getState().jwt}`;
      dispatch(showLoading());
      return config;
    },
    error => {
      dispatch(hideLoading());
      return Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    config => {
      dispatch(hideLoading());
      return config;
    },
    error => {
      dispatch(hideLoading());
      return Promise.reject(error);
    },
  );

  axios.isPidAvailable = useCallback(
    async (parcelId: number | '' | undefined, pid: string | undefined) => {
      const pidParam = `pid=${Number(
        pid
          ?.split('-')
          .join('')
          .split(',')
          .join(''),
      )}`;
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

  axios.getAdministrativeAreaLatLng = useCallback(
    async (address: string): Promise<LatLngTuple | null> => {
      const { data } = await axios.get<IGeocoderResponse[]>(
        `${ENVIRONMENT.apiUrl}/tools/geocoder/addresses?address=${address}+BC`,
      );

      if (data.length === 0) {
        return null;
      }
      const highestMatch = _.orderBy(data, (r: IGeocoderResponse) => r.score, ['desc'])[0];
      return [highestMatch.latitude, highestMatch.longitude];
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
          `${(error as any).message}: An error occured while fetching properties in inventory.`,
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
        building,
      );
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return axios;
};
