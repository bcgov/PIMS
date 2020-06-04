import React, { Fragment } from 'react';
import { Form, Check } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { useStepper, ProjectNotes } from '..';

/**
 * Form component of DocumentationForm.
 * @param param0 isReadOnly disable editing
 */
const DocumentationForm = ({ isReadOnly }: IStepProps) => {
  const { project } = useStepper();
  if (!project) {
    // Step does not allow creation of new properties
    throw Error('Unexpected error updating project. Please reload your project.');
  }

  return (
    <Fragment>
      <h3>Documentation</h3>
      {project.tasks.map((task: any, index: number) => (
        <Form.Row key={task.name} className="DocumentationForm">
          <Check
            field={`tasks.${index}.isCompleted`}
            postLabel={task.description}
            required={!task.isOptional}
            disabled={isReadOnly}
          />
        </Form.Row>
      ))}

      {!isReadOnly && <ProjectNotes />}
    </Fragment>
  );
};

export default DocumentationForm;
