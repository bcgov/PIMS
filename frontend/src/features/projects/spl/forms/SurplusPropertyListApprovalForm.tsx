import React from 'react';
import { Container } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';

interface ISurplusPropertyListApprovalFormProps {
  isReadOnly?: boolean;
}

/**
 * Surplus Properties List Approval Dates - allows for manual updates.
 * @param param0 isReadOnly disable editing
 */
const SurplusPropertyListApprovalForm = ({ isReadOnly }: ISurplusPropertyListApprovalFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Container fluid>
      <h3>Surplus Properties List Approval</h3>
      <Form.Row>
        <Form.Label column md={3}>
          Request for Addition to SPL Received
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="submittedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Addition Approved
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="approvedOn"
        />
      </Form.Row>
    </Container>
  );
};

export default SurplusPropertyListApprovalForm;
