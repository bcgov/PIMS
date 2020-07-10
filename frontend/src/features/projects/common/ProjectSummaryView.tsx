import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { ReviewProjectForm } from '../dispose';
import { useStepForm, StepStatusIcon, ProjectNotes, useProject } from '.';
import { Formik } from 'formik';
import './ProjectSummaryView.scss';
import { StepActions } from '../dispose/components/StepActions';
import { noop } from 'lodash';
import StepErrorSummary from './components/StepErrorSummary';
import { IStepProps } from './interfaces';
import { PublicNotes } from './components/ProjectNotes';

/**
 * Read only version of all step components. Allows notes field to be edited
 */
const ProjectSummaryView = ({ formikRef }: IStepProps) => {
  const { project } = useProject();
  const { onSubmitReview, noFetchingProjectRequests } = useStepForm();
  const initialValues = { ...project, confirmation: true };
  return (
    <Container fluid className="ProjectSummaryView">
      <StepStatusIcon approvedOn={project.approvedOn} status={project.status} />
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={(values, actions) => onSubmitReview(values, formikRef)}
      >
        {formikProps => (
          <Form>
            <ReviewProjectForm canEdit={false} />
            <ProjectNotes disabled={!project.status?.isActive} />
            <PublicNotes disabled={!project.status?.isActive} />
            <StepErrorSummary />
            <StepActions
              onSave={() => formikProps.submitForm()}
              onNext={noop}
              nextDisabled={true}
              saveDisabled={!project.status?.isActive}
              isFetching={!noFetchingProjectRequests}
            />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ProjectSummaryView;
