import * as React from 'react';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';
import TasksForm from './TasksForm';
import _ from 'lodash';
import TooltipIcon from 'components/common/TooltipIcon';
import { useProject, ReviewWorkflowStatus, reviewFirstNationsTooltip } from '..';

interface IFirstNationsCheckListFormProps {
  className?: string;
  isReadOnly?: boolean;
}
/**
 * Displays a checklist for each task within the first nations review status.
 * @param props
 */
const FirstNationsCheckListForm: React.FunctionComponent<IFirstNationsCheckListFormProps> = props => {
  const { project } = useProject();
  const tasks = _.filter(project?.tasks ?? [], {
    statusCode: ReviewWorkflowStatus.FirstNationConsultation,
  });
  return (
    <Container fluid className={classNames(props.className)}>
      <h3>
        First Nations Consultation
        <TooltipIcon
          toolTipId="review-firstNations"
          toolTip={reviewFirstNationsTooltip}
        ></TooltipIcon>
      </h3>

      <TasksForm tasks={tasks} isReadOnly={props.isReadOnly} />
    </Container>
  );
};

export default FirstNationsCheckListForm;
