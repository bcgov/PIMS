import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from 'actions/genericActions';
import * as reducerTypes from 'constants/reducerTypes';
import * as lookupActions from 'actions/lookupActions';
import * as API from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { AxiosResponse } from 'axios';
import { createRequestHeader } from 'utils/RequestHeaders';

export const getFetchLookupCodeAction = () => (dispatch: Function) => {
  dispatch(request(reducerTypes.GET_LOOKUP_CODES));
  dispatch(showLoading());
  return CustomAxios()
    .get(ENVIRONMENT.apiUrl + API.LOOKUP_CODE_SET('all'), createRequestHeader())
    .then((response: AxiosResponse) => {
      dispatch(success(reducerTypes.GET_LOOKUP_CODES));
      dispatch(lookupActions.storeLookupCodesAction(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_LOOKUP_CODES)))
    .finally(() => dispatch(hideLoading()));
};
