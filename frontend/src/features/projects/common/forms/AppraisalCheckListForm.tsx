import * as React from 'react';
import { Container } from 'react-bootstrap';
import classNames from 'classnames';
import TasksForm from './TasksForm';
import { ReviewWorkflowStatus, reviewAppraisalTooltip, useProject } from '../../common';
import _ from 'lodash';
import TooltipIcon from 'components/common/TooltipIcon';

interface IAppraisalCheckListFormProps {
  className?: string;
  isReadOnly?: boolean;
}
/**
 * Displays a checklist for every task within the AppraisalReview status.
 * @param props
 */
const AppraisalCheckListForm: React.FunctionComponent<IAppraisalCheckListFormProps> = props => {
  const { project } = useProject();
  const tasks = _.filter(project.tasks, { statusCode: ReviewWorkflowStatus.AppraisalReview });
  return (
    <Container fluid className={classNames(props.className)}>
      <h3>
        Appraisal
        <TooltipIcon toolTipId="review-appraisal" toolTip={reviewAppraisalTooltip}></TooltipIcon>
      </h3>

      <TasksForm tasks={tasks} isReadOnly={props.isReadOnly} />
    </Container>
  );
};

export default AppraisalCheckListForm;
