import { showLoading, hideLoading } from "react-redux-loading-bar";
import { request, success, error } from "actions/genericActions";
import * as reducerTypes from "constants/reducerTypes";
import * as propertiesActions from "actions/propertiesActions";
import * as API from "constants/API";
import { ENVIRONMENT } from "constants/environment";
import CustomAxios from "customAxios";
import { AxiosResponse } from "axios";
import { createRequestHeader } from "utils/RequestHeaders";

export const fetchProperties = (propertyBounds: API.PropertyListParams) => (dispatch:Function) => {
  dispatch(request(reducerTypes.GET_PROPERTIES));
  dispatch(showLoading());
  return CustomAxios()
    .get(
      ENVIRONMENT.apiUrl + API.PROPERTIES(propertyBounds),
      createRequestHeader()
    )
    .then((response:AxiosResponse) => {
      dispatch(success(reducerTypes.GET_PROPERTIES));
      dispatch(propertiesActions.storePropertiesAction(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_PROPERTIES)))
    .finally(() => dispatch(hideLoading()));
};

export const fetchPropertyDetail = (propertyBounds: API.PropertyDetailParams) => (dispatch:Function) => {
  dispatch(request(reducerTypes.GET_PROPERTY_DETAIL));
  dispatch(showLoading());
  return CustomAxios()
    .get(
      ENVIRONMENT.apiUrl + API.PROPERTYDETAIL(propertyBounds),
      createRequestHeader()
    )
    .then((response:AxiosResponse) => {
      dispatch(success(reducerTypes.GET_PROPERTY_DETAIL));
      dispatch(propertiesActions.storePropertyDetail(response.data));
      dispatch(hideLoading());
    })
    .catch(() => dispatch(error(reducerTypes.GET_PROPERTY_DETAIL)))
    .finally(() => dispatch(hideLoading()));
};
