import React, { Fragment } from 'react';
import { IStepProps, IProjectTask } from '../interfaces';
import { ProjectNotes } from '..';
import TasksForm from './TasksForm';

/**
 * Form component of DocumentationForm.
 * @param param0 isReadOnly disable editing
 */
const DocumentationForm = ({ isReadOnly, tasks }: IStepProps & { tasks: IProjectTask[] }) => {
  return (
    <Fragment>
      <h3>Documentation</h3>
      <TasksForm tasks={tasks ?? []} isReadOnly={isReadOnly} />

      {!isReadOnly && <ProjectNotes />}
    </Fragment>
  );
};

export default DocumentationForm;
