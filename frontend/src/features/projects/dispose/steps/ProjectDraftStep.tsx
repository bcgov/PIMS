import React from 'react';
import { Container } from 'react-bootstrap';
import { Formik } from 'formik';
import { Form } from 'components/common/form';
import { IStepProps, initialValues } from '../../common/interfaces';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { ProjectDraftStepYupSchema, useStepper } from '..';

import { useStepForm, ProjectDraftForm, StepErrorSummary } from '../../common';
import ProjectNotes from '../../common/components/ProjectNotes';

/**
 * Initial Project creation step - allows entry of high level project information.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ProjectDraftStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const { onSubmit, canUserEditForm } = useStepForm();
  const { project } = useStepper();
  const keycloak = useKeycloakWrapper();
  let draftFormValues = undefined;
  if (project) {
    draftFormValues = { ...project };
  } else {
    //This appears to be a new project, set up some defaults.
    draftFormValues = { ...initialValues, agencyId: keycloak.agencyId! };
  }
  const isPreDraft = () => {
    return project.agencyId === 0;
  };
  return (
    <Container fluid>
      <Formik
        initialValues={draftFormValues}
        validationSchema={ProjectDraftStepYupSchema}
        innerRef={formikRef}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {() => (
          <Form className="ProjectDraftForm">
            <ProjectDraftForm
              isReadOnly={isPreDraft() ? false : isReadOnly || !canUserEditForm(project.agencyId)}
            />
            <ProjectNotes className="col-md-auto" />
            <StepErrorSummary />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ProjectDraftStep;
