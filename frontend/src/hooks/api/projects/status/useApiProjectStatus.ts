import React from 'react';

import { useApi } from 'hooks/api';
import { IProjectStatusModel, ITaskModel } from '.';

export const useApiProjectStatus = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      // Status
      getAll: () => {
        return api.get<IProjectStatusModel[]>(`/api/projects/status`);
      },
      // Tasks
      getTasksForStatus: (status: string | number) => {
        return api.get<ITaskModel[]>(`/api/projects/status/${status}/tasks`);
      },
    }),
    [api],
  );

  return controller;
};
