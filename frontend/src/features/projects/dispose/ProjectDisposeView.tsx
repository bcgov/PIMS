import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Route, match as Match } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectWorkflow } from 'features/projects/dispose/projectsActionCreator';
import { ProjectStatus } from './ProjectWorkflowSlice';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import { ProjectWorkflowComponent, projectWorkflowComponents } from '.';
import GeneratedDisposeStepper from './GeneratedDisposeStepper';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeView = ({ match, location }: { match: Match; location: Location }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProjectWorkflow());
  }, [dispatch]);

  const workflowStatuses = useSelector<RootState, ProjectStatus[]>(
    state => state.projectWorkflow as any,
  );
  const currentStatus = _.find(workflowStatuses, ({ route }) => location.pathname.includes(route));

  const getComponentPath = (wfc: ProjectWorkflowComponent) => {
    return `${match.path}${_.find(workflowStatuses, { id: wfc.workflowStatus })?.route}`;
  };

  return (
    <>
      {workflowStatuses && workflowStatuses.length ? (
        <Container fluid className="ProjectDisposeView">
          <GeneratedDisposeStepper
            activeStep={currentStatus?.sortOrder ?? 0}
            basePath={match.path}
          />
          {projectWorkflowComponents.map(wfc => (
            <Route path={getComponentPath(wfc)} component={wfc.component} />
          ))}
        </Container>
      ) : null}
    </>
  );
};

export default ProjectDisposeView;
