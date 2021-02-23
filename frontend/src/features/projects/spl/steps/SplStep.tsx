import './SplStep.scss';

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
  IApiProject,
} from '../../common';
import { ValidationGroup } from 'components/common/tabValidation';
import {
  saveSplTab,
  SplTabs,
  SurplusPropertyInformationYupSchema,
  SurplusPropertyListOnMarketYupSchema,
  SurplusPropertyListContractInPlaceYupSchema,
  SurplusPropertyListDisposeYupSchema,
  CloseOutFormValidationSchema,
  RemoveFromSplYupSchema,
} from '..';
import { ApprovalActions } from 'features/projects/erp';
import { DocumentationStepSchema } from 'features/projects/dispose';
import { useHistory } from 'react-router-dom';
import { toFlatProject } from 'features/projects/common/projectConverter';

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

/**
 * Provides a form to manage a disposal project during SPL.
 * @param {IStepProps} { formikRef }
 * @returns SplStep component.
 */
const SplStep = ({ formikRef }: IStepProps) => {
  const { project, getStatusTransitionWorkflow } = useProject();
  const { onSubmitReview, canUserApproveForm, canUserOverride } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState(undefined);
  const defaultTab =
    project?.statusCode === ReviewWorkflowStatus.Disposed
      ? SPPApprovalTabs.closeOutForm
      : SPPApprovalTabs.spl;
  const currentTab = useSelector<RootState, string | null>(state => state.splTab) ?? defaultTab;
  const dispatch = useDispatch();
  const history = useHistory();

  const goToGreTransferred = () =>
    history.push(`./spl/gretransfer?projectNumber=${project?.projectNumber}`);

  //** Different validation rules based on the status selected. */
  const splValidationGroups: ValidationGroup[] = [
    {
      schema: SurplusPropertyInformationYupSchema,
      tab: SPPApprovalTabs.projectInformation,
      statusCode: DisposeWorkflowStatus.Draft,
    },
    {
      schema: RemoveFromSplYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.NotInSpl,
    },
    {
      schema: SurplusPropertyListOnMarketYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.OnMarket,
    },
    {
      schema: SurplusPropertyListContractInPlaceYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.ContractInPlaceConditional,
    },
    {
      schema: SurplusPropertyListContractInPlaceYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.ContractInPlaceUnconditional,
    },
    {
      schema: DocumentationStepSchema,
      tab: SPPApprovalTabs.documentation,
      statusCode: ReviewWorkflowStatus.Disposed,
    },
    {
      schema: SurplusPropertyListContractInPlaceYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.Disposed,
    },
    {
      schema: SurplusPropertyListDisposeYupSchema,
      tab: SPPApprovalTabs.spl,
      statusCode: ReviewWorkflowStatus.Disposed,
    },
    {
      schema: CloseOutFormValidationSchema,
      tab: SPPApprovalTabs.closeOutForm,
      statusCode: ReviewWorkflowStatus.Disposed,
    },
  ];

  /**
   * Get the validation rules for the specified 'statusCode' or return them all.
   * @param statusCode The status code for the desired status.
   */
  const getValidationGroups = (statusCode?: string) => {
    if (statusCode) {
      return splValidationGroups.filter(g => g.statusCode === statusCode);
    }
    return [];
  };

  const canUserEdit =
    canUserOverride() ||
    (canUserApproveForm() &&
      _.includes(
        [
          ReviewWorkflowStatus.ApprovedForSpl,
          ReviewWorkflowStatus.PreMarketing,
          ReviewWorkflowStatus.OnMarket,
          ReviewWorkflowStatus.ContractInPlaceConditional,
          ReviewWorkflowStatus.ContractInPlaceUnconditional,
          ReviewWorkflowStatus.NotInSpl,
        ],
        project?.statusCode,
      )) ||
    currentTab === SPPApprovalTabs.closeOutForm;

  const setCurrentTab = (tabName: string) => {
    dispatch(saveSplTab(tabName));
  };
  let initialValues = copyAppraisalTasks(project);

  return (
    <Container fluid className="splStep">
      <Formik
        initialValues={initialValues}
        onSubmit={(values: IProject, actions) => {
          return onSubmitReview(
            values,
            formikRef,
            submitStatusCode,
            getStatusTransitionWorkflow(submitStatusCode),
          ).then((project: IApiProject) => {
            actions.resetForm({ values: toFlatProject(project) });
            if (
              project?.statusCode === ReviewWorkflowStatus.NotInSpl ||
              project?.statusCode === ReviewWorkflowStatus.ApprovedForSpl
            ) {
              history.go(0);
            } else if (project?.statusCode === ReviewWorkflowStatus.Disposed) {
              setCurrentTab(SPPApprovalTabs.closeOutForm);
            }
          });
        }}
        validate={async (values: IProject) => {
          const errors =
            submitStatusCode === undefined ||
            submitStatusCode === ReviewWorkflowStatus.NotInSpl ||
            submitStatusCode === ReviewWorkflowStatus.Disposed ||
            submitStatusCode === ReviewWorkflowStatus.OnMarket ||
            submitStatusCode === ReviewWorkflowStatus.ContractInPlaceConditional ||
            submitStatusCode === ReviewWorkflowStatus.ContractInPlaceUnconditional
              ? handleValidate(values, getValidationGroups(submitStatusCode))
              : Promise.resolve({});
          return await errors;
        }}
      >
        {({ values, errors, touched, resetForm }) => (
          <Form>
            <StepStatusIcon
              preIconLabel="Approved for Surplus Property Program"
              postIconLabel={`Approval Date ${formatDate(project?.approvedOn)}`}
            />
            <CenterBoldText>{project?.status?.name ?? 'Unknown'}</CenterBoldText>
            <SplTabs
              isReadOnly={canUserEdit !== true}
              {...{ submitStatusCode, setSubmitStatusCode, currentTab, setCurrentTab }}
              goToGreTransferred={goToGreTransferred}
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
                    ).then((project: IApiProject) => {
                      resetForm({ values: toFlatProject(project) });
                    });
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
