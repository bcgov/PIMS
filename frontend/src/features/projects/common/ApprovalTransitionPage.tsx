import * as React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import {
  useProject,
  updateWorkflowStatus,
  IProject,
  IProjectWrapper,
  ReviewWorkflowStatus,
} from '.';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProjectWorkflow } from './projectsActionCreator';
import queryString from 'query-string';
import GenericModal from 'components/common/GenericModal';

interface IApprovalTransitionPageProps {}

const transitionFunction = (promise: any, history: any, toStatusCode: string) => {
  return promise
    .then((project: IProject) => {
      if (project?.status?.route === undefined) {
        throw Error('No valid route for current project status');
      }
      history.replace(`${project?.status?.route}?projectNumber=${project.projectNumber}`);
    })
    .catch(() => {
      throw Error(`Failed to update status to ${toStatusCode}`);
    });
};

const ErrorMessage = () => {
  return (
    <GenericModal
      title="Unexpected Error"
      message="An unexpected error has occurred and the project is unable to proceed.  Contact SRES to assist with your project."
      okButtonText="Ok"
    />
  );
};

export const ApprovalTransitionPage: React.FunctionComponent<IApprovalTransitionPageProps> = props => {
  const { workflowStatuses } = useProject();
  const project = useSelector<RootState, IProjectWrapper>(state => state.project).project;
  const [isTransitioned, setIsTransitioned] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const toStatus = _.find(workflowStatuses, { code: project?.statusCode })?.toStatus;
  const [error, setError] = React.useState(false);

  const params = queryString.parse(history.location.search);

  useEffect(() => {
    if (!!project && toStatus === undefined) {
      dispatch(fetchProjectWorkflow(project?.workflowCode));
      return;
    }
    if (project !== undefined && !isTransitioned) {
      // Look for a possible transition within the same workflow.
      const next = toStatus?.filter(
        s => s.workflowCode === project.workflowCode && (!params.to || s.code === params.to),
      );
      if (
        project.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
        project.statusCode === ReviewWorkflowStatus.NotInSpl
      ) {
        history.replace(`erp?projectNumber=${project.projectNumber}`);
      } else if (next?.length !== 1) {
        if (project.workflowCode === 'ERP' && project.statusCode === 'AP-ERP') {
          history.replace(`approved?projectNumber=${project.projectNumber}&to=ERP-ON`);
        } else if (project.workflowCode === 'SPL' && project.statusCode === 'AP-SPL') {
          history.replace(`/projects/premarketing?projectNumber=${project.projectNumber}`);
        } else {
          // We don't currently handle this transition.
          setError(true);
        }
      } else {
        const toStatusCode = next[0].code;
        setIsTransitioned(true);
        transitionFunction(
          dispatch(updateWorkflowStatus(project, toStatusCode, project.workflowCode)),
          history,
          toStatusCode,
        );
      }
    }
  }, [dispatch, history, isTransitioned, project, toStatus, setError, params.to]);

  return !error ? (
    <Container fluid style={{ textAlign: 'center' }}>
      <Spinner animation="border"></Spinner>
    </Container>
  ) : (
    <ErrorMessage />
  );
};

export default ApprovalTransitionPage;
