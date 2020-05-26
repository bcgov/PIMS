import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as actionTypes from 'constants/actionTypes';
import * as lookupActions from 'actions/lookupActions';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';

export const getFetchLookupCodeAction = () => (dispatch: Function) => {
  dispatch(request(actionTypes.GET_LOOKUP_CODES));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all'))
    .then((response: AxiosResponse) => {
      dispatch(success(actionTypes.GET_LOOKUP_CODES));
      dispatch(lookupActions.storeLookupCodesAction(response.data));
      dispatch(hideLoading());
    })
    .catch((axiosError: AxiosError) =>
      dispatch(error(actionTypes.GET_LOOKUP_CODES, axiosError?.response?.status, axiosError)),
    )
    .finally(() => dispatch(hideLoading()));
};
