import * as React from 'react';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';
import TasksForm from './TasksForm';
import { useStepper, ReviewWorkflowStatus } from '..';
import _ from 'lodash';

interface IAppraisalCheckListFormProps {
  className?: string;
}
/**
 * Displays a checklist for every task within the AppraisalReview status.
 * @param props
 */
const AppraisalCheckListForm: React.FunctionComponent<IAppraisalCheckListFormProps> = props => {
  const { project } = useStepper();
  const tasks = _.filter(project.tasks, { statusId: ReviewWorkflowStatus.AppraisalReview });
  return (
    <Container fluid className={classNames(props.className)}>
      <h3>Appraisal</h3>
      <TasksForm tasks={tasks} />
    </Container>
  );
};

export default AppraisalCheckListForm;
