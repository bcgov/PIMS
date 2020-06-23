import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import {
  IStepProps,
  useStepper,
  useStepForm,
  IProject,
  ReviewApproveActions,
  ReviewApproveForm,
  IProjectTask,
} from '..';
import { Formik, yupToFormErrors, setIn, validateYupSchema } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
} from '../forms/disposalYupSchema';
import { fetchProjectTasks } from '../projectsActionCreator';
import _ from 'lodash';

export const ReviewApproveStepSchema = UpdateInfoStepYupSchema.concat(
  ProjectDraftStepYupSchema,
).concat(SelectProjectPropertiesStepYupSchema);

export const validateTasks = (project: IProject) => {
  return project.tasks.reduce((errors: any, task: IProjectTask, index: number) => {
    if (!task.isCompleted && !task.isOptional) {
      errors = setIn(errors, `tasks.${index}.isCompleted`, 'Required');
    }
    return errors;
  }, {});
};

export const handleValidate = (values: IProject) => {
  let taskErrors = validateTasks(values);
  const yupErrors: any = validateYupSchema(values, ReviewApproveStepSchema).then(
    () => {
      return taskErrors;
    },
    (err: any) => {
      return _.merge(yupToFormErrors(err), taskErrors);
    },
  );
  return Promise.resolve(yupErrors);
};

/**
 * Expanded version of the ReviewApproveStep allowing for application review.
 * {isReadOnly formikRef} formikRef allow remote formik access
 */
const ReviewApproveStep = ({ formikRef }: IStepProps) => {
  const { project, goToDisposePath } = useStepper();
  const { onSubmitReview, canUserApproveForm } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchProjectTasks('ACCESS-DISPOSAL');
  }, []);

  const initialValues: IProject & { confirmation: boolean } = {
    ...project,
    statusCode: project.status?.code,
    confirmation: true,
  };
  return (
    <Container fluid className="ReviewApproveStep">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={(values: IProject, actions: any) => {
          onSubmitReview(values, actions, submitStatusCode);
        }}
        validate={handleValidate}
      >
        <Form>
          <h1>Project Application Review</h1>
          <ReviewApproveForm
            goToAddProperties={() => goToDisposePath('properties/update')}
            canEdit={canUserApproveForm()}
          />
          {canUserApproveForm() ? (
            <ReviewApproveActions {...{ submitStatusCode, setSubmitStatusCode }} />
          ) : null}
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewApproveStep;
