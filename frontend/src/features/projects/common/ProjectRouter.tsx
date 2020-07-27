import React, { useEffect, useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Switch, Redirect } from 'react-router-dom';
import { match as Match } from 'react-router-dom';
import {
  clearProject,
  fetchProject,
  SelectProjectPropertiesPage,
  ProjectSummaryView,
  fetchProjectWorkflow,
  ApprovalTransitionPage,
  IProject,
  useProject,
} from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IGenericNetworkAction } from 'actions/genericActions';
import { ProjectActions } from 'constants/actionTypes';
import { ReviewApproveStep } from '../assess';
import queryString from 'query-string';
import PrivateRoute from 'utils/PrivateRoute';
import Claims from 'constants/claims';
import { FormikValues } from 'formik';
import ProjectLayout from './ProjectLayout';
import { GreTransferStep, ErpStep } from '../erp';
import AppRoute from 'utils/AppRoute';
import { SplStep } from '../spl';

/**
 * Top level component ensures proper context provided to child assessment form pages.
 * @param param0 default react router props
 */
const ProjectRouter = ({ location }: { match: Match; location: Location }) => {
  const query = location?.search ?? {};
  const formikRef = useRef<FormikValues>();
  const projectNumber = queryString.parse(query).projectNumber;
  const { project } = useProject();
  const dispatch = useDispatch();
  const getProjectRequest = useSelector<RootState, IGenericNetworkAction>(
    state => (state.network as any)[ProjectActions.GET_PROJECT_WORKFLOW] as any,
  );
  useEffect(() => {
    if (projectNumber !== null && projectNumber !== undefined) {
      dispatch(clearProject());
      (dispatch(fetchProject(projectNumber as string)) as any).then((project: IProject) => {
        dispatch(fetchProjectWorkflow(project?.workflowCode));
      });
    }
  }, [dispatch, projectNumber]);

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
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path="/projects/gretransfer"
            component={GreTransferStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path={['/projects/approved']}
            component={ApprovalTransitionPage}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path={['/projects/onHold', '/projects/erp']}
            component={ErpStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.ADMIN_PROJECTS}
            path={[
              '/projects/premarketing',
              '/projects/marketing',
              '/projects/contractinplace',
              '/projects/disposed',
            ]}
            component={SplStep}
            componentProps={{ formikRef }}
          />
          <PrivateRoute
            layout={ProjectLayout}
            claim={Claims.PROJECT_VIEW}
            path={[
              '/projects/summary',
              '/projects/transferred',
              '/projects/denied',
              '/projects/cancelled',
              '/projects/premarketing',
              '/projects/marketing',
              '/projects/contractinplace',
              '/projects/disposed',
            ]}
            component={ProjectSummaryView}
            componentProps={{ formikRef }}
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
