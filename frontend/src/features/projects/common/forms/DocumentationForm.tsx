import React, { Fragment } from 'react';
import { ProjectNotes } from '..';
import { IStepProps, IProjectTask } from '../interfaces';
import TasksForm from './TasksForm';

interface IDocumentationFormProps extends IStepProps {
  tasks: IProjectTask[];
  showNote?: boolean;
}

/**
 * Form component of DocumentationForm.
 * @param param0 isReadOnly disable editing
 */
const DocumentationForm = ({ isReadOnly, tasks, showNote = false }: IDocumentationFormProps) => {
  return (
    <Fragment>
      <h3>Documentation</h3>
      <TasksForm tasks={tasks ?? []} isReadOnly={isReadOnly} />
      {showNote && (
        <ProjectNotes
          label="Documentation Notes"
          field="documentationNote"
          className="col-md-auto"
        />
      )}
    </Fragment>
  );
};

export default DocumentationForm;
