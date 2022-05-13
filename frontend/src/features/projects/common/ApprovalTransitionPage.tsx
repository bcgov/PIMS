import * as React from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useProject, updateWorkflowStatus } from '.';
import { IProject } from 'features/projects/interfaces';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProjectWorkflow } from './projectsActionCreator';
import queryString from 'query-string';
import GenericModal from 'components/common/GenericModal';
import { useAppDispatch, useAppSelector } from 'store';
import { WorkflowStatus } from 'hooks/api/projects';

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
  const dispatch = useAppDispatch();
  const project = useAppSelector(store => store.project.project);
  const [isTransitioned, setIsTransitioned] = useState(false);
  const history = useHistory();
  const toStatus = _.find(workflowStatuses, { code: project?.statusCode })?.toStatus;
  const [error, setError] = React.useState(false);

  const params = queryString.parse(history.location.search);

  useEffect(() => {
    if (!!project && toStatus === undefined) {
      fetchProjectWorkflow(project?.workflowCode)(dispatch);
      return;
    }
    if (project !== undefined && !isTransitioned) {
      // Look for a possible transition within the same workflow.
      const next = toStatus?.filter(
        (s: { workflowCode: any; code: string | string[] }) =>
          s.workflowCode === project.workflowCode && (!params.to || s.code === params.to),
      );
      if (
        project.statusCode === WorkflowStatus.ApprovedForExemption ||
        project.statusCode === WorkflowStatus.NotInSpl
      ) {
        history.replace(`/projects/disposal/${project.id}`);
      } else if (next?.length !== 1) {
        if (
          (project.workflowCode === 'ERP' && project.statusCode === 'AP-ERP') ||
          (project.workflowCode === 'SPL' && project.statusCode === 'AP-SPL')
        ) {
          history.replace(`/projects/disposal/${project.id}`);
        } else {
          // We don't currently handle this transition.
          setError(true);
        }
      } else {
        const toStatusCode = next[0].code;
        setIsTransitioned(true);
        transitionFunction(
          updateWorkflowStatus(project, toStatusCode, project.workflowCode)(dispatch),
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
