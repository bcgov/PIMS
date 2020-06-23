import React, { Fragment } from 'react';
import { IStepProps, IProjectTask } from '../interfaces';
import TasksForm from './TasksForm';

interface IDocumentationFormProps extends IStepProps {
  tasks: IProjectTask[];
}

/**
 * Form component of DocumentationForm.
 * @param param0 isReadOnly disable editing
 */
const DocumentationForm = ({ isReadOnly, tasks }: IDocumentationFormProps) => {
  return (
    <Fragment>
      <h3>Documentation</h3>
      <TasksForm tasks={tasks ?? []} isReadOnly={isReadOnly} />
    </Fragment>
  );
};

export default DocumentationForm;
