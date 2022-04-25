import { savePropertyNames } from 'features/properties/common/slices/propertyNameSlice';
import { handleAxiosResponse } from 'utils';
import { STORE_PROPERTY_NAMES } from '../../../constants/actionTypes';
import CustomAxios from 'customAxios';
import { ENVIRONMENT } from 'constants/environment';
import queryString from 'query-string';
import { IGeoSearchParams } from 'constants/API';
import { AnyAction, Dispatch } from 'redux';

const getPropertyNames = (filter: IGeoSearchParams) =>
  `/properties/search/names?${filter ? queryString.stringify(filter) : ''}`;

export const fetchPropertyNames = (agencyId: number) => async (dispatch: Dispatch<AnyAction>) => {
  const axiosResponse = CustomAxios()
    .get(ENVIRONMENT.apiUrl + getPropertyNames({}))
    .then(response => dispatch(savePropertyNames(response.data)));
  return await handleAxiosResponse(STORE_PROPERTY_NAMES, axiosResponse)(dispatch);
};
