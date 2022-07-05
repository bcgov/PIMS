import { IProject, IProjectTask, IStepProps } from 'features/projects/interfaces';
import { Formik, setIn, validateYupSchema, yupToFormErrors } from 'formik';
import { WorkflowStatus } from 'hooks/api/projects';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { StepErrorSummary, useProject, useStepForm } from '../../common';
import { fetchProjectTasks } from '../../common/projectsActionCreator';
import { ReviewApproveActions } from '../../dispose';
import {
  ApproveExemptionRequestSchema,
  DenyProjectYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
  UpdateInfoStepYupSchema,
} from '../../dispose/forms/disposalYupSchema';
import { ReviewApproveForm } from '..';

export const ReviewApproveStepSchema = UpdateInfoStepYupSchema.concat(
  ProjectDraftStepYupSchema,
).concat(SelectProjectPropertiesStepYupSchema);

export const ReviewExemptionRequestSchema = ApproveExemptionRequestSchema.concat(
  ReviewApproveStepSchema,
);

/**
 * Validate the project status tasks that are required.
 * @param project The project to validate.
 */
export const validateTasks = (project: IProject) => {
  const statusTasks = !project.exemptionRequested
    ? _.filter(
        project.tasks,
        task =>
          task.statusCode === WorkflowStatus.PropertyReview ||
          task.statusCode === WorkflowStatus.DocumentReview,
      )
    : _.filter(
        project.tasks,
        task =>
          task.statusCode === WorkflowStatus.ExemptionProcess ||
          task.statusCode === WorkflowStatus.DocumentReview ||
          task.statusCode === WorkflowStatus.ExemptionReview,
      );
  return statusTasks.reduce((errors: any, task: IProjectTask, index: number) => {
    if (!task.isCompleted && !task.isOptional) {
      errors = setIn(errors, `tasks.${project.tasks.indexOf(task)}.isCompleted`, 'Required');
    }
    return errors;
  }, {});
};

/**
 * Validate the deny project action.
 * @param project The project to validate.
 */
export const validateDeny = async (project: IProject) => {
  try {
    await validateYupSchema(project, DenyProjectYupSchema);
    return Promise.resolve({});
  } catch (errors) {
    return Promise.resolve(yupToFormErrors(errors));
  }
};

/**
 * Validate the approve project action.
 * @param project The project to validate.
 */
export const validateApprove = async (project: IProject) => {
  let taskErrors = validateTasks(project);
  try {
    await validateYupSchema(
      project,
      project.exemptionRequested ? ReviewExemptionRequestSchema : ReviewApproveStepSchema,
    );
    return Promise.resolve(taskErrors);
  } catch (errors) {
    return _.merge(yupToFormErrors(errors), taskErrors);
  }
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
  const { noFetchingProjectRequests } = useStepForm();

  useEffect(() => {
    fetchProjectTasks('ASSESS-DISPOSAL');
  }, []);

  const canEdit =
    canUserApproveForm() &&
    (project.statusCode === WorkflowStatus.PropertyReview ||
      project.statusCode === WorkflowStatus.ExemptionReview);

  // validate form and tasks, skipping validation in the case of deny and save.
  const handleValidate = async (values: IProject) => {
    if (submitStatusCode === WorkflowStatus.Denied) {
      return await validateDeny(values);
    } else if (submitStatusCode !== undefined) {
      return await validateApprove(values);
    }
  };

  const initialValues: IProject = {
    ...project,
    statusCode: project.status?.code,
    confirmation: true,
  };

  const getNextWorkflowCode = (submitStatusCode: string | undefined, values: any) => {
    if (submitStatusCode === WorkflowStatus.ApprovedForErp) {
      return 'ERP';
    } else if (submitStatusCode === WorkflowStatus.ApprovedForExemption) {
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
        enableReinitialize={true}
        onSubmit={(values: IProject) => {
          const workflowCode = getNextWorkflowCode(submitStatusCode, values);
          return onSubmitReview(values, formikRef, submitStatusCode, workflowCode).then(
            (project: IProject) => {
              switch (project?.statusCode) {
                case WorkflowStatus.ApprovedForErp:
                case WorkflowStatus.ApprovedForExemption:
                  history.push(`/projects/disposal/${project.id}` ?? 'invalid');
                  break;
                case WorkflowStatus.Denied:
                  goToDisposePath('../summary');
                  break;
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
                submitDirectly: (values: IProject) =>
                  onSubmitReview(values, formikRef, submitStatusCode, values.workflowCode),
              }}
            />
          ) : null}
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewApproveStep;
