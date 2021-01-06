import React, { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Route, match as Match, useHistory, Redirect, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { FormikValues } from 'formik';
import queryString from 'query-string';
import {
  SresManual,
  ReviewWorkflowStatus,
  updateWorkflowStatus,
  IProject,
  useStepForm,
  DisposeWorkflowStatus,
  clearProject,
  ProjectWorkflowComponent,
} from '../common';
import { GeneratedDisposeStepper, useStepper, projectWorkflowComponents, StepActions } from '.';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const {
    goToNextStep,
    project,
    getNextStep,
    currentStatus,
    setCurrentStatus,
    workflowStatuses,
  } = useStepper();
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
      return dispatch(updateWorkflowStatus(project, nextStepCode, workflowStatusCode) as any)
        .then((project: IProject) => {
          if (goToNextStep(project) === undefined) {
            if (project.statusCode === 'AS-EXE') {
              history.push('/project/exemption/submitted');
            } else {
              history.push('/project/submitted');
            }
          }
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
    if (location.pathname === '/dispose' && workflowStatuses?.length > 0) {
      dispatch(clearProject());
      historyReplace(`/dispose${workflowStatuses[0].route}`);
    }
  }, [historyReplace, workflowStatuses, location.pathname, dispatch, projectNumber]);
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
              <StepActions
                getNextStep={getNextStep}
                onSave={() => onSave(formikRef)}
                onNext={onNext}
                saveDisabled={currentStatus?.code === DisposeWorkflowStatus.Approval}
                isFetching={!noFetchingProjectRequests}
              />
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
