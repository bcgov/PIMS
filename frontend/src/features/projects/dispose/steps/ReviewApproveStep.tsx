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

const ReviewApproveStepSchema = UpdateInfoStepYupSchema.concat(ProjectDraftStepYupSchema).concat(
  SelectProjectPropertiesStepYupSchema,
);

const validateTasks = (project: IProject) => {
  return project.tasks.reduce((errors: any, task: IProjectTask, index: number) => {
    if (!task.isCompleted && !task.isOptional) {
      errors = setIn(errors, `tasks.${index}.isCompleted`, 'Required');
    }
    return errors;
  }, {});
};

const handleValidate = (values: IProject) => {
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
  const { onSubmitReview, canUserEditForm } = useStepForm();
  const [submitStatusId, setSubmitStatusId] = useState<number | undefined>(undefined);
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
          const tempValues = _.cloneDeep(values);
          tempValues.statusId = submitStatusId ?? values.statusId;
          onSubmitReview(tempValues, actions);
        }}
        validate={handleValidate}
      >
        <Form>
          <h1>Project Application Review</h1>
          <ReviewApproveForm
            goToAddProperties={() => goToDisposePath('properties/update')}
            canEdit={canUserEditForm(project.agencyId)}
          />
          <ReviewApproveActions {...{ submitStatusId, setSubmitStatusId }} />
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewApproveStep;
