import CustomAxios from 'customAxios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AxiosInstance } from 'axios';
import { ENVIRONMENT } from 'constants/environment';

interface PimsAPI extends AxiosInstance {
  isPidAvailable: (
    parcelId: number | '' | undefined,
    pid: string | undefined,
  ) => Promise<{ available: boolean }>;
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
    const { data } = await axios.get(`${ENVIRONMENT.apiUrl}/parcels/check/pid-available?${params}`);
    return data;
  };

  return axios;
};
