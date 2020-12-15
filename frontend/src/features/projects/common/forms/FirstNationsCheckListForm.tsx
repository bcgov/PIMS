import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import TasksForm from './TasksForm';
import _ from 'lodash';
import TooltipIcon from 'components/common/TooltipIcon';
import { useProject, ReviewWorkflowStatus, reviewFirstNationsTooltip } from '..';
import classNames from 'classnames';

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
    <Row className={classNames(props.className)}>
      <Col>
        <h3>
          First Nations Consultation
          <TooltipIcon
            toolTipId="review-firstNations"
            toolTip={reviewFirstNationsTooltip}
          ></TooltipIcon>
        </h3>

        <TasksForm tasks={tasks} isReadOnly={props.isReadOnly} />
      </Col>
    </Row>
  );
};

export default FirstNationsCheckListForm;
