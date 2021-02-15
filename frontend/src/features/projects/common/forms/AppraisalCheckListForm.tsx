import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import TasksForm from './TasksForm';
import { ReviewWorkflowStatus, reviewAppraisalTooltip, useProject } from '../../common';
import _ from 'lodash';
import TooltipIcon from 'components/common/TooltipIcon';
import ProjectNotes from '../components/ProjectNotes';
import classNames from 'classnames';

interface IAppraisalCheckListFormProps {
  className?: string;
  isReadOnly?: boolean;
  taskStatusCode?: string;
}

/**
 * Displays a checklist for every task within the AppraisalReview status.
 * @param props
 */
const AppraisalCheckListForm: React.FunctionComponent<IAppraisalCheckListFormProps> = props => {
  const { project } = useProject();
  const tasks = _.filter(project.tasks, {
    statusCode: props.taskStatusCode ?? ReviewWorkflowStatus.AppraisalReview,
  });
  return (
    <Row className={classNames(props.className)}>
      <Col>
        <h3>
          Appraisal
          <TooltipIcon toolTipId="review-appraisal" toolTip={reviewAppraisalTooltip}></TooltipIcon>
        </h3>
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
