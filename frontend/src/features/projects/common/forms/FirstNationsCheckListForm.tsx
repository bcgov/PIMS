import classNames from 'classnames';
import TooltipIcon from 'components/common/TooltipIcon';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import _ from 'lodash';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';

import { reviewFirstNationsTooltip, useProject } from '..';
import TasksForm from './TasksForm';

interface IFirstNationsCheckListFormProps {
  className?: string;
  isReadOnly?: boolean;
}
/**
 * Displays a checklist for each task within the first nations review status.
 * @param props
 */
const FirstNationsCheckListForm: React.FunctionComponent<IFirstNationsCheckListFormProps> = (
  props,
) => {
  const { project } = useProject();
  const tasks = _.filter(project?.tasks ?? [], {
    statusCode: ReviewWorkflowStatus.FirstNationConsultation,
  });
  return (
    <Row className={classNames(props.className)}>
      <Col>
        <Row style={{ alignItems: 'center' }}>
          <Col md="auto">
            <h3>First Nations Consultation</h3>
          </Col>
          <Col md="auto">
            <TooltipIcon
              toolTipId="review-firstNations"
              toolTip={reviewFirstNationsTooltip}
            ></TooltipIcon>
          </Col>
        </Row>

        <TasksForm tasks={tasks} isReadOnly={props.isReadOnly} />
      </Col>
    </Row>
  );
};

export default FirstNationsCheckListForm;
