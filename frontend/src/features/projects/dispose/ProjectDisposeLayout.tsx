import React, { useEffect, useRef } from 'react';
import './ProjectDisposeView.scss';
import { Container, Spinner } from 'react-bootstrap';
import { Route, match as Match, useHistory, Redirect, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import {
  ProjectWorkflowComponent,
  projectWorkflowComponents,
  useStepper,
  StepActions,
  IStatus,
  clearProject,
  IProject,
  useStepForm,
  SelectProjectPropertiesPage,
  ApprovalStep,
  GreTransferStep,
} from '.';
import { FormikValues } from 'formik';
import GeneratedDisposeStepper from './components/GeneratedDisposeStepper';
import SresManual from './components/SresManual';
import ReviewApproveStep from './steps/ReviewApproveStep';
import { updateWorkflowStatus } from 'features/projects/dispose/projectsActionCreator';
import queryString from 'query-string';
import { ReviewWorkflowStatus, DisposeWorkflowStatus } from './interfaces';
import ProjectSummaryView from './ProjectSummaryView';
import PrivateRoute from 'utils/PrivateRoute';
import Claims from 'constants/claims';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { goToNextStep, project, getNextStep, currentStatus, setCurrentStatus } = useStepper();
  const {
    onSave,
    addOrUpdateProject,
    noFetchingProjectRequests,
    getProjectRequest,
  } = useStepForm();
  const dispatch = useDispatch();
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  const historyReplace = history.replace;

  const updateProjectStatus = (
    project: IProject,
    nextStepCode: string,
    workflowStatusCode?: string,
  ) => {
    //if we are at the most recent incomplete step, update status and project.
    if (project?.statusId === currentStatus.id) {
      if (
        nextStepCode === ReviewWorkflowStatus.PropertyReview ||
        nextStepCode === ReviewWorkflowStatus.ExemptionReview
      ) {
        history.push('/project/completed');
      }
      return dispatch(updateWorkflowStatus(project, nextStepCode, workflowStatusCode) as any)
        .then((project: IProject) => {
          goToNextStep(project);
          return project;
        })
        .catch((error: any) => {
          const msg: string = error?.response?.data?.error ?? error.toString();
          formikRef.current?.setStatus({ msg });
          return project;
        });
    } else {
      //if we are updating a previous step, just update the project with no status change.
      return addOrUpdateProject(project, formikRef).then(() => goToNextStep(project));
    }
  };

  const onNext = () => {
    formikRef.current?.submitForm().then(() => {
      const values = formikRef?.current?.values;
      const errors = formikRef?.current?.errors;
      // do not go to the next step if the form has validation errors.
      if (errors === undefined || !Object.keys(errors).length) {
        let nextStepCode = getNextStep(currentStatus)?.code;
        let workflowStatusCode: string | undefined = undefined;
        if (nextStepCode === undefined && !formikRef?.current?.values.exemptionRequested) {
          nextStepCode = ReviewWorkflowStatus.PropertyReview;
          workflowStatusCode = 'ASSESS-DISPOSAL';
        }
        if (nextStepCode === undefined && formikRef?.current?.values.exemptionRequested) {
          nextStepCode = ReviewWorkflowStatus.ExemptionReview;
          workflowStatusCode = 'ASSESS-EXEMPTION';
        }
        let promise: Promise<any> = Promise.resolve(values);
        // If the project has not been created, create it before performing status updates.
        if (values.id === undefined) {
          promise = addOrUpdateProject(values, formikRef);
        }
        promise.then(project => {
          return updateProjectStatus(project, nextStepCode!, workflowStatusCode);
        });
      }
    });
  };

  const getComponentPath = (wfc: ProjectWorkflowComponent) => {
    return `${match.url}${_.find(workflowStatuses, { code: wfc.workflowStatus })?.route}`;
  };

  useEffect(() => {
    let statusAtRoute = _.find(workflowStatuses, ({ route }) => location.pathname.includes(route));
    if (setCurrentStatus && noFetchingProjectRequests) setCurrentStatus(statusAtRoute);
  }, [
    location.pathname,
    historyReplace,
    workflowStatuses,
    setCurrentStatus,
    project.projectNumber,
    noFetchingProjectRequests,
  ]);

  //If the current route isn't set, set based on the query project status.
  useEffect(() => {
    if (location.pathname === '/dispose') {
      if (project.status?.route !== undefined && projectNumber !== undefined) {
        historyReplace(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`);
      } else {
        dispatch(clearProject());
      }
    }
  }, [
    historyReplace,
    project.status,
    project.projectNumber,
    location.pathname,
    match.url,
    dispatch,
    projectNumber,
  ]);
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
              <Switch>
                {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
                <Route
                  layout={() => null}
                  path="/dispose/projects/assess/properties/update"
                  component={SelectProjectPropertiesPage}
                />
                <PrivateRoute
                  layout={(props: any) => <>{props.children}</>}
                  claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}
                  exact
                  path="/dispose/projects/assess/properties"
                  component={() => ReviewApproveStep({ formikRef })}
                />
                <Route
                  path="/dispose/projects/summary"
                  render={() => <ProjectSummaryView formikRef={formikRef} />}
                />
                <PrivateRoute
                  layout={(props: any) => <>{props.children}</>}
                  claim={Claims.ADMIN_PROJECTS}
                  path="/dispose/projects/approved"
                  component={() => ApprovalStep({ formikRef })}
                />
                <PrivateRoute
                  layout={(props: any) => <>{props.children}</>}
                  claim={Claims.ADMIN_PROJECTS}
                  path="/dispose/projects/gretransfer"
                  component={() => GreTransferStep({ formikRef })}
                />
                } />
                {projectWorkflowComponents.map(wfc => (
                  <Route
                    key={wfc.workflowStatus.toString()}
                    path={getComponentPath(wfc)}
                    render={() => <wfc.component formikRef={formikRef} />}
                  />
                ))}
                <Route
                  exact
                  path="/dispose"
                  component={() => <Redirect to="/dispose/projects/draft" />}
                />
                <Route
                  exact
                  path="/dispose/*"
                  component={() => <Redirect to="/page-not-found" />}
                />
              </Switch>
              {currentStatus !== undefined && (
                <StepActions
                  getNextStep={getNextStep}
                  onSave={() => onSave(formikRef)}
                  onNext={onNext}
                  saveDisabled={currentStatus.code === DisposeWorkflowStatus.Approval}
                  isFetching={!noFetchingProjectRequests}
                />
              )}
            </Container>
          ) : (
            <Container fluid style={{ textAlign: 'center' }}>
              <Spinner animation="border"></Spinner>
            </Container>
          )}
        </Container>
      ) : null}
    </>
  );
};

export default ProjectDisposeLayout;
