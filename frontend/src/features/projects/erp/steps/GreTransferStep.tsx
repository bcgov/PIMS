import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';

import {
  IStepProps,
  useStepForm,
  IProject,
  StepStatusIcon,
  ReviewWorkflowStatus,
  updatePimsWarning,
  useProject,
} from '../../common';

import { Formik } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
  GreTransferStepYupSchema,
} from '../../dispose/forms/disposalYupSchema';
import { Button } from 'components/common/form';
import { formatDate } from 'utils';
import styled from 'styled-components';
import StepErrorSummary from '../../common/components/StepErrorSummary';
import GenericModal from 'components/common/GenericModal';
import { GreTransferForm } from '../../common';

export const GreTransferStepSchema = UpdateInfoStepYupSchema.concat(
  ProjectDraftStepYupSchema,
).concat(SelectProjectPropertiesStepYupSchema);

const CenterBoldText = styled.div`
  text-align: center;
  font-family: 'BCSans-Bold';
  margin-bottom: 1.5rem;
`;

const FlexRight = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin: 0.5rem 0;
  text-align: right;
`;

/**
 * Allows SRES users to transfer properties in a project to the purchasing agency.
 * {isReadOnly formikRef} formikRef allow remote formik access
 */
const GreTransferStep = ({ formikRef }: IStepProps) => {
  const { project } = useProject();
  const {
    onSubmitReview,
    canUserApproveForm,
    canUserOverride,
    noFetchingProjectRequests,
  } = useStepForm();
  const [updatePims, setUpdatePims] = useState(false);

  const initialValues: IProject = {
    ...project,
    agencyId: 0,
  };

  const canEdit =
    canUserOverride() ||
    (canUserApproveForm() &&
      (project.statusCode === ReviewWorkflowStatus.ERP ||
        project.statusCode === ReviewWorkflowStatus.OnHold ||
        project.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
        project.statusCode === ReviewWorkflowStatus.NotInSpl));

  const label = () => {
    switch (project.statusCode) {
      case ReviewWorkflowStatus.ApprovedForExemption:
        return 'Approved for Surplus Property Program with Exemption';
      case ReviewWorkflowStatus.NotInSpl:
        return 'Not in SPL';
      default:
        return 'Approved for Surplus Property Program';
    }
  };

  return (
    <Container fluid className="GreTransferStep">
      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        validationSchema={GreTransferStepYupSchema}
        enableReinitialize={true}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={(values: IProject) => {
          values.agencyId = +values.agencyId;
          values.properties?.forEach(p => (p.agencyId = +p.agencyId));
          onSubmitReview(values, formikRef, ReviewWorkflowStatus.TransferredGRE);
        }}
      >
        {({ isSubmitting, submitForm, values, validateForm, setTouched }) => (
          <Form>
            <StepStatusIcon
              preIconLabel={label()}
              postIconLabel={`Approval Date ${formatDate(project.approvedOn)}`}
            />
            {project.statusCode === ReviewWorkflowStatus.TransferredGRE ? (
              <CenterBoldText style={{ color: '#2E8540' }}>
                Property Information Successfully Updated
              </CenterBoldText>
            ) : (
              <CenterBoldText>Transfer within the Greater Reporting Entity</CenterBoldText>
            )}
            <GreTransferForm canEdit={canEdit} />
            <StepErrorSummary />
            {canEdit ? (
              <FlexRight>
                <Button
                  style={{ maxWidth: '18rem' }}
                  disabled={values.agencyId === project.agencyId || values.agencyId === 0}
                  showSubmitting
                  isSubmitting={!noFetchingProjectRequests}
                  onClick={() =>
                    validateForm().then((errors: any) => {
                      if (Object.keys(errors).length === 0) {
                        setUpdatePims(true);
                      } else {
                        setTouched(errors);
                      }
                    })
                  }
                >
                  Update Property Information Management System
                </Button>
                {updatePims && (
                  <GenericModal
                    display={updatePims}
                    cancelButtonText="Close"
                    okButtonText="Update PIMS"
                    handleOk={() => {
                      submitForm();
                      setUpdatePims(false);
                    }}
                    handleCancel={() => {
                      setUpdatePims(false);
                    }}
                    title="Really Update PIMS?"
                    message={updatePimsWarning}
                  />
                )}
              </FlexRight>
            ) : null}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default GreTransferStep;
