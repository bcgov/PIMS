import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import CustomAxios from 'customAxios';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import { AnyAction, Dispatch } from 'redux';
import { storeError, storeRequest, storeSuccess } from 'store';
import { error, request, success } from 'store/slices/hooks';

/**
 * Download configuration options interface.
 */
export interface IDownloadConfig extends AxiosRequestConfig {
  fileName: string;
  actionType: string;
}

/**
 * Make an AJAX request to download content from the specified endpoint.
 * @param config - Configuration options to make an AJAX request to download content.
 * @param config.url - The url to the endpoint.
 * @param config.actionType - The action type name to identify the request in the redux store.
 * @param config.method - The HTTP method to use.
 * @param config.headers - The HTTP request headers to include.  By default it will include the JWT bearer token.
 * @param config.fileName - The file name you want to save the download as.  By default it will use the current date.
 */
const download = (config: IDownloadConfig) => async (dispatch: Dispatch<AnyAction>) => {
  const options = { ...config, headers: { ...config.headers } };
  dispatch(storeRequest(request(options.actionType)));
  dispatch(showLoading());
  return await CustomAxios()
    .request({
      url: options.url,
      headers: options.headers,
      method: options.method ?? 'get',
      responseType: options.responseType ?? 'blob',
      data: options.data,
    })
    .then((response: AxiosResponse) => {
      dispatch(storeSuccess(success(options.actionType)));

      const uri = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = uri;
      link.setAttribute('download', options.fileName ?? new Date().toDateString());
      document.body.appendChild(link);
      link.click();
    })
    .catch((axiosError: AxiosError) =>
      dispatch(storeError(error(options.actionType, axiosError?.response?.status, axiosError))),
    )
    .finally(() => dispatch(hideLoading()));
};

export default download;
