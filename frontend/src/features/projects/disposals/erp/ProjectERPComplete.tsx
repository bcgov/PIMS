import { FastDatePicker } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';
import { ProjectNote } from '../notes';
import { IProjectForm } from '../interfaces';
import * as styled from './styled';
import { Col, Row } from 'components/flex';
import { Workflow, WorkflowStatus } from 'hooks/api/projects';

export interface IProjectERPCompleteProps {
  disabled?: boolean;
}

export const ProjectERPComplete: React.FC<IProjectERPCompleteProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();
  const { values, setFieldTouched } = formik;
  const { workflowCode, statusCode } = values;

  const eRequestForSplReceived =
    !!values.clearanceNotificationSentOn || !!values.requestForSplReceivedOn;
  const eApprovedForSpl = !!values.requestForSplReceivedOn || !!values.approvedForSplOn;
  const showTransferredWithinGRE =
    [Workflow.ERP, Workflow.ASSESS_EXEMPTION, Workflow.ASSESS_EX_DISPOSAL].includes(
      workflowCode as Workflow,
    ) && statusCode !== WorkflowStatus.NotInSpl;

  React.useEffect(() => {
    setFieldTouched('removalFromSplRequestOn');
    setFieldTouched('removalFromSplApprovedOn');
    setFieldTouched('removalFromSplRationale');
  }, [setFieldTouched]);

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
