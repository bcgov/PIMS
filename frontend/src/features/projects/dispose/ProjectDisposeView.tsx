import React, { useEffect } from 'react';
import './ProjectDisposeView.scss';
import { Spinner, Container } from 'react-bootstrap';
import { match as Match, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, createProject } from 'features/projects/dispose/projectsActionCreator';
import { RootState } from 'reducers/rootReducer';
import { IProject, initialValues, saveProject, StepContextProvider, useStepper } from '.';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import queryString from 'query-string';
import ProjectDisposeLayout from './ProjectDisposeLayout';

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
  const historyReplace = history.replace;

  useEffect(() => {
    if (!projectNumber && workflowStatuses) {
      (dispatch(createProject(initialValues)) as any).then((project: IProject) => {
        dispatch(saveProject(project));
        historyReplace(
          `${match.url}${workflowStatuses[0].route}?projectNumber=${project.projectNumber}`,
        );
      });
    }
  }, [dispatch, historyReplace, match.url, projectNumber, workflowStatuses]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }
  useEffect(() => {
    //fetch project by number if match url param valid
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(fetchProject(projectNumber as string));
    }
  }, [dispatch, projectNumber]);

  return projectNumber !== null && projectNumber !== undefined ? (
    <StepContextProvider>
      <Container fluid className="ProjectDisposeView">
        <ProjectDisposeLayout {...{ match, location }}></ProjectDisposeLayout>
      </Container>
    </StepContextProvider>
  ) : (
    <Spinner animation="border"></Spinner>
  );
};

export default ProjectDisposeView;
