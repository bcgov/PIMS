import { DisposeWorkflowStatus } from 'features/projects/constants';
import { IStepProps } from 'features/projects/interfaces';
import { Formik } from 'formik';
import React from 'react';
import { Container, Form } from 'react-bootstrap';

import { ApprovalConfirmationForm, StepErrorSummary, useStepForm } from '../../common';
import { ApprovalConfirmationStepSchema, useStepper } from '..';

/**
 * Single checkbox allowing user to confirm that they have permission to submit.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ApprovalConfirmationStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit, canUserEditForm } = useStepForm();
  const { project, projectStatusCompleted, getStatusByCode, currentStatus } = useStepper();
  let confirmation = false;
  if (currentStatus && projectStatusCompleted(getStatusByCode(DisposeWorkflowStatus.Approval))) {
    confirmation = true;
  }
  const initialValues = { ...project, confirmation };
  return currentStatus ? (
    <Container fluid className="ApprovalConfirmationStep">
      <Formik
        initialValues={initialValues}
        validationSchema={ApprovalConfirmationStepSchema}
        innerRef={formikRef}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        <Form>
          <ApprovalConfirmationForm isReadOnly={isReadOnly || !canUserEditForm(project.agencyId)} />
          <StepErrorSummary />
        </Form>
      </Formik>
    </Container>
  ) : null;
};

export default ApprovalConfirmationStep;
