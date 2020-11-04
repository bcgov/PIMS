import { IProject, IProjectTask } from '..';
import { setIn, validateYupSchema, yupToFormErrors } from 'formik';
import { ValidationGroup } from 'components/common/tabValidation';
import _ from 'lodash';

/**
 * Validate tasks for this project and status code
 * @param project the project to validate
 * @param statusCode any return invalid tasks that match this statusCode
 */
export const validateTasks = (project: IProject, statusCode: string) => {
  return project.tasks.reduce((errors: any, task: IProjectTask, index: number) => {
    if (!task.isCompleted && !task.isOptional && task.statusCode === statusCode) {
      errors = setIn(errors, `tasks.${index}.isCompleted`, 'Required');
    }
    return errors;
  }, {});
};

/**
 * Validate all tab based forms, reporting all tabs that have errors.
 * @param values Formik field values.
 * @param setStatus Formik setStatus function, used to return a top-level error message
 */
export const handleValidate = async (values: IProject, validationGroups: ValidationGroup[]) => {
  let errors: any = { tabs: [] };
  for (const validationGroup of validationGroups) {
    errors = await validateTab(values, errors, validationGroup);
  }
  if (errors.tabs?.length === 0) {
    delete errors.tabs;
  }
  return Promise.resolve(errors);
};

/**
 * Validate the given tab using the passed validation group.
 * @param values project being validated
 * @param errors any errors already detected during validation
 * @param validationGroup the tab, schema, and statusCode to use to validate this tab.
 */
export const validateTab = async (
  values: IProject,
  errors: any,
  validationGroup: ValidationGroup,
) => {
  const { schema, tab, statusCode } = validationGroup;
  const taskErrors = validateTasks(values, statusCode);
  if (Object.keys(taskErrors).length > 0) {
    errors.tabs.push(tab);
  }
  _.merge(errors, taskErrors);

  return await validateYupSchema(values, schema).then(
    () => {
      return errors;
    },
    (err: any) => {
      errors.tabs.push(tab);
      return _.merge(yupToFormErrors(err), errors);
    },
  );
};
