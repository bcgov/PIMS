import { Form } from 'components/common/form';
import { Formik } from 'formik';
import React from 'react';
import { Container } from 'react-bootstrap';
import { zodToFormikErrors } from 'utils';
import { ZodError } from 'zod';

import { ProjectNotes, StepErrorSummary, UpdateInfoForm, useStepForm } from '../../common';
import { IStepProps } from '../../interfaces';
import { UpdateInfoStepZodSchema, useStepper } from '..';

/**
 * Update property information already associated to this project on a property list view.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const UpdateInfoStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit, canUserEditForm } = useStepForm();
  const { project } = useStepper();
  if (!project) {
    // Step does not allow creation of new properties
    throw Error('Unexpected error updating project. Please reload your project.');
  }

  return (
    <Container fluid>
      <Formik
        initialValues={project}
        validate={(values) => {
          try {
            UpdateInfoStepZodSchema.parse(values);
          } catch (errors) {
            return zodToFormikErrors(errors as ZodError);
          }
        }}
        validateOnBlur={true}
        validateOnChange={false}
        innerRef={formikRef}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        <Form>
          <UpdateInfoForm
            isReadOnly={isReadOnly || !canUserEditForm(project.agencyId)}
            title="Project Information"
          />
          <ProjectNotes className="col-md-auto" />
          <StepErrorSummary />
        </Form>
      </Formik>
    </Container>
  );
};

export default UpdateInfoStep;
