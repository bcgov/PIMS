import React, { useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import {
  IStepProps,
  useStepper,
  useStepForm,
  IProject,
  ReviewApproveActions,
  ReviewApproveForm,
} from '..';
import { Formik } from 'formik';
import {
  UpdateInfoStepYupSchema,
  ProjectDraftStepYupSchema,
  SelectProjectPropertiesStepYupSchema,
} from '../forms/disposalYupSchema';
import { fetchProjectTasks } from '../projectsActionCreator';

interface IReviewApproveFields {
  appraisalOrdered: boolean;
  appraisalReceived: boolean;
  reviewCompleted: boolean;
  strengthOfClaim: boolean;
  inConsultation: boolean;
  agreementReached: boolean;
  draftReviewed: boolean;
  infoReviewed: boolean;
  documentationReviewed: boolean;
  statusCode: string;
}

/**
 * Expanded version of the ReviewProjectStep allowing for application review.
 * {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ReviewApproveStep = ({ formikRef }: IStepProps) => {
  const { project } = useStepper();
  const { onSubmitReview, canUserEditForm } = useStepForm();
  useEffect(() => {
    fetchProjectTasks('ACCESS-DISPOSAL');
  }, []);

  const initialValues: IProject & IReviewApproveFields = {
    ...project,
    confirmation: true,
    draftReviewed: false,
    infoReviewed: false,
    documentationReviewed: false,
  };
  return (
    <Container fluid className="ReviewApproveStep">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={onSubmitReview}
        validationSchema={ProjectDraftStepYupSchema.concat(UpdateInfoStepYupSchema).concat(
          SelectProjectPropertiesStepYupSchema,
        )}
      >
        {({ submitForm, values, setFieldValue }) => (
          <Form>
            <h1>Project Application Review</h1>
            <ReviewApproveForm canEdit={canUserEditForm(project.agencyId)} />
            <ReviewApproveActions />
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ReviewApproveStep;
