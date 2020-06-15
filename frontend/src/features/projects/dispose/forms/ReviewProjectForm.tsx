import React, { Fragment, useState, useEffect } from 'react';
import './ReviewProjectForm.scss';
import {
  ProjectDraftForm,
  UpdateInfoForm,
  DocumentationForm,
  ApprovalConfirmationForm,
  ProjectNotes,
  DisposeWorkflowStatus,
  IProject,
} from '..';
import { Form } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import _ from 'lodash';

/**
 * Form component of ReviewProjectForm.
 * @param param0 isReadOnly disable editing
 */
const ReviewProjectForm = ({ canEdit }: { canEdit: boolean }) => {
  const { values } = useFormikContext<IProject>();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const documentationTasks = _.filter(values.tasks, {
    statusId: DisposeWorkflowStatus.RequiredDocumentation,
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
      <ProjectDraftForm isReadOnly={isReadOnly || !canEdit} setIsReadOnly={setIsReadOnly} />
      <UpdateInfoForm isReadOnly={isReadOnly || !canEdit} />
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ProjectNotes />
      <Form.Label style={{ float: 'right' }}>Apply to the Surplus Property Program</Form.Label>
    </Fragment>
  );
};

export default ReviewProjectForm;
