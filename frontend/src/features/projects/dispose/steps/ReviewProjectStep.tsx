import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { useStepForm, IStepProps, ProjectNotes, PublicNotes } from '../../common';
import { useStepper, ReviewProjectForm } from '..';
import { Formik } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
  EnhancedReferralExemptionSchema,
} from '../forms/disposalYupSchema';
/**
 * Read only version of all step components. TODO: provide ability to update fields on this form.
 * {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ReviewProjectStep = ({ formikRef }: IStepProps) => {
  const { project } = useStepper();
  const { onSubmit, canUserEditForm } = useStepForm();
  const initialValues = { ...project, confirmation: true };
  const canEdit = canUserEditForm(project.agencyId);
  return (
    <Container fluid className="ReviewProjectStep">
      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validationSchema={ProjectDraftStepYupSchema.concat(UpdateInfoStepYupSchema)
          .concat(SelectProjectPropertiesStepYupSchema)
          .concat(EnhancedReferralExemptionSchema)}
      >
        <Form>
          <ReviewProjectForm canEdit={canEdit} />
          <ProjectNotes disabled={true} />
          <PublicNotes disabled={!canEdit} />
          {canEdit && (
            <Form.Label style={{ float: 'right' }}>
              Apply to the Surplus Property Program
            </Form.Label>
          )}
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewProjectStep;
