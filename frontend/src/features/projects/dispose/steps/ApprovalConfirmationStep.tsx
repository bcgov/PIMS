import React from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { IStepProps } from '../interfaces';
import useStepForm from './useStepForm';
import useStepper from '../hooks/useStepper';
import { Check } from 'components/common/form/Check';

/**
 * Single checkbox allowing user to confirm that they have permission to submit.
 * @param param0 {isReadOnly formikRef} formikRef allow remote formik access, isReadOnly toggle to prevent updates.
 */
const ApprovalConfirmationStep = ({ isReadOnly, formikRef }: IStepProps) => {
  const userDisplayName = useKeycloakWrapper().displayName || 'Pims User';
  const fieldName = 'confirmation';
  const label = `I, ${userDisplayName}, confirm by checking this box that I have received the approval 
  to request the property be submitted to the Enhanced Referral Program and marketed internally to other Ministry 
  and Broader Public Sector Agencies for 90 days before listing the property to be sold on the public commercial real estate market`;
  const { onSubmit } = useStepForm();
  const { project } = useStepper();
  const initialValues = { ...project, confirmation: false };
  return (
    <Formik initialValues={initialValues} innerRef={formikRef} onSubmit={onSubmit}>
      {formikProps => (
        <>
          <Form>
            <h3>Approval</h3>
            <Form.Row>
              <Check outerClassName="col-md-1" field={fieldName} />
              <Form.Label column md={11}>
                {label}
              </Form.Label>
            </Form.Row>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default ApprovalConfirmationStep;
