import React, { Fragment } from 'react';
import { Form } from 'react-bootstrap';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import { IStepProps } from '../interfaces';
import { Check } from 'components/common/form/Check';

/**
 * Form component of ApprovalConfirmationForm.
 * @param param0 isReadOnly disable editing
 */
const ApprovalConfirmationForm = ({ isReadOnly }: IStepProps) => {
  const userDisplayName = useKeycloakWrapper().displayName || 'Pims User';
  const fieldName = 'confirmation';
  const label = `I, ${userDisplayName}, confirm by checking this box that I have received the approval 
  to request the property be submitted to the Enhanced Referral Program and marketed internally to other Ministry 
  and Broader Public Sector Agencies for 90 days before listing the property to be sold on the public commercial real estate market`;
  return (
    <Fragment>
      <h3>Approval</h3>
      <Form.Row>
        <Check outerClassName="col-md-1" field={fieldName} />
        <Form.Label column md={11}>
          {label}
        </Form.Label>
      </Form.Row>
    </Fragment>
  );
};

export default ApprovalConfirmationForm;
