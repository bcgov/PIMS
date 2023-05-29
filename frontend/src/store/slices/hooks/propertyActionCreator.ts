import { IGeoSearchParams } from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { savePropertyNames } from 'features/properties/common/slices/propertyNameSlice';
import { AnyAction, Dispatch } from 'redux';
import { handleAxiosResponse } from 'utils';

import { STORE_PROPERTY_NAMES } from '../../../constants/actionTypes';

const getPropertyNames = (filter: IGeoSearchParams) => {
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filter ?? {})) {
    queryParams.set(key, String(value));
  }
  return `/properties/search/names?${queryParams.toString()}`;
};

export const fetchPropertyNames = () => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + getPropertyNames({}))
    .then((response) => dispatch(savePropertyNames(response.data)));
  return await handleAxiosResponse(STORE_PROPERTY_NAMES, axiosResponse)(dispatch);
};
