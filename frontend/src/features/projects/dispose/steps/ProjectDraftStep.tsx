import React from 'react';
import { Container } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';

import { IStepProps } from '../interfaces';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import useStepForm from './useStepForm';
import useStepper from '../hooks/useStepper';
import { initialValues } from 'pages/admin/access/constants/constants';
import StepErrorSummary from './StepErrorSummary';
import ProjectDraftForm from '../forms/ProjectDraftForm';

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
    <Container fluid className="ProjectDraftStep">
      <Formik
        initialValues={draftFormValues}
        validateOnChange={false}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <ProjectDraftForm isReadOnly={isReadOnly} />
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ProjectDraftStep;
