import * as React from 'react';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';
import { useStepper } from '..';
import TasksForm from './TasksForm';
import { ReviewWorkflowStatus } from '../interfaces';
import _ from 'lodash';

interface IFirstNationsCheckListFormProps {
  className?: string;
}
/**
 * Displays a checklist for each task within the first nations review status.
 * @param props
 */
const FirstNationsCheckListForm: React.FunctionComponent<IFirstNationsCheckListFormProps> = props => {
  const { project } = useStepper();
  const tasks = _.filter(project.tasks, { statusId: ReviewWorkflowStatus.FirstNationConsultation });
  return (
    <Container fluid className={classNames(props.className)}>
      <h3>First Nations Consultation</h3>
      <TasksForm tasks={tasks} />
    </Container>
  );
};

export default FirstNationsCheckListForm;
