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
  PrivateNotes,
  PublicNotes,
} from '..';

import TasksForm from './TasksForm';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import ExemptionRequest from '../components/ExemptionRequest';

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
    statusCode: ReviewWorkflowStatus.PropertyReview,
  });
  const documentationReviewTasks = _.filter(project.tasks, {
    statusCode: ReviewWorkflowStatus.DocumentReview,
  });
  const documentationTasks = _.filter(project.tasks, {
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  });
  const exemptionReviewTasks = _.filter(project.tasks, {
    statusCode: ReviewWorkflowStatus.ExemptionProcess,
  });

  alert(project.exemptionRequested);

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
      <TasksForm tasks={infoReviewTasks} className="reviewRequired" isReadOnly={!canEdit} />
      {project.exemptionRequested && (
        <>
          <ExemptionRequest
            exemptionField="exemptionRequested"
            rationaleField="exemptionRationale"
            submissionStep={false}
            sectionHeader="Enhanced Referral Process Exemption"
            rationaleInstruction="The agency has requested exemption with the below rationale:"
          />
          <TasksForm tasks={exemptionReviewTasks} className="reviewRequired" />
        </>
      )}
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} />
      <TasksForm
        tasks={documentationReviewTasks}
        className="reviewRequired"
        isReadOnly={!canEdit}
      />
      <AppraisalCheckListForm className="reviewRequired" isReadOnly={!canEdit} />
      <FirstNationsCheckListForm className="reviewRequired" isReadOnly={!canEdit} />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ProjectNotes outerClassName="col-md-12 reviewRequired" disabled={true} />
      <PublicNotes outerClassName="col-md-12 reviewRequired" disabled={!canEdit} />
      <PrivateNotes outerClassName="col-md-12 reviewRequired" disabled={!canEdit} />
    </Fragment>
  );
};

export default ReviewApproveForm;
