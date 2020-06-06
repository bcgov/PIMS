import React, { useEffect, useRef, useContext } from 'react';
import './ProjectDisposeView.scss';
import { Container, Spinner } from 'react-bootstrap';
import { Route, match as Match, useHistory, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IStatus } from './slices/projectWorkflowSlice';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import {
  ProjectWorkflowComponent,
  projectWorkflowComponents,
  StepperContext,
  useStepper,
  StepActions,
} from '.';
import { FormikValues } from 'formik';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import GeneratedDisposeStepper from './components/GeneratedDisposeStepper';
import SresManual from './components/SresManual';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { currentStatus, setCurrentStatus } = useContext(StepperContext);
  const { nextStep } = useStepper();
  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT] as any,
  );

  const onNext = () =>
    formikRef.current?.submitForm().then((value: any) => {
      if (!formikRef?.current?.errors || !Object.keys(formikRef?.current?.errors).length) {
        // do not go to the next step if the form has validation errors.
        const hasNextStep = nextStep();
        if (!hasNextStep) {
          history.push('/project/completed');
        }
      }
    });

  const getComponentPath = (wfc: ProjectWorkflowComponent) => {
    return `${match.url}${_.find(workflowStatuses, { sortOrder: wfc.workflowStatus })?.route}`;
  };

  useEffect(() => {
    let statusAtRoute = _.find(workflowStatuses, ({ route }) => location.pathname.includes(route));
    statusAtRoute = statusAtRoute ?? workflowStatuses[0];
    if (setCurrentStatus) setCurrentStatus(statusAtRoute);
  }, [location.pathname, setCurrentStatus, workflowStatuses]);

  return (
    <>
      {workflowStatuses && workflowStatuses.length ? (
        <Container fluid className="ProjectDisposeLayout">
          <SresManual />
          <h1>Surplus Property Program Project</h1>
          <GeneratedDisposeStepper
            activeStep={currentStatus?.sortOrder ?? 0}
            basePath={match.url}
          />
          {getProjectRequest?.isFetching !== true ? (
            <Container fluid className="step-content">
              {projectWorkflowComponents.map(wfc => (
                <Route
                  key={wfc.workflowStatus.toString()}
                  path={getComponentPath(wfc)}
                  render={() => <wfc.component formikRef={formikRef} />}
                />
              ))}

              <StepActions onSave={() => formikRef.current?.handleSubmit()} onNext={onNext} />
            </Container>
          ) : (
            <Container fluid style={{ textAlign: 'center' }}>
              <Spinner animation="border"></Spinner>
            </Container>
          )}
          <Route title="*" path="dispose/*" component={() => <Redirect to="/page-not-found" />} />
        </Container>
      ) : null}
    </>
  );
};

export default ProjectDisposeLayout;
