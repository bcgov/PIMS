import axios from 'axios';
import { isEmpty } from 'lodash';
import { store } from 'App';

const UNAUTHORIZED = 401;
const MAINTENANCE = 503;

const defaultEnvelope = (x: any) => ({ data: { records: x } });

const CustomAxios = ({
  selector,
  envelope = defaultEnvelope,
}: { errorToastMessage?: string; selector?: Function; envelope?: typeof defaultEnvelope } = {}) => {
  const instance = axios.create();
  instance.interceptors.request.use(config => {
    if (selector !== undefined) {
      const state = store.getState();
      const storedValue = selector(state);

      if (!isEmpty(storedValue)) {
        throw new axios.Cancel(JSON.stringify(envelope(storedValue)));
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    response => response,
    error => {
      if (axios.isCancel(error)) {
        return Promise.resolve(error.message);
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
