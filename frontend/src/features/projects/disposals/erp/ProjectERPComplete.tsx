import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';
import { ProjectNote } from '../notes';
import { IProjectForm } from '../interfaces';
import * as styled from './styled';
import { Col, Row } from 'components/flex';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';

export const ProjectERPComplete: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();
  const { values } = formik;
  const { workflowCode, statusCode } = values;

  const eRequestForSplReceived =
    !!values.clearanceNotificationSentOn || !!values.requestForSplReceivedOn;
  const eApprovedForSpl = !!values.requestForSplReceivedOn || !!values.approvedForSplOn;
  const showTransferredWithinGRE =
    (workflowCode === Workflow.ERP ||
      workflowCode === Workflow.ASSESS_EXEMPTION ||
      workflowCode === Workflow.ASSESS_EX_DISPOSAL) &&
    statusCode !== WorkflowStatus.NotInSpl;

  return (
    <styled.ProjectERPComplete>
      <h2>Enhanced Referral Process Complete</h2>
      <Row>
        <Col flex="1">
          <FastDatePicker
            label="Interest Received On"
            field="interestedReceivedOn"
            formikProps={formik}
            size="sm"
          />
          <ProjectNote label="Interest Notes" field="interestFromEnhancedReferralNote" />
        </Col>
        <Col flex="1">
          <FastDatePicker
            label="On Hold Notification Sent On"
            field="onHoldNotificationSentOn"
            formikProps={formik}
            size="sm"
          />
          {showTransferredWithinGRE && (
            <FastDatePicker
              label="Transferred within the GRE On"
              field="transferredWithinGreOn"
              formikProps={formik}
              size="sm"
            />
          )}
          <FastDatePicker
            label="Clearance Notification Sent On"
            field="clearanceNotificationSentOn"
            formikProps={formik}
            size="sm"
          />
          <FastDatePicker
            label="Request for SPL Received On"
            field="requestForSplReceivedOn"
            formikProps={formik}
            disabled={!eRequestForSplReceived}
            size="sm"
          />
          <FastDatePicker
            label="SPL Addition Approved On"
            field="approvedForSplOn"
            formikProps={formik}
            disabled={!eApprovedForSpl}
            size="sm"
          />
        </Col>
      </Row>
    </styled.ProjectERPComplete>
  );
};
