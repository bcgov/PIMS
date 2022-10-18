import { LayoutWrapper } from 'components/router/LayoutWrapper';
import PrivateRoute from 'components/router/PrivateRoute';
import { ProjectActions } from 'constants/actionTypes';
import Claims from 'constants/claims';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject } from 'features/projects/interfaces';
import { FormikValues } from 'formik';
import useDeepCompareEffect from 'hooks/useDeepCompareEffect';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import queryString from 'query-string';
import React, { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Navigate, PathMatch, Route, Routes, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store';

import { ReviewApproveStep } from '../assess';
import {
  ApprovalTransitionPage,
  clearProject,
  fetchProject,
  fetchProjectWorkflow,
  ProjectSummaryView,
  SelectProjectPropertiesPage,
  useProject,
} from '../common';
import { ErpStep, GreTransferStep as ErpToGre } from '../erp';
import { GreTransferStep as SplToGre, SplStep } from '../spl';
import ProjectLayout from './ProjectLayout';

/**
 * Top level component ensures proper context provided to child assessment form pages.
 * @param param0 default react router props
 */
const ProjectRouter = ({
  match,
  location,
}: {
  match: PathMatch<string> | null;
  location: Location;
}) => {
  const query = location?.search ?? {};
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const keycloak = useKeycloakWrapper();
  const formikRef = useRef<FormikValues>();
  const projectNumber = queryString.parse(query).projectNumber;
  const { project } = useProject();
  const getProjectRequest = useAppSelector(
    (store) => (store.network as any)[ProjectActions.GET_PROJECT_WORKFLOW],
  );
  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
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
    if (project.projectNumber === projectNumber && location.pathname === '/projects') {
      const ReviewWorkflowStatuses = Object.keys(ReviewWorkflowStatus).map(
        (k: string) => (ReviewWorkflowStatus as any)[k],
      );
      if (ReviewWorkflowStatuses.includes(project.statusCode)) {
        if (keycloak.hasClaim(Claims.ADMIN_PROJECTS)) {
          navigate(`${project.status?.route}?projectNumber=${project.projectNumber}`, {
            replace: true,
          });
        } else {
          navigate(`/projects/summary?projectNumber=${project.projectNumber}`, { replace: true });
        }
      } else {
        navigate(`/dispose${project.status?.route}?projectNumber=${project.projectNumber}`, {
          replace: true,
        });
      }
    }
  }, [project]);

  if (projectNumber !== null && projectNumber !== undefined && getProjectRequest?.error) {
    throw Error(`Unable to load project number ${projectNumber}`);
  }
  return (
    <>
      {getProjectRequest?.isFetching === false && projectNumber === project.projectNumber ? (
        <Routes>
          {/*TODO: this will probably need to be update to a map of routes/components as well.*/}
          <PrivateRoute claim={[Claims.ADMIN_PROJECTS, Claims.DISPOSE_APPROVE]}>
            <Route path="/projects/assess/properties/update">
              <LayoutWrapper
                layout={ProjectLayout}
                component={SelectProjectPropertiesPage}
              ></LayoutWrapper>
            </Route>
            <Route path="/projects/assess/properties">
              <LayoutWrapper
                layout={ProjectLayout}
                component={ReviewApproveStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
          </PrivateRoute>
          <PrivateRoute claim={Claims.ADMIN_PROJECTS}>
            <Route path="/projects/erp/gretransfer">
              <LayoutWrapper
                layout={ProjectLayout}
                component={ErpToGre}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path="/projects/spl/gretransfer">
              <LayoutWrapper
                layout={ProjectLayout}
                component={SplToGre}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/approved'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ApprovalTransitionPage}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/onHold'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ErpStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/erp'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ErpStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/premarketing'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={SplStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/marketing'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={SplStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/contractinplace'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={SplStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/disposed'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={SplStep}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
          </PrivateRoute>
          <PrivateRoute claim={Claims.PROJECT_VIEW}>
            <Route path={'/projects'} element={ProjectRouter} />
            <Route path={'/projects/transferred'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/denied'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/cancelled'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/premarketing'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/marketing'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/contractinplace'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
            <Route path={'/projects/disposed'}>
              <LayoutWrapper
                layout={ProjectLayout}
                component={ProjectSummaryView}
                componentProps={{ formikRef }}
              ></LayoutWrapper>
            </Route>
          </PrivateRoute>
          {/** Due to the use of dynamic routes within the project workflows, manually redirect to not found if no valid /projects route exists */}
          <Route path="/projects/*" element={<Navigate to="/page-not-found" />} />
        </Routes>
      ) : (
        <Container fluid style={{ textAlign: 'center' }}>
          <Spinner animation="border"></Spinner>
        </Container>
      )}
    </>
  );
};

export default ProjectRouter;
