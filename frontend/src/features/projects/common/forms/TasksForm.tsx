import React, { Fragment } from 'react';
import { Form, Check } from 'components/common/form';
import { IProjectTask, IProject } from '../interfaces';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import classNames from 'classnames';

interface ITaskFormParams {
  tasks: IProjectTask[];
  isReadOnly?: boolean;
  className?: string;
}
/**
 * Generic form component that creates a task list from an array of tasks.
 * @param param0 list of tasks
 */
const TasksForm = ({ tasks, isReadOnly, className }: ITaskFormParams) => {
  const { values } = useFormikContext<IProject>();
  return (
    <Fragment>
      {tasks !== undefined &&
        tasks.map((task: any) => (
          <Form.Row key={task.name} className={classNames('tasksForm', className)}>
            <Check
              field={`tasks.${_.findIndex(values.tasks, { taskId: task.taskId })}.isCompleted`}
              postLabel={task.description}
              required={!task.isOptional}
              disabled={isReadOnly}
            />
          </Form.Row>
        ))}
    </Fragment>
  );
};

export default TasksForm;
