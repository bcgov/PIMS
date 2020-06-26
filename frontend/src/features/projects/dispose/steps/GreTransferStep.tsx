import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import {
  IStepProps,
  useStepper,
  useStepForm,
  IProject,
  StepStatusIcon,
  GreTransferForm,
  updatePimsWarning,
} from '..';
import { Formik } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
  GreTransferStepYupSchema,
} from '../forms/disposalYupSchema';
import { ReviewWorkflowStatus } from '../interfaces';
import { Button } from 'components/common/form';
import { formatDate } from 'utils';
import styled from 'styled-components';
import StepErrorSummary from './StepErrorSummary';
import GenericModal from 'components/common/GenericModal';

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
  const { project } = useStepper();
  const { onSubmitReview, canUserApproveForm, noFetchingProjectRequests } = useStepForm();
  const [updatePims, setUpdatePims] = useState(false);

  const initialValues: IProject = {
    ...project,
  };
  const canEdit =
    canUserApproveForm() &&
    (project.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
      project.statusCode === ReviewWorkflowStatus.OnHold);
  return (
    <Container fluid className="GreTransferStep">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        innerRef={formikRef}
        validationSchema={GreTransferStepYupSchema}
        onSubmit={(values: IProject) => {
          onSubmitReview(values, formikRef, ReviewWorkflowStatus.TransferredGRE);
        }}
      >
        {({ isSubmitting, submitForm, values, validateForm }) => (
          <Form>
            <StepStatusIcon
              preIconLabel="Approved for Surplus Property Program"
              postIconLabel={`Approval Date ${formatDate(project.approvedOn)}`}
            />
            {project.statusCode === ReviewWorkflowStatus.TransferredGRE ? (
              <CenterBoldText style={{ color: '#2E8540' }}>
                Property Information Successfully Updated
              </CenterBoldText>
            ) : (
              <CenterBoldText>Transferred within the Greater Revenue Entity</CenterBoldText>
            )}
            <GreTransferForm canEdit={canEdit} />
            <StepErrorSummary />
            {canEdit ? (
              <FlexRight>
                <Button
                  style={{ maxWidth: '18rem' }}
                  disabled={values.agencyId === project.agencyId}
                  showSubmitting
                  isSubmitting={!noFetchingProjectRequests}
                  onClick={() =>
                    validateForm().then((errors: any) => {
                      if (Object.keys(errors).length === 0) {
                        setUpdatePims(true);
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
