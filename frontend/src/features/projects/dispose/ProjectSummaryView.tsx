import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { useStepper, useStepForm, ReviewProjectForm, StepStatusIcon } from '.';
import { Formik } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
} from './forms/disposalYupSchema';
import './ProjectSummaryView.scss';
import { StepActions } from './components/StepActions';
import { noop } from 'lodash';
import StepErrorSummary from './steps/StepErrorSummary';

/**
 * Read only version of all step components. Allows notes field to be edited
 */
const ProjectSummaryView = () => {
  const { project } = useStepper();
  const { onSubmitReview } = useStepForm();
  const initialValues = { ...project, confirmation: true };
  return (
    <Container fluid className="ProjectSummaryView">
      <StepStatusIcon approvedOn={project.approvedOn} status={project.status} />
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, actions) => onSubmitReview(values, actions)}
        validationSchema={ProjectDraftStepYupSchema.concat(UpdateInfoStepYupSchema).concat(
          SelectProjectPropertiesStepYupSchema,
        )}
      >
        {formikProps => (
          <Form>
            <ReviewProjectForm canEdit={false} />
            <StepErrorSummary />
            <StepActions
              onSave={() => formikProps.submitForm()}
              onNext={noop}
              nextDisabled={true}
              isFetching={formikProps.isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ProjectSummaryView;
