import { useApiProjectStatus } from 'hooks/api/projects/status';
import React from 'react';
import { useNetwork } from '../network';

export const useProjectStatus = () => {
  const network = useNetwork();
  const api = useApiProjectStatus();

  const controller = React.useMemo(
    () => ({
      getAll: () => {
        return network.handleRequest('project-status-get', () => api.getAll());
      },
      getTasksForStatus: (status: string | number) => {
        return network.handleRequest('project-tasks-for-status', () =>
          api.getTasksForStatus(status),
        );
      },
    }),
    [api, network],
  );
  return controller;
};
