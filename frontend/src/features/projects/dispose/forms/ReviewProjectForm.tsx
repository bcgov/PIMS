import React, { Fragment } from 'react';
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
  const documentationTasks = _.filter(values.tasks, {
    statusId: DisposeWorkflowStatus.RequiredDocumentation,
  });
  return (
    <Fragment>
      <ProjectDraftForm isReadOnly={true} canEdit={canEdit} />
      <UpdateInfoForm isReadOnly={true} canEdit={canEdit} />
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ProjectNotes />
      <Form.Label style={{ float: 'right' }}>Apply to the Surplus Property Program</Form.Label>
    </Fragment>
  );
};

export default ReviewProjectForm;
