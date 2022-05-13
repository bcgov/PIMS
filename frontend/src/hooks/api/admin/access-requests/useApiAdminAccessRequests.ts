import { IPageModel, useApi } from 'hooks/api';
import React from 'react';
import { toQueryString } from 'utils';

import { IAccessRequestFilter, IAccessRequestModel } from '.';

export const useApiAdminAccessRequests = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      find: (filter: IAccessRequestFilter) => {
        return api.get<IPageModel<IAccessRequestModel>>(
          `/admin/access/requests?${toQueryString(filter)}`,
        );
      },
      remove: (model: IAccessRequestModel) => {
        return api.delete<IAccessRequestModel>(`/admin/access/requests/${model.id}`, {
          data: model,
        });
      },
    }),
    [api],
  );

  return controller;
};
