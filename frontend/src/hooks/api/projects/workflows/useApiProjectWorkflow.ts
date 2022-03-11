import React from 'react';

import { useApi } from 'hooks/api';
import { IProjectStatusModel, ITaskModel } from '.';

export const useApiProjectWorkflow = () => {
  const api = useApi();

  const controller = React.useMemo(
    () => ({
      getStatusFor: (workflowCode: string) => {
        return api.get<IProjectStatusModel[]>(`/api/projects/workflows/${workflowCode}/status`);
      },
      getTasksFor: (workflowCode: string) => {
        return api.get<ITaskModel[]>(`/api/projects/workflows/${workflowCode}/tasks`);
      },
    }),
    [api],
  );

  return controller;
};
