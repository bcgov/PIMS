import React, { Fragment, useState, useEffect } from 'react';
import './ReviewProjectForm.scss';
import {
  ProjectDraftForm,
  UpdateInfoForm,
  ExemptionRequest,
  DocumentationForm,
  ApprovalConfirmationForm,
  DisposeWorkflowStatus,
  IProject,
} from '..';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import { IProjectTask } from '../interfaces';

/**
 * Form component of ReviewProjectForm.
 * @param param0 isReadOnly disable editing
 */
const ReviewProjectForm = ({ canEdit }: { canEdit: boolean }) => {
  const { values } = useFormikContext<IProject>();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const documentationTasks = _.filter(values.tasks, {
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  });
  const { errors } = useFormikContext();
  /** Enter edit mode if allowed and there are errors to display */
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setIsReadOnly(canEdit !== true);
    }
  }, [canEdit, errors]);

  return (
    <Fragment>
      <ProjectDraftForm
        isReadOnly={isReadOnly || !canEdit}
        setIsReadOnly={canEdit ? setIsReadOnly : undefined}
      />
      <UpdateInfoForm isReadOnly={isReadOnly || !canEdit} />
      <DocumentationForm tasks={documentationTasks as IProjectTask[]} isReadOnly={true} />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ExemptionRequest
        sectionHeader="Enhanced Referal Process Exemption"
        exemptionField="exemptionRequested"
        rationaleField="exemptionRationale"
        exemptionLabel="Apply for Enhanced Referal Process exemption"
        tooltip="To fill later"
        rationaleInstruction="Please provide your rationale below for exemption request"
        isReadOnly={isReadOnly || !canEdit}
      />
    </Fragment>
  );
};

export default ReviewProjectForm;
