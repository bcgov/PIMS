import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { IStepProps, useStepper, useStepForm, ReviewProjectForm } from '..';
import { Formik } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
} from '../forms/disposalYupSchema';
/**
 * Read only version of all step components. TODO: provide ability to update fields on this form.
 * {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ReviewProjectStep = ({ formikRef }: IStepProps) => {
  const { project } = useStepper();
  const { onSubmit } = useStepForm();
  const initialValues = { ...project, confirmation: true };
  return (
    <Container fluid className="ReviewProjectStep">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={onSubmit}
        validationSchema={ProjectDraftStepYupSchema.concat(UpdateInfoStepYupSchema).concat(
          SelectProjectPropertiesStepYupSchema,
        )}
      >
        <Form>
          <ReviewProjectForm />
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewProjectStep;
