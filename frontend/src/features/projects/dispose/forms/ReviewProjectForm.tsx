import React, { Fragment } from 'react';
import './ReviewProjectForm.scss';
import UpdateInfoForm from './UpdateInfoForm';
import DocumentationForm from './DocumentationForm';
import ApprovalConfirmationForm from './ApprovalConfirmationForm';
import ProjectDraftForm from './ProjectDraftForm';
import { Form } from 'react-bootstrap';
import { TextArea } from 'components/common/form';

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
      <Form.Row>
        <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
          Notes:
        </Form.Label>
        <TextArea disabled={true} outerClassName="col-md-8" field="note" />
      </Form.Row>
    </Fragment>
  );
};

export default ReviewProjectForm;
