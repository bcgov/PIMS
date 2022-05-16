import React from 'react';

import { IPageModel, useApi } from 'hooks/api';
import { INotificationQueueModel, IProjectModel, IProjectNotificationFilter } from '.';
import { toQueryString } from 'utils';

export const useApiProjectDisposal = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      get: (idOrProjectNumber: number | string) => {
        return api.get<IProjectModel>(`/api/projects/disposal/${idOrProjectNumber}`);
      },
      add: (model: IProjectModel) => {
        return api.post<IProjectModel>(`/api/projects/disposal`, model);
      },
      update: (model: IProjectModel) => {
        return api.put<IProjectModel>(`/api/projects/disposal/${model.id}`, model);
      },
      delete: (model: IProjectModel) => {
        return api.delete<IProjectModel>(`/api/projects/disposal/${model.id}`, { data: model });
      },
      // Status
      setStatus: (model: IProjectModel, workflow?: string, status?: string | number) => {
        const uw = workflow ? `/${workflow}` : '';
        const us = status ? `/${status}` : '';
        return api.put<IProjectModel>(`/api/projects/disposal/workflows${uw}${us}`, model);
      },
      // Notifications
      getNotifications: (id: number, page: number, quantity: number) => {
        const params = {
          page,
          quantity,
        };
        return api.get<IPageModel<INotificationQueueModel>>(
          `/api/projects/disposal/${id}/notifications?${toQueryString(params)}`,
        );
      },
      getNotificationsByFilter: (filter: IProjectNotificationFilter) => {
        return api.post<IPageModel<INotificationQueueModel>>(
          `/api/projects/disposal/notifications`,
          filter,
        );
      },
      cancelNotification: (id: number) => {
        return api.put<INotificationQueueModel[]>(
          `/api/projects/disposal/${id}/notifications/cancel`,
        );
      },
    }),
    [api],
  );

  return controller;
};
