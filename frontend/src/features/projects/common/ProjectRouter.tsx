import { ProjectActions } from 'constants/actionTypes';
import Claims from 'constants/claims';
import { DisposeWorkflowStatus, ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject } from 'features/projects/interfaces';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store';

import { clearProject, fetchProject, fetchProjectWorkflow, useProject } from '../common';

/**
 * Top level component ensures proper context provided to child assessment form pages.
 * @param param0 default react router props
 */
export const ProjectRouter = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const keycloak = useKeycloakWrapper();
  const { project } = useProject();
  const getProjectRequest = useAppSelector(
    (store) => (store.network.requests as any)[ProjectActions.GET_PROJECT_WORKFLOW],
  );
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectNumber = queryParams.get('projectNumber');

  useEffect(() => {
    if (projectNumber !== 'null' && projectNumber !== 'undefined') {
      dispatch(clearProject());
      fetchProject(projectNumber as string)(dispatch)
        .then((project: IProject) => {
          fetchProjectWorkflow(project?.workflowCode)(dispatch);
        })
        .catch(() => {
          toast.error('Failed to load project, returning to project list.');
          navigate('/projects/list', { replace: true });
        });
    }
  }, [dispatch, navigate, projectNumber]);

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
        navigate(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`);
      } else {
        if (keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
          if (ReviewWorkflowStatuses.includes(project.statusCode)) {
            navigate(`${project.status?.route}?projectNumber=${project.projectNumber}`);
          } else {
            navigate(`/projects/disposal/${project.id}`);
          }
        } else {
          navigate(`/projects/summary?projectNumber=${project.projectNumber}`);
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
        <Outlet />
      ) : (
        <Container fluid style={{ textAlign: 'center' }}>
          <Spinner animation="border"></Spinner>
        </Container>
      )}
    </>
  );
};

export default ProjectRouter;
