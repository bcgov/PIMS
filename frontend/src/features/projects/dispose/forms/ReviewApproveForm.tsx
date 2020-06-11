import React, { Fragment, useState, useEffect } from 'react';
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
import { useFormikContext } from 'formik';

/**
 * Form component of ReviewApproveStep (currently a multi-step form).
 * @param param0 isReadOnly disable editing
 */
const ReviewApproveForm = ({
  canEdit,
  goToAddProperties,
}: {
  canEdit: boolean;
  goToAddProperties: Function;
}) => {
  const { project } = useStepper();
  const { errors } = useFormikContext();
  const [isReadOnly, setIsReadOnly] = useState(true);
  /** Enter edit mode if allowed and there are errors to display */
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setIsReadOnly(canEdit !== true);
    }
  }, [canEdit, errors]);

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
        isReadOnly={isReadOnly || !canEdit}
        setIsReadOnly={canEdit ? setIsReadOnly : undefined}
        title="Project Property Information"
      />
      <UpdateInfoForm
        isReadOnly={isReadOnly || !canEdit}
        goToAddProperties={goToAddProperties}
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
