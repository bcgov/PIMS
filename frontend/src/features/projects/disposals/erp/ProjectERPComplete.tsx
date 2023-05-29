import { FastDatePicker } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { Claim } from 'hooks/api';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';
import { useKeycloakWrapper } from 'hooks/useKeycloakWrapper';
import React, { useEffect, useState } from 'react';

import { IProjectForm } from '../interfaces';
import { ProjectNote } from '../notes';
import * as styled from './styled';

export const ProjectERPComplete: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();
  const { setFieldTouched } = formik;
  const { values }: any = useFormikContext();
  const { workflowCode, statusCode } = values;

  const eRequestForSplReceived =
    !!values.clearanceNotificationSentOn || !!values.requestForSplReceivedOn;
  const eApprovedForSpl = !!values.requestForSplReceivedOn || !!values.approvedForSplOn;
  const showTransferredWithinGRE =
    [Workflow.ERP, Workflow.ASSESS_EXEMPTION, Workflow.ASSESS_EX_DISPOSAL].includes(
      workflowCode as Workflow,
    ) && statusCode !== WorkflowStatus.NotInSpl;

  useEffect(() => {
    setFieldTouched('removalFromSplRequestOn');
    setFieldTouched('removalFromSplApprovedOn');
    setFieldTouched('removalFromSplRationale');
  }, [setFieldTouched]);

  // Disabled prop
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
    <styled.ProjectERPComplete>
      <h2>Enhanced Referral Process Complete</h2>
      <Row>
        <Col flex="2">
          <FastDatePicker
            label="Interest Received On"
            field="interestedReceivedOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
          <ProjectNote
            label="Interest Notes"
            field="interestFromEnhancedReferralNote"
            disabled={disabled}
          />
        </Col>
        <Col flex="1">
          <FastDatePicker
            label="On Hold Notification Sent On"
            field="onHoldNotificationSentOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
          {showTransferredWithinGRE && (
            <FastDatePicker
              label="Transferred within the GRE On"
              field="transferredWithinGreOn"
              formikProps={formik}
              size="sm"
              disabled={disabled}
            />
          )}
          <FastDatePicker
            label="Clearance Notification Sent On"
            field="clearanceNotificationSentOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
          <FastDatePicker
            label="Request for SPL Received On"
            field="requestForSplReceivedOn"
            formikProps={formik}
            disabled={!eRequestForSplReceived || disabled}
            size="sm"
          />
          <FastDatePicker
            label="SPL Addition Approved On"
            field="approvedForSplOn"
            formikProps={formik}
            disabled={!eApprovedForSpl || disabled}
            size="sm"
          />
        </Col>
      </Row>
    </styled.ProjectERPComplete>
  );
};
