import React, { Fragment, useState, useEffect } from 'react';
import './ReviewProjectForm.scss';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import {
  IProjectTask,
  DisposeWorkflowStatus,
  IProject,
  ProjectDraftForm,
  UpdateInfoForm,
  DocumentationForm,
  ApprovalConfirmationForm,
} from '../../common';

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
    </Fragment>
  );
};

export default ReviewProjectForm;
