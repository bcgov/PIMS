import * as React from 'react';
import { Formik, Form, getIn } from 'formik';
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
  DisposeWorkflowStatus,
  handleValidate,
} from '../../common';
import { ValidationGroup } from 'components/common/tabValidation';
import {
  saveSplTab,
  SplTabs,
  SurplusPropertyInformationYupSchema,
  SurplusPropertyListYupSchema,
  CloseOutFormValidationSchema,
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
  const defaultTab =
    project?.statusCode === ReviewWorkflowStatus.Disposed
      ? SPPApprovalTabs.closeOutForm
      : SPPApprovalTabs.spl;
  const currentTab = useSelector<RootState, string | null>(state => state.splTab) ?? defaultTab;
  const dispatch = useDispatch();

  const canUserEdit =
    canUserApproveForm() &&
    (project?.statusCode === ReviewWorkflowStatus.ApprovedForSpl ||
      project?.statusCode === ReviewWorkflowStatus.PreMarketing ||
      project?.statusCode === ReviewWorkflowStatus.OnMarket ||
      project?.statusCode === ReviewWorkflowStatus.ContractInPlace ||
      currentTab === SPPApprovalTabs.closeOutForm);
  const setCurrentTab = (tabName: string) => {
    dispatch(saveSplTab(tabName));
  };
  let initialValues = copyAppraisalTasks(project);

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
    {
      schema: CloseOutFormValidationSchema,
      tab: SPPApprovalTabs.closeOutForm,
      statusCode: ReviewWorkflowStatus.Disposed,
    },
  ];
  const getValidationGroups = (statusCode?: string) => {
    // Do not validate the close out form when transitioning statuses.
    if (currentTab !== SPPApprovalTabs.closeOutForm) {
      return splValidationGroups.slice(0, splValidationGroups.length - 1);
    } else {
      return splValidationGroups;
    }
  };

  return (
    <Container fluid className="splStep">
      <Formik
        initialValues={initialValues}
        validateOnMount={true}
        enableReinitialize={true}
        onSubmit={(values: IProject) => {
          return onSubmitReview(
            values,
            formikRef,
            submitStatusCode,
            getStatusTransitionWorkflow(submitStatusCode),
          ).then((project: IProject) => {
            if (project?.statusCode === ReviewWorkflowStatus.Disposed) {
              setCurrentTab(SPPApprovalTabs.closeOutForm);
            }
          });
        }}
        //only perform validation if the user is attempting to dispose the project.
        validate={(values: IProject) =>
          submitStatusCode === ReviewWorkflowStatus.Disposed || submitStatusCode === undefined
            ? handleValidate(values, getValidationGroups(submitStatusCode))
            : Promise.resolve({})
        }
      >
        {({ values, errors, touched }) => (
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
                disableCancel={project?.statusCode === ReviewWorkflowStatus.Disposed}
                submitDirectly={() => {
                  getIn(errors, 'test');
                  //do not perform yup schema validation on save, but don't allow form submit if there are edited fields in error.
                  const touchedErrors = _.filter(
                    _.intersection(Object.keys(errors), Object.keys(touched)),
                    'properties',
                  );
                  if (touchedErrors.length === 0) {
                    onSubmitReview(
                      values,
                      formikRef,
                      submitStatusCode,
                      getStatusTransitionWorkflow(submitStatusCode),
                    );
                  }
                }}
              />
            )}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SplStep;
