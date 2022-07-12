import { ProjectActions } from 'constants/actionTypes';
import Claims from 'constants/claims';
import { DisposeWorkflowStatus, ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject } from 'features/projects/interfaces';
import { FormikValues } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import queryString from 'query-string';
import React, { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Redirect, Switch, useHistory } from 'react-router-dom';
import { match as Match } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store';
import AppRoute from 'utils/AppRoute';
import PrivateRoute from 'utils/PrivateRoute';

import { ReviewApproveStep } from '../assess';
import {
  clearProject,
  fetchProject,
  fetchProjectWorkflow,
  SelectProjectPropertiesPage,
  useProject,
} from '../common';
import { ProjectSummary } from '../summary';
import ProjectLayout from './ProjectLayout';

/**
 * Top level component ensures proper context provided to child assessment form pages.
 * @param param0 default react router props
 */
export const ProjectRouter = ({ location }: { match: Match; location: Location }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const keycloak = useKeycloakWrapper();
  const formikRef = useRef<FormikValues>();
  const { project } = useProject();
  const getProjectRequest = useAppSelector(
    store => (store.network.requests as any)[ProjectActions.GET_PROJECT_WORKFLOW],
  );

  const query = location?.search ?? {};
  const projectNumber = queryString.parse(query).projectNumber;

  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(clearProject());
      fetchProject(projectNumber as string)(dispatch)
        .then((project: IProject) => {
          fetchProjectWorkflow(project?.workflowCode)(dispatch);
        })
        .catch(() => {
          toast.error('Failed to load project, returning to project list.');
          history.replace('/projects/list');
        });
    }
  }, [dispatch, history, projectNumber]);

  //if the user is routed to /projects, determine the correct subroute to send them to by loading the project.
  useDeepCompareEffect(() => {
    const DisposeWorkflowStatuses = Object.keys(DisposeWorkflowStatus).map(
      (k: string) => (DisposeWorkflowStatus as any)[k],
    );
    const ReviewWorkflowStatuses = Object.keys(ReviewWorkflowStatus).map(
      (k: string) => (ReviewWorkflowStatus as any)[k],
    );

    if (project.projectNumber === projectNumber && location.pathname === '/projects') {
      if (DisposeWorkflowStatuses.includes(project.statusCode)) {
        history.replace(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`);
      } else {
        if (keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
          if (ReviewWorkflowStatuses.includes(project.statusCode)) {
            history.replace(`${project.status?.route}?projectNumber=${project.projectNumber}`);
          } else {
            history.replace(`/projects/disposal/${project.id}`);
          }
        } else {
          history.replace(`/projects/summary?projectNumber=${project.projectNumber}`);
        }
      }
    }
  }, [project]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }

  return (
    <>
      {getProjectRequest?.isFetching === false && projectNumber === project.projectNumber ? (
        <Switch>
          {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
          <PrivateRoute
            layout={ProjectLayout}
            claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}
            path="/projects/assess/properties/update"
            component={SelectProjectPropertiesPage}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}
            exact
            path="/projects/assess/properties"
            component={ReviewApproveStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            exact
            layout={ProjectLayout}
            claim={Claims.PROJECT_VIEW}
            path={'/projects/summary'}
            component={ProjectSummary}
          />
          {/** Due to the use of dynamic routes within the project workflows, manually redirect to not found if no valid /projects route exists */}
          <AppRoute
            title="*"
            path="/projects/*"
            component={() => <Redirect to="/page-not-found" />}
          />
        </Switch>
      ) : (
        <Container fluid style={{ textAlign: 'center' }}>
          <Spinner animation="border"></Spinner>
        </Container>
      )}
    </>
  );
};

export default ProjectRouter;
