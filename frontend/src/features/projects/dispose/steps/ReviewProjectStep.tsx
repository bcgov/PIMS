import { erpExemptionSchema } from 'features/projects/disposals/validation';
import { IStepProps } from 'features/projects/interfaces';
import { Formik } from 'formik';
import React from 'react';
import { Container, Form } from 'react-bootstrap';

import { ProjectNotes, PublicNotes, useStepForm } from '../../common';
import { ReviewProjectForm, useStepper } from '..';
import {
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
  UpdateInfoStepYupSchema,
} from '../forms/disposalYupSchema';
/**
 * Read only version of all step components. TODO: provide ability to update fields on this form.
 * {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ReviewProjectStep = ({ formikRef }: IStepProps) => {
  const { project } = useStepper();
  const { onSubmit, canUserEditForm, canUserSubmitForm } = useStepForm();
  const initialValues = { ...project, confirmation: true };
  const canEdit = canUserEditForm(project.agencyId);
  const canSubmit = canUserSubmitForm();
  return (
    <Container fluid className="ReviewProjectStep">
      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validationSchema={ProjectDraftStepYupSchema.concat(UpdateInfoStepYupSchema)
          .concat(SelectProjectPropertiesStepYupSchema)
          .concat(erpExemptionSchema)}
      >
        <Form>
          <ReviewProjectForm canEdit={canEdit} />
          <ProjectNotes className="col-md-auto" disabled={true} />
          <PublicNotes className="col-md-auto" disabled={!canEdit} />
          {canSubmit ? (
            <Form.Label style={{ float: 'right' }}>
              Apply to the Surplus Property Program
            </Form.Label>
          ) : (
            <Form.Label style={{ float: 'right' }}>
              Please contact your PIMS Real Estate Manager to submit the project on your behalf
            </Form.Label>
          )}
        </Form>
      </Formik>
    </Container>
  );
};

export default ReviewProjectStep;
