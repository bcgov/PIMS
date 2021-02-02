import React, { Fragment, useState, useEffect } from 'react';
import './ReviewApproveForm.scss';
import {
  ReviewWorkflowStatus,
  DisposeWorkflowStatus,
  ProjectDraftForm,
  UpdateInfoForm,
  DocumentationForm,
  AppraisalCheckListForm,
  FirstNationsCheckListForm,
  ApprovalConfirmationForm,
  ProjectNotes,
  PublicNotes,
  PrivateNotes,
  useProject,
  IProject,
} from '../../common';
import TasksForm from '../../common/forms/TasksForm';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import ExemptionRequest from '../../dispose/components/ExemptionRequest';
import { Form, FastDatePicker } from 'components/common/form';
import { ErpNotificationNotes } from 'features/projects/common/components/ProjectNotes';

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
  const { project } = useProject();
  const formikProps = useFormikContext<IProject>();
  const { errors } = useFormikContext<IProject>();
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
  const exemptionInfoReviewTasks = _.filter(project.tasks, {
    statusCode: ReviewWorkflowStatus.ExemptionReview,
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
      <TasksForm
        tasks={project.exemptionRequested ? exemptionInfoReviewTasks : infoReviewTasks}
        className="reviewRequired"
        isReadOnly={!canEdit}
      />
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
          <Form.Row>
            <Form.Label column md={2}>
              ADM Approved Exemption On
            </Form.Label>
            <FastDatePicker
              required
              outerClassName="col-md-2"
              formikProps={formikProps}
              field="exemptionApprovedOn"
            />
          </Form.Row>
        </>
      )}
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} showNote={true} />
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
      <ErpNotificationNotes outerClassName="col-md-12 reviewRequired" disabled={!canEdit} />
    </Fragment>
  );
};

export default ReviewApproveForm;
