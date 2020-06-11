import React, { useEffect, useRef, useState } from 'react';
import './ProjectDisposeView.scss';
import { Container, Spinner } from 'react-bootstrap';
import { Route, match as Match, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import {
  ProjectWorkflowComponent,
  projectWorkflowComponents,
  useStepper,
  StepActions,
  IStatus,
  IProject,
  saveProject,
} from '.';
import { FormikValues } from 'formik';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import GeneratedDisposeStepper from './components/GeneratedDisposeStepper';
import SresManual from './components/SresManual';
import ReviewApproveStep from './steps/ReviewApproveStep';
import ProjectDraftStep from './steps/ProjectDraftStep';
import { createProject } from 'features/projects/dispose/projectsActionCreator';
import queryString from 'query-string';

/**
 * Top level component facilitates 'wizard' style multi-step form for disposing of projects.
 * @param param0 default react router props
 */
const ProjectDisposeLayout = ({ match, location }: { match: Match; location: Location }) => {
  const [preDraft, setPreDraft] = useState(true);
  const history = useHistory();
  const formikRef = useRef<FormikValues>();
  const workflowStatuses = useSelector<RootState, IStatus[]>(state => state.projectWorkflow as any);
  const { nextStep, project, getNextStep, currentStatus, setCurrentStatus } = useStepper();
  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT] as any,
  );
  const dispatch = useDispatch();
  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;
  const historyReplace = history.replace;

  // TODO: UX flow - since this is a pre draft state hitting next does not step through the stepper as once they create the project then they are in 'Draft'
  // May be something we want to change
  const onNext = async () => {
    if (!projectNumber) {
      await handleSubmit();
    }
    formikRef.current?.submitForm().then((value: any) => {
      if (!formikRef?.current?.errors || !Object.keys(formikRef?.current?.errors).length) {
        // do not go to the next step if the form has validation errors.
        const hasNextStep = nextStep();
        if (!hasNextStep) {
          history.push('/project/completed');
        }
      }
    });
  };

  const getComponentPath = (wfc: ProjectWorkflowComponent) => {
    return `${match.url}${_.find(workflowStatuses, { id: wfc.workflowStatus })?.route}`;
  };

  const handleSubmit = async () => {
    const preDraftValues: any = {
      name: formikRef.current?.values.name,
      note: formikRef.current?.values.note,
      description: formikRef.current?.values.description,
      properties: [],
      tierLevelId: 1,
      statusId: 0,
      agencyId: 0,
      tasks: [],
    };
    if (!projectNumber) {
      await (dispatch(createProject(preDraftValues)) as any).then((project: IProject) => {
        dispatch(saveProject(project));
        historyReplace(
          `${match.url}${workflowStatuses[0].route}?projectNumber=${project.projectNumber}`,
        );
      });
    } else {
      formikRef.current?.handleSubmit();
    }
  };

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
    if (
      location.pathname === '/dispose' &&
      project.status?.route !== undefined &&
      project.projectNumber !== undefined
    ) {
      historyReplace(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`);
    }
  }, [historyReplace, project.status, project.projectNumber, location.pathname, match.url]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }

  projectNumber && preDraft && setPreDraft(false);

  return (
    <>
      {workflowStatuses && workflowStatuses.length ? (
        <Container fluid className="ProjectDisposeLayout">
          <SresManual />
          <h1>Surplus Property Program Project</h1>
          {currentStatus !== undefined || preDraft ? (
            <GeneratedDisposeStepper
              activeStep={currentStatus?.sortOrder ?? 0}
              basePath={match.url}
            />
          ) : null}
          {getProjectRequest?.isFetching !== true ? (
            <Container fluid className="step-content">
              {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
              <Route path="/dispose/projects/assess/properties" component={ReviewApproveStep} />
              {preDraft ? <ProjectDraftStep formikRef={formikRef} /> : null}
              {projectWorkflowComponents.map(wfc => (
                <Route
                  key={wfc.workflowStatus.toString()}
                  path={getComponentPath(wfc)}
                  render={() => <wfc.component formikRef={formikRef} />}
                />
              ))}
              {(currentStatus || preDraft) && (
                <StepActions
                  getNextStep={getNextStep}
                  onSave={() => handleSubmit()}
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
