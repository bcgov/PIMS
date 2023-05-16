import classNames from 'classnames';
import TooltipIcon from 'components/common/TooltipIcon';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import _ from 'lodash';
import * as React from 'react';
import { Col, Row } from 'react-bootstrap';

import { reviewAppraisalTooltip, useProject } from '../../common';
import ProjectNotes from '../components/ProjectNotes';
import TasksForm from './TasksForm';

interface IAppraisalCheckListFormProps {
  className?: string;
  isReadOnly?: boolean;
  taskStatusCode?: string;
}

/**
 * Displays a checklist for every task within the AppraisalReview status.
 * @param props
 */
const AppraisalCheckListForm: React.FunctionComponent<IAppraisalCheckListFormProps> = (props) => {
  const { project } = useProject();
  const tasks = _.filter(project.tasks, {
    statusCode: props.taskStatusCode ?? ReviewWorkflowStatus.AppraisalReview,
  });
  return (
    <Row className={classNames(props.className)}>
      <Col>
        <Row style={{ alignItems: 'center' }}>
          <Col md="auto">
            <h3>Appraisal</h3>
          </Col>
          <Col md="auto">
            <TooltipIcon
              toolTipId="review-appraisal"
              toolTip={reviewAppraisalTooltip}
            ></TooltipIcon>
          </Col>
        </Row>
        <TasksForm tasks={tasks} isReadOnly={props.isReadOnly} />
        <ProjectNotes
          className="col-md-auto"
          outerClassName="col-md-12 reviewRequired"
          field="appraisedNote"
          label="Appraisal Notes"
          comment="Please include the date the appraisal was completed"
        />
      </Col>
    </Row>
  );
};

export default AppraisalCheckListForm;
