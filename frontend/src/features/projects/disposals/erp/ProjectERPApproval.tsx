import { FastDatePicker } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import { ErpNotificationNote } from '../notes';
import { AgencyInterest } from '.';
import * as styled from './styled';

export const ProjectERPApproval: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();

  // Disabled prop
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;
  const keycloak = useKeycloakWrapper();
  const [disabled, setDisabled] = useState(false);
  const isAdmin = keycloak.hasClaim(Claim.ReportsSplAdmin);

  useEffect(() => {
    setDisabled(
      [
        WorkflowStatus.Disposed,
        WorkflowStatus.Cancelled,
        WorkflowStatus.TransferredGRE,
        WorkflowStatus.Denied,
      ].includes(statusCode) && !isAdmin,
    );
  }, [isAdmin, workflowCode, statusCode]);

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
