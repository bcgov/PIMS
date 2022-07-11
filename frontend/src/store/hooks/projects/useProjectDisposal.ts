import { toForm } from 'features/projects/disposals/utils';
import {
  IProjectModel,
  IProjectNotificationFilter,
  useApiProjectDisposal,
} from 'hooks/api/projects/disposals';
import React from 'react';
import { useProjectStore } from 'store/slices/hooks';

import { useNetwork } from '../network';

export const useProjectDisposal = () => {
  const network = useNetwork();
  const api = useApiProjectDisposal();
  const [, store] = useProjectStore();

  const controller = React.useMemo(
    () => ({
      get: async (idOrProjectNumber: number | string) => {
        const response = await network.handleRequest('project-get', () =>
          api.get(idOrProjectNumber),
        );
        store.storeProject(toForm(response?.data));
        return response;
      },
      add: async (model: IProjectModel) => {
        const response = await network.handleRequest('project-add', () => api.add(model));
        store.storeProject(toForm(response?.data));
        return response;
      },
      update: async (model: IProjectModel) => {
        const response = await network.handleRequest('project-update', () => api.update(model));
        store.storeProject(toForm(response?.data));
        return response;
      },
      delete: async (model: IProjectModel) => {
        const response = await network.handleRequest('project-delete', () => api.delete(model));
        store.storeProject(undefined);
        return response;
      },
      setStatus: async (model: IProjectModel, workflow?: string, status?: string | number) => {
        const response = await network.handleRequest('project-status', () =>
          api.setStatus(model, workflow, status),
        );
        store.storeProject(toForm(response?.data));
        return response;
      },
      getNotifications: (id: number, page: number, quantity: number) => {
        return network.handleRequest('project-notifications', () =>
          api.getNotifications(id, page, quantity),
        );
      },
      getNotificationsByFilter: (filter: IProjectNotificationFilter) => {
        return network.handleRequest('project-notifications', () =>
          api.getNotificationsByFilter(filter),
        );
      },
      cancelNotification: (id: number) => {
        return network.handleRequest('project-notification-cancel', () =>
          api.cancelNotification(id),
        );
      },
    }),
    [api, network, store],
  );
  return controller;
};
