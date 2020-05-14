import CustomAxios from 'customAxios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export const useApi = () => {
  const dispatch = useDispatch();
  const axios = CustomAxios();

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

  return axios;
};
