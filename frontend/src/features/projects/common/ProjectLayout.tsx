import React from 'react';
import { Container } from 'react-bootstrap';
import { SresManual } from '../common';
import './ProjectLayout.scss';

/**
 * Top level component used for step styling
 * @param param0 default react router props
 */
const ProjectLayout = (props: any) => {
  return (
    <Container fluid className="ProjectLayout">
      <Container fluid className="ProjectLayoutContent">
        <SresManual />
        <h1>Surplus Property Program Project</h1>
        {props.children}
      </Container>
    </Container>
  );
};

export default ProjectLayout;
