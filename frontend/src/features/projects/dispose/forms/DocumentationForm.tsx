import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { Form, TextArea } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { ITask } from '../slices/projectTasksSlice';
import { Check } from 'components/common/form/Check';
import useStepper from '../hooks/useStepper';

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

      {!isReadOnly && (
        <Form.Row>
          <Form.Label className="col-md-12">Notes:</Form.Label>
          <TextArea outerClassName="col-md-8" field="note" />
        </Form.Row>
      )}
    </Fragment>
  );
};

export default DocumentationForm;
