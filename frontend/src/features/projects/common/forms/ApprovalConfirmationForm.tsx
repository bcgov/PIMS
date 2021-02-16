import React, { Fragment } from 'react';
import { Form } from 'react-bootstrap';
import { IStepProps } from '../interfaces';
import { Check } from 'components/common/form/Check';

/**
 * Form component of ApprovalConfirmationForm.
 * @param param0 isReadOnly disable editing
 */
const ApprovalConfirmationForm = ({ isReadOnly }: IStepProps) => {
  const fieldName = 'confirmation';
  const label = `My Ministry/Agency has received approval to request the property be submitted to the Enhanced Referral Program and marketed internally to other Ministry 
  and Broader Public Sector Agencies for 90 days before listing the property to be sold on the public commercial real estate market`;
  return (
    <Fragment>
      <h3>Approval</h3>
      <Form.Row>
        <Check field={fieldName} postLabel={label} required disabled={isReadOnly} />
      </Form.Row>
    </Fragment>
  );
};

export default ApprovalConfirmationForm;
