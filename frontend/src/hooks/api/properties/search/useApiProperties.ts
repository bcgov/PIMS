import { IPageModel, useApi } from 'hooks/api';
import React from 'react';
import { toQueryString } from 'utils';

import { IGeoFilter, ISearchFilter, ISearchPropertyModel } from '.';

export const useApiProperties = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      find: (filter: ISearchFilter) => {
        return api.post<ISearchPropertyModel[]>(`/api/properties/search/filter`, filter);
      },
      findNames: (filter: ISearchFilter) => {
        return api.get<string[]>(`/api/properties/search/names?${toQueryString(filter)}`);
      },
      findGeo: (filter: IGeoFilter) => {
        return api.post<GeoJSON.Feature<GeoJSON.Point, ISearchPropertyModel>[]>(
          `/api/properties/search/wfs/filter`,
          filter,
        );
      },
      findPage: (filter: ISearchFilter) => {
        return api.post<IPageModel<ISearchPropertyModel>>(
          `/api/properties/search/page/filter`,
          filter,
        );
      },
    }),
    [api],
  );

  return controller;
};
