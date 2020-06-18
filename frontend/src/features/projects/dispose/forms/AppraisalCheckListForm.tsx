import * as React from 'react';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';
import TasksForm from './TasksForm';
import { useStepper, ReviewWorkflowStatus } from '..';
import _ from 'lodash';
import { reviewAppraisalTooltip } from '../strings';
import TooltipIcon from 'components/common/TooltipIcon';

interface IAppraisalCheckListFormProps {
  className?: string;
}
/**
 * Displays a checklist for every task within the AppraisalReview status.
 * @param props
 */
const AppraisalCheckListForm: React.FunctionComponent<IAppraisalCheckListFormProps> = props => {
  const { project } = useStepper();
  const tasks = _.filter(project.tasks, { statusCode: ReviewWorkflowStatus.AppraisalReview });
  return (
    <Container fluid className={classNames(props.className)}>
      <h3>
        Appraisal
        <TooltipIcon toolTipId="review-appraisal" toolTip={reviewAppraisalTooltip}></TooltipIcon>
      </h3>

      <TasksForm tasks={tasks} />
    </Container>
  );
};

export default AppraisalCheckListForm;
