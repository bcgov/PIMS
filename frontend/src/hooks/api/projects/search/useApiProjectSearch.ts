import { IPageModel, useApi } from 'hooks/api';
import React from 'react';
import { toQueryString } from 'utils';

import { IProjectFilter, IProjectModel } from '.';

export const useApiProjectSearch = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      find: (page: number, quantity: number) => {
        const params = {
          page,
          quantity,
        };
        return api.get<IPageModel<IProjectModel>>(`/api/projects/search?${toQueryString(params)}`);
      },
      findByFilter: (filter: IProjectFilter) => {
        return api.post<IPageModel<IProjectModel>>(`/api/projects/search`, filter);
      },
    }),
    [api],
  );

  return controller;
};
