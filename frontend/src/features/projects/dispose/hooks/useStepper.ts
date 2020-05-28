import { initialValues } from '../../../../pages/admin/access/constants/constants';
import { useEffect, useContext } from 'react';
import { fetchProjectTasks, fetchProjectWorkflow } from '../projectsActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IProject } from '..';
import _ from 'lodash';
import { StepperContext } from './stepperContext';
import { IProjectWrapper } from '../slices/projectSlice';
import { IStatus } from '../slices/projectWorkflowSlice';

export const getNextWorkflowStatus = (
  workflowStatuses: IStatus[],
  currentStatus: IStatus | undefined,
) => {
  if (!currentStatus) {
    return workflowStatuses[0];
  }
  //Don't allow incrementing past the final step/status
  const currentStatusIndex =
    currentStatus.sortOrder >= workflowStatuses.length - 1
      ? workflowStatuses.length - 1
      : currentStatus.sortOrder + 1;
  return workflowStatuses[currentStatusIndex];
};

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
    return status.sortOrder === 0;
  }
  //Don't allow incrementing past the final step/status
  return status.sortOrder <= furthestCompletedStep.sortOrder;
};

const useStepper = () => {
  const dispatch = useDispatch();
  const { currentStatus, setCurrentStatus } = useContext(StepperContext);
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const project: any =
    useSelector<RootState, IProjectWrapper>(state => state.project).project || initialValues;

  useEffect(() => {
    dispatch(fetchProjectTasks());
    dispatch(fetchProjectWorkflow());
  }, [dispatch]);

  return {
    currentStatus,
    setCurrentStatus,
    project,
    getNextStep: () => getNextWorkflowStatus(workflowStatuses, currentStatus),
    nextStep: () => {
      const nextStatus = getNextWorkflowStatus(workflowStatuses, currentStatus);
      setCurrentStatus(nextStatus);
    },
    projectStatusCompleted: (status: IStatus) =>
      isStatusCompleted(workflowStatuses, status, project),
    canGoToStatus: (status: IStatus) => isStatusNavigable(workflowStatuses, status, project),
  };
};
export default useStepper;
