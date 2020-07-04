import React, { useEffect } from 'react';
import './ProjectDisposeView.scss';
import { Container } from 'react-bootstrap';
import { match as Match } from 'react-router-dom';
import { StepContextProvider } from '.';
import ProjectDisposeLayout from './ProjectDisposeLayout';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { RootState } from 'reducers/rootReducer';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import { clearProject, fetchProject } from '../common';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeView = ({ match, location }: { match: Match; location: Location }) => {
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  const dispatch = useDispatch();
  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT] as any,
  );
  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(clearProject());
      dispatch(fetchProject(projectNumber as string));
    }
  }, [dispatch, projectNumber]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }
  return (
    <StepContextProvider>
      <Container fluid className="ProjectDisposeView">
        <ProjectDisposeLayout {...{ match, location }}></ProjectDisposeLayout>
      </Container>
    </StepContextProvider>
  );
};

export default ProjectDisposeView;
