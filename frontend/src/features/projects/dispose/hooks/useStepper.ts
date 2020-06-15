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
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';

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
const getLastCompletedStatus = (
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
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentStatus, setCurrentStatus } = useContext(StepperContext);
  const diposeWorkflowStatuses = useSelector<RootState, IStatus[]>(
    state => state.projectWorkflow as any,
  );
  const project: any =
    useSelector<RootState, IProjectWrapper>(state => state.project).project || initialValues;
  const workflowTasks: IProjectTask[] =
    useSelector<RootState, IProjectTask[]>(state => state.tasks) || initialValues;
  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT] as any,
  );
  useEffect(() => {
    if (!diposeWorkflowStatuses?.length) {
      dispatch(fetchProjectWorkflow());
    }
  }, [dispatch, diposeWorkflowStatuses]);

  useEffect(() => {
    const lastCompletedStatus = _.findLast(diposeWorkflowStatuses, { id: project?.statusId });
    if (
      lastCompletedStatus?.sortOrder !== undefined &&
      currentStatus?.sortOrder !== undefined &&
      getProjectRequest?.isFetching === false &&
      currentStatus.sortOrder > lastCompletedStatus.sortOrder
    ) {
      throw Error('You must complete all project disposal steps in order');
    }
    if (
      project?.statusId !== undefined &&
      project.statusId > 0 &&
      diposeWorkflowStatuses?.length > 0 &&
      currentStatus?.id !== undefined &&
      _.find(diposeWorkflowStatuses, { id: project.statusId }) === undefined &&
      _.find(diposeWorkflowStatuses, { id: currentStatus.id })?.sortOrder !== undefined
    ) {
      throw Error('You cannot edit a project disposal form after it has been submitted');
    }
  }, [currentStatus, getProjectRequest, project, diposeWorkflowStatuses]);

  return {
    currentStatus,
    setCurrentStatus,
    project,
    workflowStatuses: diposeWorkflowStatuses,
    workflowTasks,
    getStatusById: (statusId: number): IStatus | undefined =>
      _.find(diposeWorkflowStatuses, { id: statusId }),
    getNextStep: (status?: IStatus) =>
      getNextWorkflowStatus(diposeWorkflowStatuses, status ?? currentStatus),
    goToNextStep: (overrideProject?: IProject): number | undefined => {
      const currentProject = overrideProject ?? project;
      const nextStatus = getNextWorkflowStatus(diposeWorkflowStatuses, currentStatus);
      if (!nextStatus) {
        return undefined;
      }
      currentProject.projectNumber !== undefined &&
        history.push(`/dispose${nextStatus.route}?projectNumber=${currentProject.projectNumber}`);
      return nextStatus.id;
    },
    projectStatusCompleted: (status?: IStatus) =>
      isStatusCompleted(diposeWorkflowStatuses, status, project),
    canGoToStatus: (status: IStatus) => isStatusNavigable(diposeWorkflowStatuses, status, project),
    getLastCompletedStatus: () =>
      getLastCompletedStatus(diposeWorkflowStatuses, currentStatus, project),
    goToStep: (statusId: number) => {
      const status: IStatus | undefined = _.find(diposeWorkflowStatuses, { id: statusId });
      history.push(`..${status?.route}?projectNumber=${project.projectNumber}`);
    },
    goToDisposePath: (path: string) =>
      history.push(`./${path}?projectNumber=${project.projectNumber}`),
  };
};
export default useStepper;
