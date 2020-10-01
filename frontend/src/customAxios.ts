import axios from 'axios';
import { isEmpty } from 'lodash';
import { store } from 'App';
import { toast } from 'react-toastify';

const UNAUTHORIZED = 401;
const MAINTENANCE = 503;

const defaultEnvelope = (x: any) => ({ data: { records: x } });

/**
 * used by the CustomAxios method.
 * loadingToast is the message to display while the api request is pending. This toast is cancelled when the request is completed.
 * successToast is displayed when the request is completed successfully.
 * errorToast is displayed when the request fails for any reason. By default this will return an error from axios.
 */
export interface LifecycleToasts {
  loadingToast: () => React.ReactText;
  successToast: () => React.ReactText;
  errorToast?: () => React.ReactText;
}

const CustomAxios = ({
  lifecycleToasts,
  selector,
  envelope = defaultEnvelope,
}: {
  lifecycleToasts?: LifecycleToasts;
  selector?: Function;
  envelope?: typeof defaultEnvelope;
} = {}) => {
  let loadingToastId: React.ReactText | undefined = undefined;
  const instance = axios.create({
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${store.getState().jwt}`,
    },
  });
  instance.interceptors.request.use(config => {
    if (selector !== undefined) {
      const state = store.getState();
      const storedValue = selector(state);

      if (!isEmpty(storedValue)) {
        throw new axios.Cancel(JSON.stringify(envelope(storedValue)));
      }
    }
    if (lifecycleToasts) {
      loadingToastId = lifecycleToasts.loadingToast();
    }
    return config;
  });

  instance.interceptors.response.use(
    response => {
      if (lifecycleToasts) {
        loadingToastId && toast.dismiss(loadingToastId);
        lifecycleToasts.successToast();
      }
      return response;
    },
    error => {
      if (axios.isCancel(error)) {
        return Promise.resolve(error.message);
      }

      if (lifecycleToasts?.errorToast) {
        loadingToastId && toast.dismiss(loadingToastId);
        lifecycleToasts.errorToast();
      }

      const status = error.response ? error.response.status : null;
      //const errorMessage =
      //  errorToastMessage || (error.response && error.response.data.message) || String.ERROR;

      if (status === UNAUTHORIZED || status === MAINTENANCE) {
        window.location.reload(false);
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export default CustomAxios;
