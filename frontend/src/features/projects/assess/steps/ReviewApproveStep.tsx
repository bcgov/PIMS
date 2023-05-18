import ProjectLayout from 'features/projects/common/ProjectLayout';
import { IProject, IProjectTask, IStepProps } from 'features/projects/interfaces';
import { LayoutWrapper } from 'features/routes';
import { Formik, FormikValues, setIn, validateYupSchema, yupToFormErrors } from 'formik';
import { WorkflowStatus } from 'hooks/api/projects';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

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

export const ReviewExemptionRequestSchema =
  ApproveExemptionRequestSchema.concat(ReviewApproveStepSchema);

/**
 * Validate the project status tasks that are required.
 * @param project The project to validate.
 */
export const validateTasks = (project: IProject) => {
  const statusTasks = !project.exemptionRequested
    ? _.filter(
        project.tasks,
        (task) =>
          task.statusCode === WorkflowStatus.PropertyReview ||
          task.statusCode === WorkflowStatus.DocumentReview,
      )
    : _.filter(
        project.tasks,
        (task) =>
          task.statusCode === WorkflowStatus.ExemptionProcess ||
          task.statusCode === WorkflowStatus.DocumentReview ||
          task.statusCode === WorkflowStatus.ExemptionReview,
      );
  return statusTasks.reduce((errors: any, task: IProjectTask) => {
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
  const taskErrors = validateTasks(project);

  // Scroll to required fields
  if (taskErrors.tasks && taskErrors.tasks.length > 0) {
    const indexOfFirstRequiredTask = taskErrors.tasks.findIndex(
      (element: { isCompleted: string } | undefined) => element?.isCompleted === 'Required',
    );
    const element = document.querySelector(
      `input[name='tasks.${indexOfFirstRequiredTask}.isCompleted']`,
    );
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

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

const ReviewApproveStepContent = ({ formikRef }: IStepProps) => {
  const { project } = useProject();
  const navigate = useNavigate();
  const location = useLocation();
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
                  navigate(`/projects/disposal/${project.id}` ?? 'invalid');
                  break;
                case WorkflowStatus.Denied:
                  navigate(`/projects/summary${location.search}`);
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
            goToAddProperties={() =>
              navigate(`/projects/assess/properties/update${location.search}`)
            }
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

const ReviewApproveStep = () => {
  const formikRef = useRef<FormikValues>();

  return (
    <LayoutWrapper
      layout={ProjectLayout}
      component={ReviewApproveStepContent}
      componentProps={{ formikRef }}
    ></LayoutWrapper>
  );
};

export default ReviewApproveStep;
