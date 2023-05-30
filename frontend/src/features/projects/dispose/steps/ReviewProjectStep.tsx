import { IStepProps } from 'features/projects/interfaces';
import { Formik } from 'formik';
import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { zodToFormikErrors } from 'utils';
import { z, ZodError } from 'zod';

import { ProjectNotes, PublicNotes, useStepForm } from '../../common';
import { ReviewProjectForm, useStepper } from '..';
import {
  ProjectDraftStepZodSchema,
  SelectProjectPropertiesStepZodSchema,
  UpdateInfoStepZodSchema,
} from '../forms/disposalZodSchema';

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
  const validationSchema = z
    .object({
      ...ProjectDraftStepZodSchema.shape,
      ...UpdateInfoStepZodSchema.shape,
      ...SelectProjectPropertiesStepZodSchema.shape,
      exemptionRationale: z.string().optional(),
      exemptionRequested: z.boolean(),
    })
    .refine((data) => !(data.exemptionRequested && !data.exemptionRationale), {
      message: 'Rationale is required when applying for an exemption.',
      path: ['exemptionRationale'],
    });

  return (
    <Container fluid className="ReviewProjectStep">
      <Formik
        initialValues={initialValues}
        innerRef={formikRef}
        onSubmit={onSubmit}
        enableReinitialize={true}
        validate={(values) => {
          try {
            validationSchema.parse(values);
          } catch (errors) {
            return zodToFormikErrors(errors as ZodError);
          }
        }}
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
