import './ProjectDisposeView.scss';

import { ProjectActions } from 'constants/actionTypes';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';

import { clearProject, fetchProject } from '../common';
import { StepContextProvider } from '.';
import ProjectDisposeLayout from './ProjectDisposeLayout';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */

const ProjectDisposeView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectNumber = queryParams.get('projectNumber');
  const dispatch = useAppDispatch();
  const getProjectRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.GET_PROJECT],
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
        <ProjectDisposeLayout />
      </Container>
    </StepContextProvider>
  );
};

export default ProjectDisposeView;
