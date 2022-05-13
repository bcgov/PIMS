import React from 'react';

import { useApi } from 'hooks/api';
import { IAccessRequestModel } from '.';

export const useApiAccessRequests = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      get: (id?: number) => {
        return api.get<IAccessRequestModel>(`/users/access/requests${id ? '/' + id : ''}`);
      },
      add: (model: IAccessRequestModel) => {
        return api.post<IAccessRequestModel>('/users/access/requests', model);
      },
      update: (model: IAccessRequestModel) => {
        return api.put<IAccessRequestModel>(`/users/access/requests/${model.id}`, model);
      },
    }),
    [api],
  );

  return controller;
};
