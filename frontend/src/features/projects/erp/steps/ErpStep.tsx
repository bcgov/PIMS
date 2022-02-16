import './ErpStep.scss';

import { ValidationGroup } from 'components/common/tabValidation';
import {
  DisposeWorkflowStatus,
  ReviewWorkflowStatus,
  SPPApprovalTabs,
} from 'features/projects/constants';
import {
  DocumentationStepSchema,
  ProjectDraftStepYupSchema,
  UpdateInfoStepYupSchema,
} from 'features/projects/dispose';
import { IProject, IStepProps } from 'features/projects/interfaces';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import queryString from 'query-string';
import * as React from 'react';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import styled from 'styled-components';
import { formatDate } from 'utils';
import * as Yup from 'yup';

import { handleValidate, StepStatusIcon, useProject, useStepForm } from '../../common';
import StepErrorSummary from '../../common/components/StepErrorSummary';
import { ApprovalActions, ErpTabs, saveErpTab } from '..';
import { EnhancedReferralExemptionApprovedForSplSchema } from '../forms/erpYupSchema';

const CenterBoldText = styled.div`
  text-align: center;
  font-family: 'BCSans-Bold';
  margin-bottom: 1.5rem;
`;

const ErpStep = ({ formikRef }: IStepProps) => {
  const { project, getStatusTransitionWorkflow } = useProject();
  const { onSubmitReview, canUserApproveForm, canUserOverride } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState(undefined);
  const defaultTab =
    project.statusCode === ReviewWorkflowStatus.NotInSpl
      ? SPPApprovalTabs.closeOutForm
      : SPPApprovalTabs.erp;
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector((store) => store.erpTab) ?? defaultTab;
  const navigate = useNavigate();
  const location = useLocation();
  const initialValues: IProject = { ...project };
  const canUserEdit =
    canUserOverride() ||
    (canUserApproveForm() &&
      _.includes(
        [
          ReviewWorkflowStatus.ERP,
          ReviewWorkflowStatus.ApprovedForErp,
          ReviewWorkflowStatus.OnHold,
          ReviewWorkflowStatus.ApprovedForExemption,
          ReviewWorkflowStatus.NotInSpl,
        ],
        project?.statusCode,
      )) ||
    currentTab === SPPApprovalTabs.closeOutForm;
  const setCurrentTab = (tabName: string) => {
    dispatch(saveErpTab(tabName));
  };
  const goToGreTransferred = () =>
    navigate(`./erp/gretransfer?projectNumber=${project?.projectNumber}`);
  const goToSpl = () => navigate(`./approved?projectNumber=${project?.projectNumber}&to=ERP-ON`);

  const params = queryString.parse(location.search);

  const validationGroups: ValidationGroup[] = [
    {
      schema: ProjectDraftStepYupSchema.concat(UpdateInfoStepYupSchema),
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
    {
      schema: EnhancedReferralExemptionApprovedForSplSchema,
      tab: SPPApprovalTabs.erp,
      statusCode: ReviewWorkflowStatus.ApprovedForSpl,
    },
  ];

  /**
   * Get the validation rules for the specified 'statusCode' or return them all.
   * @param statusCode The status code for the desired status.
   */
  const getValidationGroups = (statusCode?: string) => {
    if (statusCode) {
      return validationGroups.filter((g) => g.statusCode === statusCode);
    }
    return [];
  };

  return (
    <Container fluid className="erpStep">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values: IProject) => {
          onSubmitReview(
            values,
            formikRef,
            submitStatusCode,
            getStatusTransitionWorkflow(submitStatusCode),
          ).then((project: IProject) => {
            if (project?.statusCode === ReviewWorkflowStatus.ApprovedForErp) {
              params.to = 'ERP-ON';
              navigate({ search: queryString.stringify(params) });
              navigate(0);
            } else if (project?.statusCode === ReviewWorkflowStatus.ApprovedForSpl) {
              goToSpl();
            } else if (project?.statusCode === ReviewWorkflowStatus.NotInSpl) {
              setCurrentTab(SPPApprovalTabs.closeOutForm);
            }
          });
        }}
        validate={(values: IProject) =>
          handleValidate(values, getValidationGroups(submitStatusCode))
        }
      >
        {({ values, errors, touched }) => (
          <Form>
            <StepStatusIcon
              preIconLabel="Approved for Surplus Property Program"
              postIconLabel={`Approval Date ${formatDate(project?.approvedOn)}`}
            />
            <CenterBoldText>{project?.status?.name ?? 'Unknown'}</CenterBoldText>
            <ErpTabs
              isReadOnly={!canUserEdit}
              goToGreTransferred={goToGreTransferred}
              {...{ submitStatusCode, setSubmitStatusCode, currentTab, setCurrentTab }}
            />
            <StepErrorSummary />
            {canUserEdit && (
              <ApprovalActions
                submitStatusCode={submitStatusCode}
                setSubmitStatusCode={setSubmitStatusCode}
                submitDirectly={() => {
                  //do not perform yup schema validation on save, but don't allow form submit if there are edited fields in error.
                  if (_.intersection(Object.keys(errors), Object.keys(touched)).length === 0) {
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

export default ErpStep;
