import axios, { AxiosInstance } from "axios";
import { isEmpty } from "lodash";
import { store } from "App";

const UNAUTHORIZED = 401;
const MAINTENANCE = 503;
const TEAPOT = 418;

const defaultEnvelope = (x:any) => ({ data: { records: x } });

const sleepRequest = (instance:AxiosInstance, milliseconds:number, originalRequest:any) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(instance(originalRequest)), milliseconds);
  });
};

const errorCount:any = {};

const CustomAxios = ({ errorToastMessage, selector, envelope = defaultEnvelope }: {errorToastMessage?: string; selector?:Function; envelope?: typeof defaultEnvelope} = {}) => {
  const instance = axios.create();
  instance.interceptors.request.use((config) => {
    if (selector !== undefined) {
      const state = store.getState();
      const storedValue = selector(state);

      if (!isEmpty(storedValue)) {
        throw new axios.Cancel(JSON.stringify(envelope(storedValue)))
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.resolve(error.message);
      }

      errorCount[error.config.url] = errorCount[error.config.url]
        ? errorCount[error.config.url] + 1
        : 1;
      const numberOfErrors = errorCount[error.config.url];

      const status = error.response ? error.response.status : null;
      //const errorMessage =
      //  errorToastMessage || (error.response && error.response.data.message) || String.ERROR;

      if (status === UNAUTHORIZED || status === MAINTENANCE) {
        window.location.reload(false);
      } else if (status === TEAPOT || process.env.NODE_ENV === "development") {
        // Do not retry in dev env, or for axios calls made in frontend tests, which are configured to return status code 418
        //TODO: come up with a way of displaying request failures.
        //   notification.error({
        //     message: `${errorMessage}`,
        //     duration: 10,
        //   });
        //   return Promise.reject(error);
        // } else if (numberOfErrors > 3) {
        //   notification.error({
        //     message: String.ERROR_CANCELED,
        //     duration: 10,
        //   });
        //   errorCount[error.config.url] = 0;
        //   return Promise.reject(error);
        // } else {
        //   notification.error({
        //     message: `${errorMessage} Retrying... (${numberOfErrors} times)`,
        //     duration: 10,
        //   });
        return sleepRequest(instance, 1000 * numberOfErrors ** 2, error.config);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default CustomAxios;
