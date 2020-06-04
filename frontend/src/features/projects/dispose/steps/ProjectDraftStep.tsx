import React from 'react';
import { Container } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';
import { IStepProps, initialValues } from '../interfaces';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import {
  ProjectDraftStepYupSchema,
  useStepForm,
  useStepper,
  ProjectDraftForm,
  StepErrorSummary,
} from '..';

/**
 * Initial Project creation step - allows entry of high level project information.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ProjectDraftStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
  const keycloak = useKeycloakWrapper();
  let draftFormValues = initialValues;
  if (project) {
    draftFormValues = { ...project };
  } else {
    //This appears to be a new project, set up some defaults.
    draftFormValues = { ...initialValues, agencyId: keycloak.agencyId! };
  }

  return (
    <Container fluid>
      <Formik
        initialValues={draftFormValues}
        validationSchema={ProjectDraftStepYupSchema}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={onSubmit}
      >
        {() => (
          <Form className="ProjectDraftForm">
            <ProjectDraftForm isReadOnly={isReadOnly} />
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ProjectDraftStep;
