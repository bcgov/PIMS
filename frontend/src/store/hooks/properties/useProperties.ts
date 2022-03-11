import { IGeoFilter, ISearchFilter, useApiProperties } from 'hooks/api/properties/search';
import React from 'react';
import { useNetwork } from '../network';

export const useProperties = () => {
  const network = useNetwork();
  const api = useApiProperties();

  const controller = React.useMemo(
    () => ({
      find: (filter: ISearchFilter) => {
        return network.handleRequest('properties-find', () => api.find(filter));
      },
      findNames: (filter: ISearchFilter) => {
        return network.handleRequest('properties-findNames', () => api.findNames(filter));
      },
      findGeo: (filter: IGeoFilter) => {
        return network.handleRequest('properties-findGeo', () => api.findGeo(filter));
      },
      findPage: (filter: ISearchFilter) => {
        return network.handleRequest('properties-findPage', () => api.findPage(filter));
      },
    }),
    [api, network],
  );
  return controller;
};
