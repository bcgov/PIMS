import * as React from 'react';
import { Formik, Form } from 'formik';
import { useState } from 'react';
import { formatDate } from 'utils';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import StepErrorSummary from '../../common/components/StepErrorSummary';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  useStepForm,
  StepStatusIcon,
  SPPApprovalTabs,
  ReviewWorkflowStatus,
  IProject,
  IStepProps,
  useProject,
  handleValidate,
  ValidationGroup,
  DisposeWorkflowStatus,
  useAgencyResponseTable,
} from '../../common';
import { saveErpTab, ErpTabs, ApprovalActions } from '..';
import {
  ProjectDraftStepYupSchema,
  UpdateInfoStepYupSchema,
  DocumentationStepSchema,
} from 'features/projects/dispose';
import * as Yup from 'yup';

const CenterBoldText = styled.div`
  text-align: center;
  font-family: 'BCSans-Bold';
  margin-bottom: 1.5rem;
`;

export const validationGroups: ValidationGroup[] = [
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

const ErpStep = ({ formikRef }: IStepProps) => {
  const { project, getStatusTransitionWorkflow } = useProject();
  const { onSubmitReview, canUserApproveForm } = useStepForm();
  const [submitStatusCode, setSubmitStatusCode] = useState(undefined);
  const currentTab =
    useSelector<RootState, string | null>(state => state.erpTab) ?? SPPApprovalTabs.erp;
  const dispatch = useDispatch();
  const history = useHistory();
  const { projectAgencyResponses } = useAgencyResponseTable();
  const initialValues: IProject = { ...project, projectAgencyResponses: projectAgencyResponses };
  const canUserEdit =
    canUserApproveForm() &&
    (project?.statusCode === ReviewWorkflowStatus.ERP ||
      project?.statusCode === ReviewWorkflowStatus.OnHold ||
      project?.statusCode === ReviewWorkflowStatus.ApprovedForExemption);
  const setCurrentTab = (tabName: string) => {
    dispatch(saveErpTab(tabName));
  };
  const goToGreTransferred = () =>
    history.push(`./gretransfer?projectNumber=${project?.projectNumber}`);
  const goToSpl = () => history.push(`./approved?projectNumber=${project?.projectNumber}`);
  return (
    <Container fluid>
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
            if (project.statusCode === ReviewWorkflowStatus.ApprovedForSpl) {
              goToSpl();
            }
          });
        }}
        validate={(values: IProject) => handleValidate(values, validationGroups)}
      >
        <Form>
          <StepStatusIcon
            preIconLabel="Approved for Surplus Property Program"
            postIconLabel={`Approval Date ${formatDate(project?.approvedOn)}`}
          />
          <CenterBoldText>{project?.status?.name ?? 'Unknown'}</CenterBoldText>
          <ErpTabs
            isReadOnly={canUserEdit !== true}
            goToGreTransferred={goToGreTransferred}
            {...{ submitStatusCode, setSubmitStatusCode, currentTab, setCurrentTab }}
          />
          <StepErrorSummary />
          {canUserEdit && (
            <ApprovalActions
              submitStatusCode={submitStatusCode}
              setSubmitStatusCode={setSubmitStatusCode}
            />
          )}
        </Form>
      </Formik>
    </Container>
  );
};

export default ErpStep;
