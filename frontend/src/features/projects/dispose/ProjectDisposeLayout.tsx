import React, { useEffect, useRef } from 'react';
import './ProjectDisposeView.scss';
import { Container, Spinner } from 'react-bootstrap';
import { Route, match as Match, useHistory, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import {
  ProjectWorkflowComponent,
  projectWorkflowComponents,
  useStepper,
  StepActions,
  IStatus,
} from '.';
import { FormikValues } from 'formik';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import GeneratedDisposeStepper from './components/GeneratedDisposeStepper';
import SresManual from './components/SresManual';
import ReviewApproveStep from './steps/ReviewApproveStep';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { nextStep, project, getNextStep, currentStatus, setCurrentStatus } = useStepper();
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
    return `${match.url}${_.find(workflowStatuses, { id: wfc.workflowStatus })?.route}`;
  };

  //Controls the route based on the current status.
  const historyReplace = history.replace;
  useEffect(() => {
    let statusAtRoute = _.find(workflowStatuses, ({ route }) => location.pathname.includes(route));
    if (setCurrentStatus) setCurrentStatus(statusAtRoute);
    if (statusAtRoute?.route !== undefined && project.projectNumber !== undefined) {
      historyReplace(`/dispose${statusAtRoute?.route}?projectNumber=${project.projectNumber}`);
    }
  }, [
    location.pathname,
    historyReplace,
    workflowStatuses,
    setCurrentStatus,
    project.projectNumber,
  ]);

  //If the current route isn't set, set based on the project status.
  useEffect(() => {
    if (location.pathname === '/dispose' && project.status?.route !== undefined) {
      historyReplace(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`);
    }
  }, [historyReplace, project.status, project.projectNumber, location.pathname, match.url]);

  return (
    <>
      {workflowStatuses && workflowStatuses.length ? (
        <Container fluid className="ProjectDisposeLayout">
          <SresManual />
          <h1>Surplus Property Program Project</h1>
          {currentStatus !== undefined ? (
            <GeneratedDisposeStepper
              activeStep={currentStatus?.sortOrder ?? 0}
              basePath={match.url}
            />
          ) : null}
          {getProjectRequest?.isFetching !== true ? (
            <Container fluid className="step-content">
              {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
              <Route path="/dispose/projects/assess/properties" component={ReviewApproveStep} />
              {projectWorkflowComponents.map(wfc => (
                <Route
                  key={wfc.workflowStatus.toString()}
                  path={getComponentPath(wfc)}
                  render={() => <wfc.component formikRef={formikRef} />}
                />
              ))}
              {currentStatus && (
                <StepActions
                  getNextStep={getNextStep}
                  onSave={() => formikRef.current?.handleSubmit()}
                  onNext={onNext}
                />
              )}
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
