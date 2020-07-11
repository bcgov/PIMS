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

const ApprovalTransitionPage: React.FunctionComponent<IApprovalTransitionPageProps> = props => {
  const { workflowStatuses } = useProject();
  const project = useSelector<RootState, IProjectWrapper>(state => state.project).project;
  const [isTransitioned, setIsTransitioned] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const toStatus = _.find(workflowStatuses, { code: project?.statusCode })?.toStatus;

  useEffect(() => {
    if (toStatus === undefined) {
      dispatch(fetchProjectWorkflow(project?.workflowCode));
      return;
    }
    if (project !== undefined && !isTransitioned) {
      if (project.statusCode === ReviewWorkflowStatus.ApprovedForExemption) {
        history.replace(`erp?projectNumber=${project.projectNumber}`);
      } else if (toStatus?.length !== 1) {
        history.replace(`${project.status?.route}?projectNumber=${project.projectNumber}`);
      } else {
        const toStatusCode = toStatus[0].code;
        setIsTransitioned(true);
        transitionFunction(
          dispatch(updateWorkflowStatus(project, toStatusCode, project.workflowCode)),
          history,
          toStatusCode,
        );
      }
    }
  }, [dispatch, history, isTransitioned, project, toStatus]);

  return (
    <Container fluid style={{ textAlign: 'center' }}>
      <Spinner animation="border"></Spinner>
    </Container>
  );
};

export default ApprovalTransitionPage;
