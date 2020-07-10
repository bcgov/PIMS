import * as React from 'react';
import { Formik, Form } from 'formik';
import _ from 'lodash';
import { useState } from 'react';
import { formatDate } from 'utils';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import StepErrorSummary from '../../common/components/StepErrorSummary';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  useStepForm,
  StepStatusIcon,
  SPPApprovalTabs,
  ReviewWorkflowStatus,
  IProject,
  IProjectTask,
  IStepProps,
  useProject,
  handleValidate,
  ValidationGroup,
  DisposeWorkflowStatus,
} from '../../common';
import {
  saveSplTab,
  SplTabs,
  SurplusPropertyInformationYupSchema,
  SurplusPropertyListYupSchema,
} from '..';
import { ApprovalActions } from 'features/projects/erp';
import './SplStep.scss';
import { DocumentationStepSchema } from 'features/projects/dispose';

const CenterBoldText = styled.div`
  text-align: center;
  font-family: 'BCSans-Bold';
  margin-bottom: 1.5rem;
`;

const copyAppraisalTasks = (project: IProject): IProject => {
  const initialValues = _.cloneDeep(project);
  const tasksToCopyTo = _.filter(initialValues.tasks, {
    statusCode: ReviewWorkflowStatus.Disposed,
  });
  _.forEach(tasksToCopyTo, (taskToCopyTo: IProjectTask) => {
    const taskToCopyFrom = _.find(initialValues.tasks, { name: taskToCopyTo.name });
    if (taskToCopyFrom?.isCompleted === true) {
      taskToCopyTo.isCompleted = taskToCopyFrom?.isCompleted ?? false;
      taskToCopyTo.completedOn = taskToCopyFrom?.completedOn ?? new Date();
    }
  });
  return initialValues;
};

const SplStep = ({ formikRef }: IStepProps) => {
  const { project, getStatusTransitionWorkflow } = useProject();
  const { onSubmitReview, canUserApproveForm } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState(undefined);
  const currentTab =
    useSelector<RootState, string | null>(state => state.splTab) ?? SPPApprovalTabs.spl;
  const dispatch = useDispatch();
  const canUserEdit =
    canUserApproveForm() &&
    (project?.statusCode === ReviewWorkflowStatus.ApprovedForSpl ||
      project?.statusCode === ReviewWorkflowStatus.PreMarketing ||
      project?.statusCode === ReviewWorkflowStatus.OnMarket ||
      project?.statusCode === ReviewWorkflowStatus.ContractInPlace);
  const setCurrentTab = (tabName: string) => {
    dispatch(saveSplTab(tabName));
  };
  const initialValues = copyAppraisalTasks(project);

  const splValidationGroups: ValidationGroup[] = [
    {
      schema: SurplusPropertyInformationYupSchema,
      tab: SPPApprovalTabs.projectInformation,
      statusCode: DisposeWorkflowStatus.Draft,
    },
    {
      schema: DocumentationStepSchema,
      tab: SPPApprovalTabs.documentation,
      statusCode: ReviewWorkflowStatus.Disposed,
    },
    {
      schema: SurplusPropertyListYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.ContractInPlace,
    },
  ];
  return (
    <Container fluid>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: IProject) =>
          onSubmitReview(
            values,
            formikRef,
            submitStatusCode,
            getStatusTransitionWorkflow(submitStatusCode),
          )
        }
        //only perform validation if the user is attempting to dispose the project.
        validate={(values: IProject) =>
          submitStatusCode === ReviewWorkflowStatus.Disposed || submitStatusCode === undefined
            ? handleValidate(values, splValidationGroups)
            : Promise.resolve({})
        }
      >
        {({ values }) => (
          <Form>
            <StepStatusIcon
              preIconLabel="Approved for Surplus Property Program"
              postIconLabel={`Approval Date ${formatDate(project?.approvedOn)}`}
            />
            <CenterBoldText>{project?.status?.name ?? 'Unknown'}</CenterBoldText>
            <SplTabs
              isReadOnly={canUserEdit !== true}
              {...{ submitStatusCode, setSubmitStatusCode, currentTab, setCurrentTab }}
            />
            <StepErrorSummary />
            {canUserEdit && (
              <ApprovalActions
                submitStatusCode={submitStatusCode}
                setSubmitStatusCode={setSubmitStatusCode}
                submitDirectly={() =>
                  onSubmitReview(
                    values,
                    formikRef,
                    submitStatusCode,
                    getStatusTransitionWorkflow(submitStatusCode),
                  )
                }
              />
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SplStep;
