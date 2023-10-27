import { IBuilding, ILTSAOrderModel, IParcel } from 'actions/parcelsActions';
import { AxiosInstance } from 'axios';
import { IGeoSearchParams } from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios, { LifecycleToasts } from 'customAxios';
import { IApiProperty } from 'features/projects/interfaces';
import { GeoJsonObject } from 'geojson';
import * as _ from 'lodash';
import { useCallback } from 'react';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { useAppDispatch } from 'store';
import { store } from 'store';
import { IPropertyModel } from 'utils/csvToPropertyModel';

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
  loadProperties: (params?: IGeoSearchParams) => Promise<GeoJsonObject[]>;
  getBuilding: (id: number) => Promise<IBuilding>;
  getParcel: (id: number) => Promise<IParcel>;
  getLTSA: (id: string) => Promise<ILTSAOrderModel>;
  updateBuilding: (id: number, data: IApiProperty) => Promise<IBuilding>;
  updateParcel: (id: number, data: IApiProperty) => Promise<IParcel>;
  importProperties: (properties: IPropertyModel[]) => Promise<{
    responseCode: number;
    acceptedProperties: IPropertyModel[];
    rejectedProperties: IPropertyModel[];
  }>;
}

export interface IApiProps {
  lifecycleToasts?: LifecycleToasts;
}

export const useApi = (props?: IApiProps): PimsAPI => {
  const dispatch = useAppDispatch();
  const axios = CustomAxios({ lifecycleToasts: props?.lifecycleToasts }) as PimsAPI;

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

  axios.isPidAvailable = useCallback(
    async (parcelId: number | '' | undefined, pid: string | undefined) => {
      const pidParam = `pid=${Number(pid?.split('-').join('').split(',').join(''))}`;
      const params = parcelId ? `${pidParam}&parcelId=${parcelId}` : pidParam;
      const { data } = await axios.get(
        `${ENVIRONMENT.apiUrl}/properties/parcels/check/pid-available?${params}`,
      );
      return data;
    },
    [],
  );

  axios.isPinAvailable = useCallback(
    async (parcelId: number | '' | undefined, pin: number | '' | undefined) => {
      const pinParam = `pin=${Number(pin)}`;
      const params = parcelId ? `${pinParam}&parcelId=${parcelId}` : pinParam;
      const { data } = await axios.get(
        `${ENVIRONMENT.apiUrl}/properties/parcels/check/pin-available?${params}`,
      );
      return data;
    },
    [],
  );

  axios.searchAddress = useCallback(async (address: string): Promise<IGeocoderResponse[]> => {
    const { data } = await axios.get<IGeocoderResponse[]>(
      `${ENVIRONMENT.apiUrl}/tools/geocoder/addresses?address=${address}+BC`,
    );
    return _.orderBy(data, (r: IGeocoderResponse) => r.score, ['desc']);
  }, []);

  axios.getSitePids = useCallback(async (siteId: string): Promise<IGeocoderPidsResponse> => {
    const { data } = await axios.get<IGeocoderPidsResponse>(
      `${ENVIRONMENT.apiUrl}/tools/geocoder/parcels/pids/${siteId}`,
    );
    return data;
  }, []);

  axios.loadProperties = useCallback(
    async (params?: IGeoSearchParams): Promise<GeoJsonObject[]> => {
      try {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params ?? {})) {
          queryParams.set(key, String(value));
        }
        const { data } = await axios.get<GeoJsonObject[]>(
          `${ENVIRONMENT.apiUrl}/properties/search/wfs?${queryParams.toString()}`,
        );
        return data;
      } catch (error) {
        throw new Error(
          `${(error as any).message}: An error occurred while fetching properties in inventory.`,
        );
      }
    },
    [],
  );

  /**
   * Make an AJAX request to fetch the specified building.
   * @param id The building primary key 'id' value.
   * @returns A promise containing the building.
   */
  axios.getBuilding = useCallback(async (id: number) => {
    const { data } = await axios.get<IBuilding>(`${ENVIRONMENT.apiUrl}/properties/buildings/${id}`);
    return data;
  }, []);

  /**
   * Make an AJAX request to fetch the specified parcel.
   * @param id The parcel primary key 'id' value.
   * @returns A promise containing the parcel.
   */
  axios.getParcel = useCallback(async (id: number) => {
    const { data } = await axios.get<IParcel>(`${ENVIRONMENT.apiUrl}/properties/parcels/${id}`);
    return data;
  }, []);

  /**
   * Make an AJAX request to obtain LTSA information on a parcel.
   * @param {string} id The parcel primary id (PID).
   * @returns A promise containing the LTSA order info.
   */
  axios.getLTSA = useCallback(async (id: string) => {
    const { data } = await axios.get<ILTSAOrderModel>(
      `${ENVIRONMENT.apiUrl}/ltsa/land/title?pid=${id}`,
    );
    return data;
  }, []);

  /**
   * Make an AJAX request to update the specified parcel financials.
   * @param id The parcel primary key 'id' value.
   * @param parcel - the parcel data to be update
   * @returns A promise containing the parcel.
   */
  axios.updateParcel = useCallback(async (id: number, parcel: IApiProperty) => {
    const { data } = await axios.put<IParcel>(
      `${ENVIRONMENT.apiUrl}/properties/parcels/${id}/financials`,
      parcel,
    );
    return data;
  }, []);

  /**
   * Make an AJAX request to update the specified building financials.
   * @param id The building primary key 'id' value.
   * @param building - the building data to be update
   * @returns A promise containing the building.
   */
  axios.updateBuilding = useCallback(async (id: number, building: IApiProperty) => {
    const { data } = await axios.put<IBuilding>(
      `${ENVIRONMENT.apiUrl}/properties/buildings/${id}/financials`,
      { ...building, totalArea: building.landArea, buildingTenancy: building.buildingTenancy },
    );
    return data;
  }, []);

  /**
   * @description Attempts to send a list of properties to be inserted into the database.
   *              Will not overwrite existing parcelIds. Also doesn't return an error if those parcelIds already exist.
   * @prop {IPropertyModel[]} properties A list of properties to be added.
   * @returns A promise with the response code and list of properties not added.
   */
  axios.importProperties = useCallback(async (properties: IPropertyModel[]) => {
    const { status, data } = await axios.post<IPropertyModel[]>(
      `${ENVIRONMENT.apiUrl}/tools/import/properties`,
      properties,
    );

    // Separate properties into accepted and rejected lists.
    const acceptedProperties: IPropertyModel[] = [];
    const rejectedProperties: IPropertyModel[] = [];
    data.forEach((property: IPropertyModel) => {
      if (property.added === true || property.updated === true) {
        acceptedProperties.push(property);
      } else {
        rejectedProperties.push(property);
      }
    });

    return {
      responseCode: status,
      acceptedProperties,
      rejectedProperties,
    };
  }, []);

  return axios;
};
