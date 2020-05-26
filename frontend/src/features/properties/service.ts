import queryString from 'query-string';
import CustomAxios from 'customAxios';
import { IPagedItems } from 'interfaces';
import { ENVIRONMENT } from 'constants/environment';
import { IPropertyFilter, IProperty } from './list/interfaces';

const { apiUrl: basePath } = ENVIRONMENT;

const API_ENDPOINTS = {
  propertiesSearch: (filter: IPropertyFilter) =>
    `${basePath}/properties/search/page?${filter ? queryString.stringify(filter) : ''}`,
  propertiesReport: (filter: IPropertyFilter) =>
    `${basePath}/reports/properties?${filter ? queryString.stringify(filter) : ''}`,
};

const getPropertyList = async (filter: IPropertyFilter): Promise<IPagedItems<IProperty>> => {
  const url = API_ENDPOINTS.propertiesSearch(filter);
  const response = await CustomAxios().get<IPagedItems<IProperty>>(url);
  return response.data;
};

// TODO: Refactor later
const getPropertyReport = async (filter: IPropertyFilter): Promise<any> => {
  return Promise.reject('Not implemented yet');
};

export default {
  getPropertyList,
  getPropertyReport,
};
