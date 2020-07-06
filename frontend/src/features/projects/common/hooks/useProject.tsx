import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IStatus, IProjectWrapper } from '..';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';

const useProject = () => {
  const project = useSelector<RootState, IProjectWrapper>(state => state.project).project;
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const history = useHistory();

  return {
    goToStepByCode: (statusCode: string) => {
      const status: IStatus | undefined = _.find(workflowStatuses, { code: statusCode });
      history.push(`..${status?.route}?projectNumber=${project?.projectNumber}`);
    },
    goToDisposePath: (path: string) =>
      history.push(`./${path}?projectNumber=${project?.projectNumber}`),
    project,
    workflowStatuses,
  };
};

export default useProject;
