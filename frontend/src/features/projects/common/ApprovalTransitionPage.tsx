import GenericModal from 'components/common/GenericModal';
import { IProject } from 'features/projects/interfaces';
import { WorkflowStatus } from 'hooks/api/projects';
import _ from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';

import { updateWorkflowStatus, useProject } from '.';
import { fetchProjectWorkflow } from './projectsActionCreator';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IApprovalTransitionPageProps {}

const transitionFunction = (promise: any, navigate: any, toStatusCode: string) => {
  return promise
    .then((project: IProject) => {
      if (project?.status?.route === undefined) {
        throw Error('No valid route for current project status');
      }
      navigate(`${project?.status?.route}?projectNumber=${project.projectNumber}`);
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

export const ApprovalTransitionPage: React.FunctionComponent<IApprovalTransitionPageProps> = () => {
  const { workflowStatuses } = useProject();
  const dispatch = useAppDispatch();
  const project = useAppSelector((store) => store.project.project);
  const [isTransitioned, setIsTransitioned] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toStatus = _.find(workflowStatuses, { code: project?.statusCode })?.toStatus;
  const [error, setError] = React.useState(false);

  const queryParams = new URLSearchParams(location.search);
  const searchParams: any = {};
  for (const [key, value] of queryParams.entries()) {
    searchParams[key] = value;
  }

  useEffect(() => {
    if (!!project && toStatus === undefined) {
      fetchProjectWorkflow(project?.workflowCode)(dispatch);
      return;
    }
    if (project !== undefined && !isTransitioned) {
      // Look for a possible transition within the same workflow.
      const next = toStatus?.filter(
        (s: { workflowCode: any; code: string | string[] }) =>
          s.workflowCode === project.workflowCode &&
          (!searchParams.to || s.code === searchParams.to),
      );
      if (
        project.statusCode === WorkflowStatus.ApprovedForExemption ||
        project.statusCode === WorkflowStatus.NotInSpl
      ) {
        navigate(`/projects/disposal/${project.id}`);
      } else if (next?.length !== 1) {
        if (
          (project.workflowCode === 'ERP' && project.statusCode === 'AP-ERP') ||
          (project.workflowCode === 'SPL' && project.statusCode === 'AP-SPL')
        ) {
          navigate(`/projects/disposal/${project.id}`);
        } else {
          // We don't currently handle this transition.
          setError(true);
        }
      } else {
        const toStatusCode = next[0].code;
        setIsTransitioned(true);
        transitionFunction(
          updateWorkflowStatus(project, toStatusCode, project.workflowCode)(dispatch),
          navigate,
          toStatusCode,
        );
      }
    }
  }, [dispatch, navigate, isTransitioned, project, toStatus, setError, searchParams.to]);

  return !error ? (
    <Container fluid style={{ textAlign: 'center' }}>
      <Spinner animation="border"></Spinner>
    </Container>
  ) : (
    <ErrorMessage />
  );
};

export default ApprovalTransitionPage;
