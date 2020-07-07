import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IStatus, IProjectWrapper } from '..';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { initialValues } from '../interfaces';

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

const useProject = () => {
  const project: any = useSelector<RootState, IProjectWrapper>(state => state.project).project;
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const history = useHistory();

  return {
    goToStepByCode: (statusCode: string) => {
      const status: IStatus | undefined = _.find(workflowStatuses, { code: statusCode });
      history.push(`..${status?.route}?projectNumber=${project?.projectNumber}`);
    },
    goToDisposePath: (path: string) =>
      history.push(`./${path}?projectNumber=${project?.projectNumber}`),
    project: project ?? initialValues,
    getStatusTransitionWorkflow: (toStatusCode?: string) =>
      getStatusTransitionWorkflow(workflowStatuses, project?.statusCode, toStatusCode),
    workflowStatuses,
  };
};

export default useProject;
