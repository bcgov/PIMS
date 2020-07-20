import CustomAxios from 'customAxios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';
import * as _ from 'lodash';

export interface IGeocoderResponse {
  siteId: string;
  fullAddress: string;
  address1: string;
  city: string;
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
  searchAddress: (text: string) => Promise<IGeocoderResponse[]>;
  getSitePids: (siteId: string) => Promise<IGeocoderPidsResponse>;
}

export const useApi = (): PimsAPI => {
  const dispatch = useDispatch();
  const axios = CustomAxios() as PimsAPI;

  axios.interceptors.request.use(
    config => {
      dispatch(showLoading());
      return config;
    },
    error => dispatch(hideLoading()),
  );

  axios.interceptors.response.use(
    config => {
      dispatch(hideLoading());
      return config;
    },
    error => dispatch(hideLoading()),
  );

  axios.isPidAvailable = async (parcelId: number | '' | undefined, pid: string | undefined) => {
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
  };

  axios.searchAddress = async (address: string): Promise<IGeocoderResponse[]> => {
    const { data } = await axios.get<IGeocoderResponse[]>(
      `${ENVIRONMENT.apiUrl}/tools/geocoder/addresses?address=${address}+BC`,
    );
    return _.orderBy(data, (r: IGeocoderResponse) => r.score, ['desc']);
  };

  axios.getSitePids = async (siteId: string): Promise<IGeocoderPidsResponse> => {
    const { data } = await axios.get<IGeocoderPidsResponse>(
      `${ENVIRONMENT.apiUrl}/tools/geocoder/parcels/pids/${siteId}`,
    );
    return data;
  };

  return axios;
};
