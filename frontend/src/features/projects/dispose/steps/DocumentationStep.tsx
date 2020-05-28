import './SelectProjectProperties.scss';

import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { RootState } from 'reducers/rootReducer';
import { Formik } from 'formik';
import { Form, TextArea } from 'components/common/form';
import { IStepProps } from '../interfaces';
import { ITask } from '../slices/projectTasksSlice';
import { Check } from 'components/common/form/Check';
import useStepForm from './useStepForm';
import useStepper from '../hooks/useStepper';
import StepErrorSummary from './StepErrorSummary';

/**
 * Displays all tasks from TASK table as clickable checkboxes.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const DocumentationStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
  const disposeTasks = useSelector<RootState, ITask[]>(state => state.tasks);
  if (!project) {
    // Step does not allow creation of new properties
    throw Error('Unexpected error updating project. Please reload your project.');
  }

  return (
    <Container fluid className="UpdateInfoStep">
      <Formik
        initialValues={project}
        innerRef={formikRef}
        onSubmit={(values, actions) => {
          // set the completed on dates during submission.
          values.tasks.forEach((task: any, index: any) => {
            const existingTask = project.tasks[index];

            //if any tasks have been completed for the first time set the completed date.
            if (task.isCompleted && !existingTask.isCompleted) {
              task.completedOn = new Date();
            }
          });
          onSubmit(values, actions);
        }}
      >
        {() => (
          <Form>
            <h3>Documentation</h3>
            {disposeTasks.map((task, index) => (
              <Form.Row key={task.name}>
                <Check outerClassName="col-md-1" field={`tasks.${index}.isCompleted`} />
                <Form.Label column md={6}>
                  {task.description}
                </Form.Label>
              </Form.Row>
            ))}

            {!isReadOnly && (
              <Form.Row>
                <Form.Label className="col-md-12" style={{ textAlign: 'left' }}>
                  Notes:
                </Form.Label>
                <TextArea outerClassName="col-md-8" field="note" />
              </Form.Row>
            )}
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default DocumentationStep;
