import React, { useEffect, useRef, useContext } from 'react';
import './ProjectDisposeView.scss';
import { Container } from 'react-bootstrap';
import { Route, match as Match, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IStatus } from './slices/projectWorkflowSlice';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import { ProjectWorkflowComponent, projectWorkflowComponents } from '.';
import GeneratedDisposeStepper from './GeneratedDisposeStepper';
import { FormikValues } from 'formik';
import { StepActions } from './StepActions';
import useStepper from './hooks/useStepper';
import { StepperContext } from './hooks/stepperContext';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { currentStatus, setCurrentStatus } = useContext(StepperContext);
  const { nextStep, project } = useStepper();

  const getComponentPath = (wfc: ProjectWorkflowComponent) => {
    return `${match.url}${_.find(workflowStatuses, { id: wfc.workflowStatus })?.route}`;
  };

  useEffect(() => {
    let statusAtRoute = _.find(workflowStatuses, ({ route }) => location.pathname.includes(route));
    statusAtRoute = statusAtRoute ?? workflowStatuses[0];
    if (setCurrentStatus) setCurrentStatus(statusAtRoute);
  }, [location.pathname, setCurrentStatus, workflowStatuses]);

  useEffect(() => {
    if (currentStatus && project?.projectNumber) {
      history.push(`${match.url}${currentStatus.route}?projectNumber=${project.projectNumber}`);
    }
  }, [currentStatus, history, match.url, project]);

  return (
    <>
      {workflowStatuses && workflowStatuses.length ? (
        <Container fluid className="ProjectDisposeView">
          <h1>Dispose Project</h1>
          <GeneratedDisposeStepper
            activeStep={currentStatus?.sortOrder ?? 0}
            basePath={match.url}
          />
          {projectWorkflowComponents.map(wfc => (
            <Route
              key={wfc.workflowStatus.toString()}
              path={getComponentPath(wfc)}
              render={() => <wfc.component formikRef={formikRef} />}
            />
          ))}
          <StepActions
            onSave={() => formikRef.current?.handleSubmit()}
            onNext={() =>
              formikRef.current?.submitForm().then(() => {
                nextStep();
              })
            }
          />
        </Container>
      ) : null}
    </>
  );
};

export default ProjectDisposeLayout;
