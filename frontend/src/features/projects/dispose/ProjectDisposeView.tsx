import React from 'react';
import './ProjectDisposeView.scss';
import { Container } from 'react-bootstrap';
import { match as Match } from 'react-router-dom';
import { StepContextProvider } from '.';
import ProjectDisposeLayout from './ProjectDisposeLayout';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeView = ({ match, location }: { match: Match; location: Location }) => {
  return (
    <StepContextProvider>
      <Container fluid className="ProjectDisposeView">
        <ProjectDisposeLayout {...{ match, location }}></ProjectDisposeLayout>
      </Container>
    </StepContextProvider>
  );
};

export default ProjectDisposeView;
