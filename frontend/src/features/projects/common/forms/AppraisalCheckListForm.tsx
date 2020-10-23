import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import classNames from 'classnames';
import TasksForm from './TasksForm';
import { ReviewWorkflowStatus, reviewAppraisalTooltip, useProject } from '../../common';
import _ from 'lodash';
import TooltipIcon from 'components/common/TooltipIcon';
import ProjectNotes from '../components/ProjectNotes';

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
    <Container fluid className={classNames(props.className)}>
      <Row>
        <Col>
          <h3>
            Appraisal
            <TooltipIcon
              toolTipId="review-appraisal"
              toolTip={reviewAppraisalTooltip}
            ></TooltipIcon>
          </h3>
          <TasksForm tasks={tasks} isReadOnly={props.isReadOnly} />
          <ProjectNotes
            outerClassName="col-md-12 reviewRequired"
            field="appraisedNote"
            label="Appraised Notes"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AppraisalCheckListForm;
