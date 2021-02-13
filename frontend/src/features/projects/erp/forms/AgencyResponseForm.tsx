import './AgencyResponseForm.scss';
import React from 'react';
import { Col, Container } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { IProject } from '../../common';
import { AgencyInterest } from './AgencyInterest';

interface IAgencyResponseFormProps {
  isReadOnly?: boolean;
}

export interface IAgencyResponseColumns {
  offerAmount?: boolean;
  disabled?: boolean;
}

/**
 * Form component of AgencyResponseForm.
 * @param param0 isReadOnly disable editing
 */
const AgencyResponseForm = ({ isReadOnly }: IAgencyResponseFormProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Container fluid className="AgencyResponseForm">
      <Form.Row>
        <Col>
          <Form.Row>
            <Form.Label column md={8}>
              Date of Initial Enhanced Referral Notification Sent
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-4"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="initialNotificationSentOn"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={8}>
              Date of 30 Day Enhanced Referral Notification Sent
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-4"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="thirtyDayNotificationSentOn"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={8}>
              Date of 60 Day Enhanced Referral Notification Sent
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-4"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="sixtyDayNotificationSentOn"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={8}>
              Date of 90 Day Enhanced Referral Notification Sent
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-4"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="ninetyDayNotificationSentOn"
            />
          </Form.Row>
        </Col>
        <Col style={{ padding: '0 0 0 10px' }}>
          <Form.Label>
            <strong>Note: </strong>Changing the dates on these fields does not change the date the
            notifications are sent from the Common Hosted Email Service (CHES), which is managed by
            the Exchange Lab.
          </Form.Label>
          <Form.Label>
            The only way to stop future unsent notifications is to cancel the entire project.
          </Form.Label>
        </Col>
      </Form.Row>
      <AgencyInterest />
    </Container>
  );
};

export default AgencyResponseForm;
