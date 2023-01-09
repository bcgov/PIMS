import classNames from 'classnames';
import { Check, Form } from 'components/common/form';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import React, { Fragment } from 'react';

import { IProject, IProjectTask } from '../../interfaces';

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
          <Form.Group key={task.name} className={classNames('tasksForm', className)}>
            <Check
              datatestid={`taskform-check-${_.findIndex(values.tasks, { taskId: task.taskId })}`}
              field={`tasks.${_.findIndex(values.tasks, { taskId: task.taskId })}.isCompleted`}
              postLabel={task.description}
              required={!task.isOptional}
              disabled={isReadOnly}
            />
          </Form.Group>
        ))}
    </Fragment>
  );
};

export default TasksForm;
