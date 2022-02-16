import './ProjectDisposeView.scss';

import { ProjectActions } from 'constants/actionTypes';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { PathMatch } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';

import { clearProject, fetchProject } from '../common';
import { StepContextProvider } from '.';
import ProjectDisposeLayout from './ProjectDisposeLayout';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeView = ({
  match,
  location,
}: {
  match: PathMatch<string> | null;
  location: Location;
}) => {
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  const dispatch = useAppDispatch();
  const getProjectRequest = useAppSelector(
    (store) => (store.network as any)[ProjectActions.GET_PROJECT],
  );
  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(clearProject());
      fetchProject(projectNumber as string)(dispatch);
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
