import { IGeoSearchParams } from 'constants/API';
import { ENVIRONMENT } from 'constants/environment';
import CustomAxios from 'customAxios';
import { savePropertyNames } from 'features/properties/common/slices/propertyNameSlice';
import queryString from 'query-string';
import { AnyAction, Dispatch } from 'redux';
import { handleAxiosResponse } from 'utils';

import { STORE_PROPERTY_NAMES } from '../../../constants/actionTypes';

const getPropertyNames = (filter: IGeoSearchParams) =>
  `/properties/search/names?${filter ? queryString.stringify(filter) : ''}`;

export const fetchPropertyNames = (agencyId: number) => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + getPropertyNames({}))
    .then(response => dispatch(savePropertyNames(response.data)));
  return await handleAxiosResponse(STORE_PROPERTY_NAMES, axiosResponse)(dispatch);
};
