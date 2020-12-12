import queryString from 'query-string';
import CustomAxios from 'customAxios';
import { IPagedItems } from 'interfaces';
import { ENVIRONMENT } from 'constants/environment';
import { IPropertyQueryParams, IProperty } from './list/interfaces';

const { apiUrl: basePath } = ENVIRONMENT;

const API_ENDPOINTS = {
  propertiesSearch: (filter: IPropertyQueryParams) =>
    `${basePath}/properties/search/page?${filter ? queryString.stringify(filter) : ''}`,
  propertiesReport: (filter: IPropertyQueryParams) =>
    `${basePath}/reports/properties?${filter ? queryString.stringify(filter) : ''}`,
};

const getPropertyList = async (filter: IPropertyQueryParams): Promise<IPagedItems<IProperty>> => {
  const url = API_ENDPOINTS.propertiesSearch(filter);
  const response = await CustomAxios().get<IPagedItems<IProperty>>(url);
  return response.data;
};

const loadBuildings = async (parcelId: number): Promise<IPagedItems<IProperty>> => {
  const filter: IPropertyQueryParams = {
    page: 1,
    quantity: 10,
    parcelId: parcelId,
    propertyType: '1',
  };
  const url = API_ENDPOINTS.propertiesSearch(filter);
  const response = await CustomAxios().get<IPagedItems<IProperty>>(url);
  return response.data;
};

// TODO: Refactor later
const getPropertyReport = async (filter: IPropertyQueryParams): Promise<any> => {
  return Promise.reject('Not implemented yet');
};

export default {
  loadBuildings,
  getPropertyList,
  getPropertyReport,
};
