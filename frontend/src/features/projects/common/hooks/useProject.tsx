import { defaultProject } from 'features/projects/constants/defaultValues';
import { IStatus } from 'features/projects/interfaces';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';

/**
 * Find the workflow project status transition for the current workflow and specified 'from' and 'to'.
 * @param workflowStatuses An array of project status transitions for the current workflow.
 * @param fromStatusCode The current project status.
 * @param toStatusCode The desired project status.
 */
const getStatusTransitionWorkflow = (
  workflowStatuses: IStatus[],
  fromStatusCode?: string,
  toStatusCode?: string,
) => {
  const currentStatus = _.find(workflowStatuses, { code: fromStatusCode });
  if (currentStatus !== undefined) {
    return _.find(currentStatus.toStatus, { code: toStatusCode })?.workflowCode;
  }
};

/**
 * Provides a hook for managing a project.
 * Provides a way to progress a project to the next step in its lifecycle.
 * Provides a way to find a transition
 */
const useProject = () => {
  const project = useAppSelector((store) => store.project.project);
  const workflowStatuses = useAppSelector((store) => store.projectWorkflow);
  const navigate = useNavigate();

  return {
    goToStepByCode: (statusCode: string) => {
      const status: IStatus | undefined = _.find(workflowStatuses, { code: statusCode });
      navigate(`/dispose${status?.route}?projectNumber=${project?.projectNumber}`);
    },
    project: project ?? defaultProject(),
    getStatusTransitionWorkflow: (toStatusCode?: string) =>
      getStatusTransitionWorkflow(workflowStatuses, project?.statusCode, toStatusCode),
    workflowStatuses,
  };
};

export default useProject;
