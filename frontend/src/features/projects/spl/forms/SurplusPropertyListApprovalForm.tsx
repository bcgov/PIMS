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
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="requestForSplReceivedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Addition Approved
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="approvedForSplOn"
        />
      </Form.Row>
    </Container>
  );
};

export default SurplusPropertyListApprovalForm;
