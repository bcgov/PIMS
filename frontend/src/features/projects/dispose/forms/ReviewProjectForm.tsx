import React, { Fragment } from 'react';
import './ReviewProjectForm.scss';
import {
  ProjectDraftForm,
  UpdateInfoForm,
  DocumentationForm,
  ApprovalConfirmationForm,
  ProjectNotes,
} from '..';
import { Form } from 'react-bootstrap';

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
      <Form.Label style={{ float: 'right' }}>Apply to the Surplus Property Program</Form.Label>
    </Fragment>
  );
};

export default ReviewProjectForm;
