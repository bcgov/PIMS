import { IStatus } from './../slices/projectWorkflowSlice';
import { initialValues } from '../../../../pages/admin/access/constants/constants';
import { useEffect, useContext } from 'react';
import { fetchProjectTasks, fetchProjectWorkflow } from '../projectsActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IProject } from '..';
import _ from 'lodash';
import { StepperContext } from './stepperContext';
import { IProjectWrapper } from '../slices/projectSlice';
import { useHistory } from 'react-router-dom';

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
    furthestCompletedStep?.sortOrder && furthestCompletedStep?.sortOrder >= status.sortOrder
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
  return status.sortOrder <= furthestCompletedStep.sortOrder + 1;
};

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
    currentStatus.sortOrder > (furthestCompletedStep?.sortOrder ?? 0) ||
    currentStatus.sortOrder === 0
  ) {
    return currentStatus.sortOrder + 1;
  }
  return project.statusId;
};

const useStepper = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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
    workflowStatuses,
    getNextStep: () => getNextWorkflowStatus(workflowStatuses, currentStatus),
    nextStep: (): boolean => {
      const nextStatus = getNextWorkflowStatus(workflowStatuses, currentStatus);
      console.log(nextStatus);
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
  };
};
export default useStepper;
