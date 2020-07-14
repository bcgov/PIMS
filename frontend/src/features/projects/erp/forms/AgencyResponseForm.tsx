import './AgencyResponseForm.scss';
import React from 'react';
import { Container } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import { FormikTable } from '../../common';
import { getProjectAgencyResponseColumns } from 'features/projects/common/components/columns';

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
      <h3>Agency Interest</h3>
      <FormikTable
        columns={getProjectAgencyResponseColumns({ offerAmount: false, disabled: isReadOnly })}
        name="ProjectAgencyResponses"
        field="projectAgencyResponses"
      />
    </Container>
  );
};

export default AgencyResponseForm;
