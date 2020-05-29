import React from 'react';
import { Formik } from 'formik';
import { Form, Container } from 'react-bootstrap';
import { IStepProps } from '../interfaces';
import useStepForm from './useStepForm';
import useStepper from '../hooks/useStepper';
import ApprovalConfirmationForm from '../forms/ApprovalConfirmationForm';

/**
 * Single checkbox allowing user to confirm that they have permission to submit.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ApprovalConfirmationStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
  const initialValues = { ...project, confirmation: false };
  return (
    <Container fluid className="ApprovalConfirmationStep">
      <Formik initialValues={initialValues} innerRef={formikRef} onSubmit={onSubmit}>
        <Form>
          <ApprovalConfirmationForm isReadOnly={isReadOnly} />
        </Form>
      </Formik>
    </Container>
  );
};

export default ApprovalConfirmationStep;
