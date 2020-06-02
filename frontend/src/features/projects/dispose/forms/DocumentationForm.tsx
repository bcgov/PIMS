import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { Form, Check } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { useStepper, ITask, ProjectNotes } from '..';

/**
 * Form component of DocumentationForm.
 * @param param0 isReadOnly disable editing
 */
const DocumentationForm = ({ isReadOnly }: IStepProps) => {
  const { project } = useStepper();
  const disposeTasks = useSelector<RootState, ITask[]>(state => state.tasks);
  if (!project) {
    // Step does not allow creation of new properties
    throw Error('Unexpected error updating project. Please reload your project.');
  }

  return (
    <Fragment>
      <h3>Documentation</h3>
      {disposeTasks.map((task, index) => (
        <Form.Row key={task.name}>
          <Check
            field={`tasks.${index}.isCompleted`}
            postLabel={task.description}
            required
            disabled={isReadOnly}
          />
        </Form.Row>
      ))}

      {!isReadOnly && <ProjectNotes />}
    </Fragment>
  );
};

export default DocumentationForm;
