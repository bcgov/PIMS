import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { ReviewApproveActions } from '../../dispose';
import { Formik, yupToFormErrors, setIn, validateYupSchema } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
} from '../../dispose/forms/disposalYupSchema';
import { fetchProjectTasks } from '../../common/projectsActionCreator';
import _ from 'lodash';
import { ReviewWorkflowStatus, IStepProps } from '../../common/interfaces';
import { useStepForm, IProject, IProjectTask, useProject, StepErrorSummary } from '../../common';
import { ReviewApproveForm } from '..';
import { useHistory } from 'react-router-dom';

export const ReviewApproveStepSchema = UpdateInfoStepYupSchema.concat(
  ProjectDraftStepYupSchema,
).concat(SelectProjectPropertiesStepYupSchema);

export const validateTasks = (project: IProject) => {
  const statusTasks = _.filter(
    project.tasks,
    task =>
      task.statusCode === ReviewWorkflowStatus.PropertyReview ||
      task.statusCode === ReviewWorkflowStatus.DocumentReview,
  );
  return statusTasks.reduce((errors: any, task: IProjectTask, index: number) => {
    if (
      !task.isCompleted &&
      !task.isOptional &&
      task.statusCode !== ReviewWorkflowStatus.ExemptionProcess &&
      !project.exemptionRequested
    ) {
      errors = setIn(errors, `tasks.${project.tasks.indexOf(task)}.isCompleted`, 'Required');
    }
    if (
      !task.isCompleted &&
      !task.isOptional &&
      task.statusCode !== ReviewWorkflowStatus.PropertyReview &&
      task.statusCode === ReviewWorkflowStatus.ExemptionProcess &&
      project.exemptionRequested
    ) {
      errors = setIn(errors, `tasks.${project.tasks.indexOf(task)}.isCompleted`, 'Required');
    }
    return errors;
  }, {});
};

/**
 * Expanded version of the ReviewApproveStep allowing for application review.
 * {isReadOnly formikRef} formikRef allow remote formik access
 */
const ReviewApproveStep = ({ formikRef }: IStepProps) => {
  const { project, goToDisposePath } = useProject();
  const history = useHistory();
  const { onSubmitReview, canUserApproveForm } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState<string | undefined>(undefined);
  useEffect(() => {
    fetchProjectTasks('ASSESS-DISPOSAL');
  }, []);
  const { noFetchingProjectRequests } = useStepForm();
  const canEdit =
    canUserApproveForm() &&
    (project.statusCode === ReviewWorkflowStatus.PropertyReview ||
      project.statusCode === ReviewWorkflowStatus.ExemptionReview);

  //validate form and tasks, skipping validation in the case of deny and save.
  const handleValidate = (values: IProject) => {
    if (
      submitStatusCode !== ReviewWorkflowStatus.ApprovedForErp &&
      submitStatusCode !== ReviewWorkflowStatus.ApprovedForExemption
    ) {
      return Promise.resolve({});
    }
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
  const initialValues: IProject = {
    ...project,
    statusCode: project.status?.code,
    confirmation: true,
  };

  const getNextWorkflowCode = (submitStatusCode: string | undefined, values: any) => {
    if (submitStatusCode === ReviewWorkflowStatus.ApprovedForErp) {
      return 'ERP';
    } else if (submitStatusCode === ReviewWorkflowStatus.ApprovedForExemption) {
      return 'ASSESS-EX-DISPOSAL';
    } else {
      return values.workflowCode;
    }
  };
  return (
    <Container fluid className="ReviewApproveStep">
      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        onSubmit={(values: IProject) => {
          const workflowCode = getNextWorkflowCode(submitStatusCode, values);
          return onSubmitReview(values, formikRef, submitStatusCode, workflowCode).then(
            (project: IProject) => {
              if (
                project?.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
                project?.statusCode === ReviewWorkflowStatus.ApprovedForExemption
              ) {
                history.push(
                  `${project.status?.route}?projectNumber=${project.projectNumber}` ?? 'invalid',
                );
              }
              if (project?.statusCode === ReviewWorkflowStatus.Denied) {
                goToDisposePath('../summary');
              }
            },
          );
        }}
        validate={handleValidate}
      >
        <Form>
          <h1>Project Application Review</h1>
          <ReviewApproveForm
            goToAddProperties={() => goToDisposePath('properties/update')}
            canEdit={canEdit}
          />
          <StepErrorSummary />
          {canEdit ? (
            <ReviewApproveActions
              {...{
                submitStatusCode,
                setSubmitStatusCode,
                isSubmitting: !noFetchingProjectRequests,
              }}
            />
          ) : null}
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewApproveStep;
