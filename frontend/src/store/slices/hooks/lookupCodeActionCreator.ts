import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error, storeLookupCodes } from 'store';
import * as actionTypes from 'constants/actionTypes';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';

export const getFetchLookupCodeAction = () => async (dispatch: Function) => {
  dispatch(request(actionTypes.GET_LOOKUP_CODES));
  dispatch(showLoading());
  return await CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all'))
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_LOOKUP_CODES));
      dispatch(storeLookupCodes(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_LOOKUP_CODES, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};
