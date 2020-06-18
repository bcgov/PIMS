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
} from '.';
import { FormikValues } from 'formik';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import GeneratedDisposeStepper from './components/GeneratedDisposeStepper';
import SresManual from './components/SresManual';
import ReviewApproveStep from './steps/ReviewApproveStep';
import { updateWorkflowStatus } from 'features/projects/dispose/projectsActionCreator';
import queryString from 'query-string';
import { ReviewWorkflowStatus, DisposeWorkflowStatus } from './interfaces';
import SelectProjectPropertiesPage from './components/SelectProjectPropertiesPage';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { goToNextStep, project, getNextStep, currentStatus, setCurrentStatus } = useStepper();
  const { onSave, addOrUpdateProject } = useStepForm();
  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT] as any,
  );
  const addProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.ADD_PROJECT] as any,
  );
  const updateProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.UPDATE_PROJECT] as any,
  );
  const updateWorflowStatusRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.UPDATE_WORKFLOW_STATUS] as any,
  );
  const noFetchingProjectRequests =
    getProjectRequest?.isFetching !== true &&
    addProjectRequest?.isFetching !== true &&
    updateProjectRequest?.isFetching !== true &&
    updateWorflowStatusRequest?.isFetching !== true;
  const dispatch = useDispatch();
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  const historyReplace = history.replace;

  const updateProjectStatus = (
    project: IProject,
    nextStepCode: string,
    workflowStatusCode?: string,
  ) => {
    if (project?.statusId === currentStatus.id) {
      if (nextStepCode === ReviewWorkflowStatus.PropertyReview) {
        history.push('/project/completed');
      }
      return dispatch(updateWorkflowStatus(project, nextStepCode, workflowStatusCode) as any).then(
        (project: IProject) => {
          goToNextStep(project);
          return project;
        },
      );
    }
    goToNextStep(project);
    return Promise.resolve(project);
  };

  const onNext = () => {
    formikRef.current?.submitForm().then(() => {
      const values = formikRef?.current?.values;
      const errors = formikRef?.current?.errors;
      // do not go to the next step if the form has validation errors.
      if (errors === undefined || !Object.keys(errors).length) {
        let nextStepCode = getNextStep(currentStatus)?.code;
        let workflowStatusCode: string | undefined = undefined;
        if (nextStepCode === undefined) {
          nextStepCode = ReviewWorkflowStatus.PropertyReview;
          workflowStatusCode = 'ACCESS-DISPOSAL';
        }

        addOrUpdateProject(values, formikRef).then((project: IProject) =>
          updateProjectStatus(project, nextStepCode!, workflowStatusCode),
        );
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
          {noFetchingProjectRequests ? (
            <Container fluid className="step-content">
              <Switch>
                {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
                <Route
                  exact
                  path="/dispose/projects/assess/properties"
                  component={ReviewApproveStep}
                />
                <Route
                  path="/dispose/projects/assess/properties/update"
                  component={SelectProjectPropertiesPage}
                />
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
                <Route exact path="/dispose/*" component={() => <Redirect to="page-not-found" />} />
              </Switch>
              {currentStatus !== undefined && (
                <StepActions
                  getNextStep={getNextStep}
                  onSave={() => onSave(formikRef)}
                  onNext={onNext}
                  saveDisabled={currentStatus.code === DisposeWorkflowStatus.Approval}
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
