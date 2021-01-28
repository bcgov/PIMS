import React from 'react';
import { Container } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';
import { IStepProps } from '../../common/interfaces';
import { useStepper, UpdateInfoStepYupSchema } from '..';
import { useStepForm, ProjectNotes, UpdateInfoForm, StepErrorSummary } from '../../common';

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
        validationSchema={UpdateInfoStepYupSchema}
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
