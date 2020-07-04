import './AgencyResponseForm.scss';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { ProjectNotes, agencyResponsesNoteTooltip } from '../../common';

interface IAgencyResponseFormProps {
  isReadOnly?: boolean;
}

/**
 * Form component of AgencyResponseForm.
 * @param param0 isReadOnly disable editing
 */
const AgencyResponseForm = ({ isReadOnly }: IAgencyResponseFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Container fluid className="AgencyResponseForm">
      <Form.Row>
        <Form.Label column md={4}>
          Date of Initial Enhanced Referral Notification Sent
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-8"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="initialNotificationSentOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={4}>
          Date of 30 Day Enhanced Referral Notification Sent
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-8"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="thirtyDayNotificationSentOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={4}>
          Date of 60 Day Enhanced Referral Notification Sent
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-8"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="sixtyDayNotificationSentOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={4}>
          Date of 90 Day Enhanced Referral Notification Sent
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-8"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="ninetyDayNotificationSentOn"
        />
      </Form.Row>
      <ProjectNotes
        field="agencyResponseNote"
        label="Agency Responses"
        outerClassName="col-md-12"
        tooltip={agencyResponsesNoteTooltip}
        disabled={isReadOnly}
      />
    </Container>
  );
};

export default AgencyResponseForm;
