import './AgencyResponseForm.scss';
import React from 'react';
import { Col, Container } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { IProject } from '../../common';
import { AgencyInterest } from './AgencyInterest';
import { ErpNotificationNotes } from 'features/projects/common/components/ProjectNotes';

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
        <Col>
          <Form.Row>
            <Form.Label>
              <strong>Note: </strong>Changing the dates on these fields does not change the date the
              notifications are sent from the Common Hosted Email Service (CHES), which is managed
              by the Exchange Lab.
            </Form.Label>
            <Form.Label>
              The only way to stop future unsent notifications is to cancel the entire project.
              <br />
              You can, however, cancel future notifications for specific ministries by setting the
              response as 'Not Interested'.
            </Form.Label>
          </Form.Row>
        </Col>
      </Form.Row>
      <ErpNotificationNotes
        disabled={true}
        label="Text added to ERP Notification Emails"
        tooltip="The contents of this note were included in the email notifications for this project."
        outerClassName="col-md-12 reviewRequired"
        className="col-md-8"
      />
      <AgencyInterest disabled={isReadOnly} />
    </Container>
  );
};

export default AgencyResponseForm;
