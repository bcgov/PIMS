import React from 'react';
import { Container } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';
import { IStepProps } from '../interfaces';
import {
  useStepForm,
  useStepper,
  UpdateInfoStepYupSchema,
  UpdateInfoForm,
  StepErrorSummary,
  ProjectNotes,
} from '..';

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
        enableReinitialize
        initialValues={project}
        validationSchema={UpdateInfoStepYupSchema}
        innerRef={formikRef}
        onSubmit={onSubmit}
      >
        <Form>
          <UpdateInfoForm
            isReadOnly={isReadOnly || !canUserEditForm(project.agencyId)}
            title="Update Info"
          />
          <ProjectNotes />
          <StepErrorSummary />
        </Form>
      </Formik>
    </Container>
  );
};

export default UpdateInfoStep;
