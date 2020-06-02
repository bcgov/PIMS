import React from 'react';
import { Formik } from 'formik';
import { Form, Container } from 'react-bootstrap';
import { IStepProps } from '../interfaces';
import {
  useStepForm,
  useStepper,
  ApprovalConfirmationForm,
  StepErrorSummary,
  ApprovalConfirmationStepSchema,
} from '..';

/**
 * Single checkbox allowing user to confirm that they have permission to submit.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ApprovalConfirmationStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit } = useStepForm();
  const { project, projectStatusCompleted, currentStatus } = useStepper();
  let confirmation = false;
  if (currentStatus && projectStatusCompleted(currentStatus)) {
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
          <ApprovalConfirmationForm isReadOnly={isReadOnly} />
          <StepErrorSummary />
        </Form>
      </Formik>
    </Container>
  ) : null;
};

export default ApprovalConfirmationStep;
