import axios from 'axios';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { store } from 'store/store';

export const defaultEnvelope = (x: any) => ({ data: { records: x } });

/**
 * used by the CustomAxios method.
 * loadingToast is the message to display while the api request is pending. This toast is cancelled when the request is completed.
 * successToast is displayed when the request is completed successfully.
 * errorToast is displayed when the request fails for any reason. By default this will return an error from axios.
 */
export interface LifecycleToasts {
  loadingToast?: () => React.ReactText;
  successToast?: () => React.ReactText;
  errorToast?: () => React.ReactText;
}

/**
 * Wrapper for axios to include authentication token and error handling.
 * @param param0 Axios parameters.
 */
export const CustomAxios = ({
  lifecycleToasts,
  selector,
  envelope = defaultEnvelope,
  baseURL,
}: {
  lifecycleToasts?: LifecycleToasts;
  selector?: Function;
  envelope?: typeof defaultEnvelope;
  baseURL?: string;
} = {}) => {
  let loadingToastId: React.ReactText | undefined = undefined;
  const instance = axios.create({
    baseURL,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  instance.interceptors.request.use((config) => {
    config.headers!.Authorization = `Bearer ${store.getState().jwt}`;
    if (selector !== undefined) {
      const state = store.getState();
      const storedValue = selector(state);

      if (!isEmpty(storedValue)) {
        throw new axios.Cancel(JSON.stringify(envelope(storedValue)));
      }
    }
    if (lifecycleToasts?.loadingToast) {
      loadingToastId = lifecycleToasts.loadingToast();
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (lifecycleToasts?.successToast && response.status < 300) {
        loadingToastId && toast.dismiss(loadingToastId);
        lifecycleToasts.successToast();
      } else if (lifecycleToasts?.errorToast && response.status >= 300) {
        lifecycleToasts.errorToast();
      }
      return response;
    },
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.resolve(error.message);
      }
      if (lifecycleToasts?.errorToast) {
        loadingToastId && toast.dismiss(loadingToastId);
        lifecycleToasts.errorToast();
      }

      // TODO: This is not returning the error to an async/await try/catch implementation...
      //const errorMessage =
      //  errorToastMessage || (error.response && error.response.data.message) || String.ERROR;
      return Promise.reject(error);
    },
  );

  return instance;
};

export default CustomAxios;
