import React, { useEffect } from 'react';
import './ProjectDisposeView.scss';
import { Spinner } from 'react-bootstrap';
import { match as Match, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, createProject } from 'features/projects/dispose/projectsActionCreator';
import { RootState } from 'reducers/rootReducer';
import { IProject } from '.';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import { StepContextProvider } from './hooks/stepperContext';
import ProjectDisposeLayout from './ProjectDisposeLayout';
import queryString from 'query-string';
import { initialValues } from 'pages/admin/access/constants/constants';
import { saveProject } from './slices/projectSlice';
import useStepper from './hooks/useStepper';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeView = ({ match, location }: { match: Match; location: Location }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { workflowStatuses } = useStepper();

  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT] as any,
  );
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  if (!projectNumber && workflowStatuses) {
    (dispatch(createProject(initialValues)) as any).then((project: IProject) => {
      dispatch(saveProject(project));
      history.replace(
        `${match.url}${workflowStatuses[0].route}?projectNumber=${project.projectNumber}`,
      );
    });
  }

  if (projectNumber?.includes('SPP') && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }
  useEffect(() => {
    //fetch project by number if match url param valid
    if (projectNumber?.includes('SPP')) {
      dispatch(fetchProject(projectNumber as string));
    }
  }, [dispatch, projectNumber]);

  return projectNumber ? (
    <StepContextProvider>
      <ProjectDisposeLayout {...{ match, location }}></ProjectDisposeLayout>
    </StepContextProvider>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ProjectDisposeView;
