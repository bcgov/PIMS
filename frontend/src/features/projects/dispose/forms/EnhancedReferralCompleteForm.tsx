import './EnhancedReferralCompleteForm.scss';
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import { ProjectNotes, IProject } from '..';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { noop } from 'lodash';

const OrText = styled.div`
  margin: 0.75rem 2rem 0.75rem 2rem;
`;

interface IEnhancedReferralCompleteFormProps {
  isReadOnly?: boolean;
  onClickOnHold: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Form component of EnhancedReferralCompleteForm. TODO: add button click functionality.
 * @param param0 isReadOnly disable editing
 */
const EnhancedReferralCompleteForm = ({
  isReadOnly,
  onClickOnHold,
}: IEnhancedReferralCompleteFormProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Container fluid className="EnhancedReferralCompleteForm">
      <h3>Enhanced Referral Process Complete</h3>
      <Form.Row>
        <Form.Label column md={4}>
          On Hold Notification Sent
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="onHoldNotificationSentOn"
        />
        <div className="col-md-6">
          <Button
            disabled={isReadOnly || !formikProps.values.onHoldNotificationSentOn}
            onClick={onClickOnHold}
          >
            Place Project On Hold
          </Button>
        </div>
      </Form.Row>
      <Form.Row>
        <Form.Label column md={4}>
          Date Transferred within the GRE
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="transferredWithinGreOn"
        />
        <div className="col-md-6">
          <Button disabled={isReadOnly} onClick={noop}>
            Update Property Information
          </Button>
        </div>
      </Form.Row>
      <OrText>OR</OrText>
      <Form.Row>
        <Form.Label column md={4}>
          Clearance Notification Sent
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="clearanceNotificationSentOn"
        />
        <div className="col-md-6" style={{ display: 'flex' }}>
          <Button disabled={isReadOnly} onClick={noop}>
            Proceed to SPL
          </Button>
          <OrText>OR</OrText>
          <Button disabled={isReadOnly} onClick={noop}>
            Not Included in the SPL
          </Button>
        </div>
      </Form.Row>
      <ProjectNotes outerClassName="col-md-12" disabled={isReadOnly} />
      <ProjectNotes
        outerClassName="col-md-12"
        tooltip="Visible to SRES only"
        label="Private Notes"
        field="privateNote"
        disabled={isReadOnly}
      />
    </Container>
  );
};

export default EnhancedReferralCompleteForm;
