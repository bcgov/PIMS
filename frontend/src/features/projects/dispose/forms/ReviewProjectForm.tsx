import React, { Fragment } from 'react';
import './ReviewProjectForm.scss';
import {
  ProjectDraftForm,
  UpdateInfoForm,
  DocumentationForm,
  ApprovalConfirmationForm,
  ProjectNotes,
} from '..';

/**
 * Form component of ReviewProjectForm.
 * @param param0 isReadOnly disable editing
 */
const ReviewProjectForm = () => {
  return (
    <Fragment>
      <ProjectDraftForm isReadOnly={true} />
      <UpdateInfoForm isReadOnly={true} />
      <DocumentationForm isReadOnly={true} />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ProjectNotes />
    </Fragment>
  );
};

export default ReviewProjectForm;
