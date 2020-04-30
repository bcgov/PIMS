import './PropertyListView.scss';

import React from 'react';
import queryString from 'query-string';
import CustomAxios from 'customAxios';
import { AxiosResponse, AxiosError } from 'axios';
import { IPropertyFilter } from '.';
import { ENVIRONMENT } from 'constants/environment';

const getPropertyListUrl = (filter: IPropertyFilter) =>
  `${ENVIRONMENT.apiUrl}/properties/search/page?${filter ? queryString.stringify(filter) : ''}`;

export const getPropertyList = (filter: IPropertyFilter) => {
  return CustomAxios()
    .get(getPropertyListUrl(filter))
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((axiosError: AxiosError) => {
      return [];
    })
    .finally(() => {});
};

const PropertyListView: React.FC = () => {
  // const filter: IPropertyFilter = {
  //   page: 1,
  //   quantity: 50,
  //   agencies: [1, 2, 3, 4, 5, 6],
  // };

  // useEffect(() => {
  //   getPropertyList(filter);
  // }, []);

  return null;
};

export default PropertyListView;
