import React, { Fragment, useState } from 'react';
import './ReviewApproveForm.scss';
import {
  ProjectDraftForm,
  UpdateInfoForm,
  DocumentationForm,
  ApprovalConfirmationForm,
  ProjectNotes,
  useStepper,
  ReviewWorkflowStatus,
  DisposeWorkflowStatus,
  AppraisalCheckListForm,
  FirstNationsCheckListForm,
} from '..';

import TasksForm from './TasksForm';
import _ from 'lodash';

/**
 * Form component of ReviewApproveStep (currently a multi-step form).
 * @param param0 isReadOnly disable editing
 */
const ReviewApproveForm = ({ canEdit }: { canEdit: boolean }) => {
  const { project } = useStepper();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const infoReviewTasks = _.filter(project.tasks, {
    statusId: ReviewWorkflowStatus.PropertyReview,
  });
  const documentationReviewTasks = _.filter(project.tasks, {
    statusId: ReviewWorkflowStatus.DocumentReview,
  });
  const documentationTasks = _.filter(project.tasks, {
    statusId: DisposeWorkflowStatus.RequiredDocumentation,
  });
  return (
    <Fragment>
      <ProjectDraftForm
        isReadOnly={isReadOnly}
        setIsReadOnly={setIsReadOnly}
        canEdit={canEdit}
        title="Project Property Information"
      />
      <UpdateInfoForm
        isReadOnly={isReadOnly}
        setIsReadOnly={setIsReadOnly}
        canEdit={canEdit}
        title=""
      />
      <TasksForm tasks={infoReviewTasks} className="reviewRequired" />
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} />
      <TasksForm tasks={documentationReviewTasks} className="reviewRequired" />
      <AppraisalCheckListForm className="reviewRequired" />
      <FirstNationsCheckListForm className="reviewRequired" />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ProjectNotes outerClassName="col-md-12" />
      <ProjectNotes
        tooltip="Visible to SRES only"
        label="Private Notes"
        field="privateNote"
        outerClassName="col-md-12 reviewRequired"
      />
    </Fragment>
  );
};

export default ReviewApproveForm;
