import * as React from 'react';
import { Formik, Form, setIn, validateYupSchema, yupToFormErrors } from 'formik';
import {
  useStepper,
  IProject,
  useStepForm,
  StepSuccessIcon,
  ApprovalForm,
  ApprovalActions,
} from '..';
import _ from 'lodash';
import { useState } from 'react';
import { formatDate } from 'utils';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import * as Yup from 'yup';
import {
  SPPApprovalTabs,
  DisposeWorkflowStatus,
  ReviewWorkflowStatus,
  IProjectTask,
} from '../interfaces';
import {
  ProjectDraftStepYupSchema,
  UpdateInfoStepYupSchema,
  DocumentationStepSchema,
} from '../forms/disposalYupSchema';

interface IApprovalStepProps {}

interface ValidationGroup {
  schema: any;
  tab: SPPApprovalTabs;
  statusCode: string;
}

const validationGroups: ValidationGroup[] = [
  {
    schema: ProjectDraftStepYupSchema && UpdateInfoStepYupSchema,
    tab: SPPApprovalTabs.projectInformation,
    statusCode: DisposeWorkflowStatus.Draft,
  },
  {
    schema: DocumentationStepSchema,
    tab: SPPApprovalTabs.documentation,
    statusCode: DisposeWorkflowStatus.RequiredDocumentation,
  },
  {
    schema: Yup.object().shape({}),
    tab: SPPApprovalTabs.erp,
    statusCode: ReviewWorkflowStatus.ApprovedForErp,
  },
];

const CenterBoldText = styled.div`
  text-align: center;
  font-family: 'BCSans-Bold';
  margin-bottom: 1.5rem;
`;

/**
 * Validate all tab based forms, reporting all tabs that have errors.
 * @param values Formik field values.
 * @param setStatus Formik setStatus function, used to return a top-level error message
 */
const handleValidate = async (values: IProject) => {
  let errors: any = { tabs: [] };
  for (const validationGroup of validationGroups) {
    errors = await validateTab(values, errors, validationGroup);
  }
  if (Object.keys(errors).length > 0 && !!errors.tabs?.length) {
    errors = setIn(
      errors,
      'status',
      `The following tabs have errors: ${_.uniq(errors.tabs).join(', ')}`,
    );
  } else {
    errors = {};
  }
  return Promise.resolve(errors);
};

/**
 * Validate the given tab using the passed validation group.
 * @param values project being validated
 * @param errors any errors already detected during validation
 * @param validationGroup the tab, schema, and statusCode to use to validate this tab.
 */
const validateTab = async (values: IProject, errors: any, validationGroup: ValidationGroup) => {
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
      const test = _.merge(yupToFormErrors(err), errors);
      return test;
    },
  );
};

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

const ApprovalStep: React.FunctionComponent<IApprovalStepProps> = () => {
  const { project } = useStepper();
  const { onSubmitReview, canUserApproveForm } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState(undefined);
  const [currentTab, setCurrentTab] = useState(SPPApprovalTabs.erp);
  return (
    <Container fluid>
      <Formik
        enableReinitialize={true}
        initialValues={project}
        onSubmit={(values: any, actions: any) => onSubmitReview(values, actions, submitStatusCode)}
        validate={handleValidate}
      >
        <Form>
          <StepSuccessIcon
            preIconLabel="Approved for SPP"
            postIconLabel={`Approval Date ${formatDate(project.approvedOn)}`}
          />
          <CenterBoldText>{project.status.name}</CenterBoldText>
          <ApprovalForm
            isReadOnly={
              !canUserApproveForm() || project.statusCode === ReviewWorkflowStatus.Cancelled
            }
            {...{ submitStatusCode, setSubmitStatusCode, currentTab, setCurrentTab }}
          />
          <ApprovalActions
            submitStatusCode={submitStatusCode}
            setSubmitStatusCode={setSubmitStatusCode}
          />
        </Form>
      </Formik>
    </Container>
  );
};

export default ApprovalStep;
