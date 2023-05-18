import { ProjectActions } from 'constants/actionTypes';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { defaultProject } from 'features/projects/constants/defaultValues';
import { IProject, IProjectTask, IStatus } from 'features/projects/interfaces';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import _ from 'lodash';
import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';

import { StepperContext } from '..';

/**
 * Get the status after the current status in this workflow. Return undefined if there is no next step.
 * @param workflowStatuses A list of all relevant workflowStatuses
 * @param currentStatus The current status within the above list
 */
export const getNextWorkflowStatus = (
  workflowStatuses: IStatus[],
  currentStatus: IStatus | undefined,
) => {
  if (!currentStatus) {
    return workflowStatuses[0];
  }
  const requiredStatuses = workflowStatuses.filter((s) => !s.isOptional);
  // return undefined to indicate all steps have been completed.
  if (currentStatus.sortOrder >= requiredStatuses.length - 1) {
    return undefined;
  }
  const currentStatusIndex = currentStatus.sortOrder + 1;
  return requiredStatuses[currentStatusIndex];
};

/**
 * Determine if the status passed to this function has been completed in the given project for this workflow.
 * @param workflowStatuses A list of all relevant workflowStatuses
 * @param status The status to check for completion
 * @param project The project that is going through this workflow
 */
export const isStatusCompleted = (
  workflowStatuses: IStatus[],
  status?: IStatus,
  project?: IProject,
): boolean => {
  if (project === undefined || status === undefined) {
    return false;
  }
  const furthestCompletedStep = _.findLast(workflowStatuses, { id: project?.statusId });
  return !!(
    furthestCompletedStep?.sortOrder && furthestCompletedStep?.sortOrder > status.sortOrder
  );
};

/**
 * Is the user allowed to navigate to this status, based on their current status within this project?
 * @param workflowStatuses A list of all relevant workflowStatuses
 * @param status The status to check for navigability
 * @param project The project that is going through this workflow
 */
export const isStatusNavigable = (
  workflowStatuses: IStatus[],
  status: IStatus,
  project?: IProject,
) => {
  if (!project) {
    return status.sortOrder === 0;
  }
  const furthestCompletedStep = _.findLast(workflowStatuses, { id: project?.statusId });
  if (!furthestCompletedStep) {
    return false;
  }
  return status.sortOrder <= furthestCompletedStep.sortOrder;
};

/**
 * Get the last completed status (step) for this project workflow.
 * @param workflowStatuses A list of all relevant workflowStatuses
 * @param currentStatus The current status within the above list
 * @param project The project that is going through this workflow
 */
export const getLastCompletedStatus = (
  workflowStatuses: IStatus[],
  currentStatus: IStatus,
  project?: IProject,
) => {
  if (!project) {
    return undefined;
  }
  const furthestCompletedStep = _.findLast(workflowStatuses, { id: project?.statusId });
  if (
    (currentStatus?.sortOrder !== undefined &&
      currentStatus.sortOrder >= (furthestCompletedStep?.sortOrder ?? 0)) ||
    furthestCompletedStep?.sortOrder === 0
  ) {
    return currentStatus;
  }
  return furthestCompletedStep;
};

/**
 * Hook providing status(step) logic methods as well as actual state.
 * Used to synchronize stepper UI with step UI.
 */
const useStepper = () => {
  const navigate = useNavigate();
  const keycloak = useKeycloakWrapper();
  const { currentStatus, setCurrentStatus, disposeWorkflowStatuses } = useContext(StepperContext);
  const initialProject = useMemo(
    () => ({
      ...defaultProject(),
      agencyId: keycloak.agencyId!,
    }),
    [keycloak],
  );
  const project: IProject = useAppSelector((store) => store.project.project) || initialProject;
  const workflowTasks: IProjectTask[] = useAppSelector((store) => store.tasks) || {
    ...defaultProject(),
    agencyId: keycloak.agencyId!,
  };
  const getProjectRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.GET_PROJECT],
  );
  const updateWorkflowStatusRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.UPDATE_WORKFLOW_STATUS],
  );

  useEffect(() => {
    const lastCompletedStatus = _.findLast(disposeWorkflowStatuses, { id: project?.statusId });
    if (
      lastCompletedStatus?.sortOrder !== undefined && // TODO: Stop using 'sortOrder' for index positioning.  It'll cause bugs.
      currentStatus?.sortOrder !== undefined &&
      getProjectRequest?.isFetching === false &&
      currentStatus.sortOrder > lastCompletedStatus.sortOrder
    ) {
      throw Error('You must complete all project disposal steps in order');
    }
    if (
      project?.statusId !== undefined &&
      project.statusId > 0 &&
      project.statusCode !== ReviewWorkflowStatus.ExemptionReview &&
      disposeWorkflowStatuses?.length > 0 &&
      updateWorkflowStatusRequest === undefined &&
      currentStatus?.id !== undefined &&
      _.find(disposeWorkflowStatuses, { id: project.statusId }) === undefined &&
      _.find(disposeWorkflowStatuses, { id: currentStatus.id })?.sortOrder !== undefined
    ) {
      throw Error('You cannot edit a project disposal form after it has been submitted');
    }
  }, [
    currentStatus,
    disposeWorkflowStatuses,
    getProjectRequest,
    project,
    updateWorkflowStatusRequest,
  ]);

  return {
    currentStatus,
    setCurrentStatus,
    project,
    workflowStatuses: disposeWorkflowStatuses,
    workflowTasks,
    getStatusById: (statusId: number): IStatus | undefined =>
      _.find(disposeWorkflowStatuses, { id: statusId }),
    getStatusByCode: (statusCode: string): IStatus | undefined =>
      _.find(disposeWorkflowStatuses, { code: statusCode }),
    getNextStep: (status?: IStatus) =>
      getNextWorkflowStatus(disposeWorkflowStatuses, status ?? currentStatus),
    goToNextStep: (overrideProject?: IProject): number | undefined => {
      const currentProject = overrideProject ?? project;
      const nextStatus = getNextWorkflowStatus(disposeWorkflowStatuses, currentStatus);
      if (!nextStatus) {
        return undefined;
      }
      currentProject.projectNumber !== undefined &&
        navigate(`/dispose${nextStatus.route}?projectNumber=${currentProject.projectNumber}`);
      return nextStatus.id;
    },
    projectStatusCompleted: (status?: IStatus) =>
      isStatusCompleted(disposeWorkflowStatuses, status, project),
    canGoToStatus: (status: IStatus) => isStatusNavigable(disposeWorkflowStatuses, status, project),
    getLastCompletedStatus: () =>
      getLastCompletedStatus(disposeWorkflowStatuses, currentStatus, project),
    goToStepById: (statusId: number) => {
      const status: IStatus | undefined = _.find(disposeWorkflowStatuses, { id: statusId });
      navigate(`..${status?.route}?projectNumber=${project.projectNumber}`);
    },
    goToStepByCode: (statusCode: string) => {
      const status: IStatus | undefined = _.find(disposeWorkflowStatuses, { code: statusCode });
      navigate(`..${status?.route}?projectNumber=${project.projectNumber}`);
    },
    goToDisposePath: (path: string) => navigate(`./${path}?projectNumber=${project.projectNumber}`),
  };
};
export default useStepper;
