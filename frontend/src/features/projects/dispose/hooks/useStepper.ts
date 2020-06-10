import { useEffect, useContext } from 'react';
import { fetchProjectWorkflow } from '../projectsActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  IProject,
  initialValues,
  IStatus,
  StepperContext,
  IProjectWrapper,
  IProjectTask,
} from '..';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

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
  // return undefined to indicate all steps have been completed.
  if (currentStatus.sortOrder >= workflowStatuses.length - 1) {
    return undefined;
  }
  const currentStatusIndex = currentStatus.sortOrder + 1;
  return workflowStatuses[currentStatusIndex];
};

/**
 * Determine if the status passed to this function has been completed in the given project for this workflow.
 * @param workflowStatuses A list of all relevant workflowStatuses
 * @param status The status to check for completion
 * @param project The project that is going through this workflow
 */
export const isStatusCompleted = (
  workflowStatuses: IStatus[],
  status: IStatus,
  project?: IProject,
): boolean => {
  if (!project) {
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
const getLastCompletedStatusId = (
  workflowStatuses: IStatus[],
  currentStatus: IStatus,
  project?: IProject,
) => {
  if (!project) {
    return 0;
  }
  const furthestCompletedStep = _.findLast(workflowStatuses, { id: project?.statusId });
  if (
    currentStatus.sortOrder >= (furthestCompletedStep?.sortOrder ?? 0) ||
    furthestCompletedStep?.sortOrder === 0
  ) {
    return currentStatus.sortOrder + 1;
  }
  return project.statusId;
};

/**
 * Hook providing status(step) logic methods as well as actual state.
 * Used to synchronize stepper UI with step UI.
 */
const useStepper = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentStatus, setCurrentStatus } = useContext(StepperContext);
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const project: any =
    useSelector<RootState, IProjectWrapper>(state => state.project).project || initialValues;
  const workflowTasks: IProjectTask[] =
    useSelector<RootState, IProjectTask[]>(state => state.tasks) || initialValues;
  useEffect(() => {
    if (!workflowStatuses?.length) {
      dispatch(fetchProjectWorkflow());
    }
  }, [dispatch, workflowStatuses]);

  return {
    currentStatus,
    setCurrentStatus,
    project,
    workflowStatuses,
    workflowTasks,
    getStatusById: (statusId: number): IStatus | undefined =>
      _.find(workflowStatuses, { id: statusId }),
    getNextStep: () => getNextWorkflowStatus(workflowStatuses, currentStatus),
    nextStep: (): boolean => {
      const nextStatus = getNextWorkflowStatus(workflowStatuses, currentStatus);
      if (!nextStatus) {
        return false;
      }
      setCurrentStatus(nextStatus);
      history.push(`/dispose${nextStatus.route}?projectNumber=${project.projectNumber}`);
      return true;
    },
    projectStatusCompleted: (status: IStatus) =>
      isStatusCompleted(workflowStatuses, status, project),
    canGoToStatus: (status: IStatus) => isStatusNavigable(workflowStatuses, status, project),
    getLastCompletedStatusId: () =>
      getLastCompletedStatusId(workflowStatuses, currentStatus, project),
    goToStep: (statusId: number) =>
      history.push(
        `/dispose${workflowStatuses[statusId].route}?projectNumber=${project.projectNumber}`,
      ),
  };
};
export default useStepper;
