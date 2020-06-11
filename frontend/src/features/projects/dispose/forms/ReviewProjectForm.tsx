import React, { Fragment, useState } from 'react';
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
  return (
    <Fragment>
      <ProjectDraftForm isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly} canEdit={canEdit} />
      <UpdateInfoForm isReadOnly={isReadOnly} canEdit={canEdit} />
      <DocumentationForm tasks={documentationTasks} isReadOnly={true} />
      <ApprovalConfirmationForm isReadOnly={true} />
      <ProjectNotes />
      <Form.Label style={{ float: 'right' }}>Apply to the Surplus Property Program</Form.Label>
    </Fragment>
  );
};

export default ReviewProjectForm;
