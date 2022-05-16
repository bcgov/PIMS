import { FastDatePicker } from 'components/common/form';
import { Row, Col } from 'components/flex';
import React from 'react';
import { useFormikContext } from 'formik';
import { IProjectForm } from '../interfaces';

import * as styled from './styled';
import { ErpNotificationNote } from '../notes';
import { AgencyInterest } from '.';

export interface IProjectERPApprovalProps {
  disabled?: boolean;
}

export const ProjectERPApproval: React.FC<IProjectERPApprovalProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectERPApproval>
      <h2>Notifications</h2>
      <Row>
        <Col flex="1">
          <Row>
            <Col flex="1">
              <FastDatePicker
                label="Initial Enhanced Referral Notification Sent On"
                field="initialNotificationSentOn"
                formikProps={formik}
                size="sm"
                disabled={disabled}
              />
              <FastDatePicker
                label="60 Day Enhanced Referral Notification Sent On"
                field="sixtyDayNotificationSentOn"
                formikProps={formik}
                size="sm"
                disabled={disabled}
              />
            </Col>
            <Col flex="1">
              <FastDatePicker
                label="30 Day Enhanced Referral Notification Sent On"
                field="thirtyDayNotificationSentOn"
                formikProps={formik}
                size="sm"
                disabled={disabled}
              />
              <FastDatePicker
                label="90 Day Enhanced Referral Notification Sent On"
                field="ninetyDayNotificationSentOn"
                formikProps={formik}
                size="sm"
                disabled={disabled}
              />
            </Col>
          </Row>
        </Col>
        <Col flex="1">
          <p>
            Changing the dates on these fields does not change the date the notifications are sent
            from the Common Hosted Email Service (CHES), which is managed by the Exchange Lab.
          </p>
          <ErpNotificationNote
            label="Text added to ERP Notification Emails"
            tooltip="The contents of this note were included in the email notifications for this project."
            disabled={disabled}
          />
        </Col>
        <Col>
          <p>
            The only way to stop future unsent notifications is to cancel the entire project. You
            can, however, cancel future notifications for specific ministries by setting the
            response as 'Not Interested'.
          </p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <AgencyInterest disabled={disabled} />
        </Col>
      </Row>
    </styled.ProjectERPApproval>
  );
};
