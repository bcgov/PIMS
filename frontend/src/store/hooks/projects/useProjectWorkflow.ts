import { useApiProjectWorkflow } from 'hooks/api/projects/workflows';
import React from 'react';
import { useNetwork } from '../network';

export const useProjectWorkflow = () => {
  const network = useNetwork();
  const api = useApiProjectWorkflow();

  const controller = React.useMemo(
    () => ({
      getStatusFor: (workflowCode: string) => {
        return network.handleRequest('project-status-for', () => api.getStatusFor(workflowCode));
      },
      getTasksFor: (workflowCode: string) => {
        return network.handleRequest('project-tasks-for', () => api.getTasksFor(workflowCode));
      },
    }),
    [api, network],
  );
  return controller;
};
