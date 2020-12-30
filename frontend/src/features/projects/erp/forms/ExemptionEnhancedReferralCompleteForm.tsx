import './EnhancedReferralCompleteForm.scss';
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import TooltipIcon from 'components/common/TooltipIcon';
import {
  ProjectNotes,
  IProject,
  onTransferredWithinTheGreTooltip,
  proceedToSplWarning,
} from '../../common';
import GenericModal from 'components/common/GenericModal';

const OrText = styled.div`
  margin: 0.75rem 2rem 0.75rem 2rem;
`;

interface IEnhancedReferralCompleteFormProps {
  isReadOnly?: boolean;
  onClickGreTransferred: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickProceedToSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickNotInSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickAddToErp: () => void;
}

const ExemptionEnhancedReferralCompleteForm = ({
  isReadOnly,
  onClickGreTransferred,
  onClickProceedToSpl,
  onClickNotInSpl,
  onClickAddToErp,
}: IEnhancedReferralCompleteFormProps) => {
  const formikProps = useFormikContext<IProject>();
  const [proceedToSpl, setProceedToSpl] = useState(false);

  const {
    setFieldValue,
    values: { clearanceNotificationSentOn },
  } = formikProps;

  // clear out GRE date when clearance notification date is empty
  useEffect(() => {
    if (!clearanceNotificationSentOn) {
      setFieldValue('transferredWithinGreOn', '');
    }
  }, [clearanceNotificationSentOn, setFieldValue]);

  return (
    <Container fluid className="EnhancedReferralCompleteForm">
      <ProjectNotes
        label="Exemption Rationale"
        field="exemptionRationale"
        disabled={true}
        className="col-md-auto"
        outerClassName="col-md-12"
      />
      <Form.Row>
        <Form.Label column md={4}>
          ADM Approved Exemption On
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          field="exemptionApprovedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={4}>
          Clearance Notification Sent
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="clearanceNotificationSentOn"
        />
      </Form.Row>
      <h3>Option 1: Transfer within the GRE</h3>

      <Form.Row>
        <Form.Label column md={4}>
          Date Transferred within the GRE
          <TooltipIcon
            toolTipId="onDateTransferredWithinGre"
            toolTip={onTransferredWithinTheGreTooltip}
          />
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
          field="transferredWithinGreOn"
        />
        <div className="col-md-6">
          <Button
            disabled={
              isReadOnly ||
              !formikProps.values.clearanceNotificationSentOn ||
              !formikProps.values.transferredWithinGreOn
            }
            onClick={onClickGreTransferred}
          >
            Update Property Information
          </Button>
        </div>
      </Form.Row>
      <h3>Option 2: Proceed to Surplus Properties List</h3>
      <Form.Row>
        <Form.Label column md={4}>
          Request Received On
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
          field="requestForSplReceivedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={4}>
          SPL Addition Approved On
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
          field="approvedForSplOn"
        />
        <div className="justify-content-center">
          <Button
            disabled={
              isReadOnly ||
              !formikProps.values.clearanceNotificationSentOn ||
              !formikProps.values.requestForSplReceivedOn ||
              !formikProps.values.approvedForSplOn
            }
            onClick={() => setProceedToSpl(true)}
          >
            Proceed to SPL
          </Button>
          <OrText>OR</OrText>
          <Button
            disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
            onClick={onClickNotInSpl}
          >
            Not Included in the SPL
          </Button>
        </div>
        {proceedToSpl && (
          <GenericModal
            display={proceedToSpl}
            cancelButtonText="Close"
            okButtonText="Proceed to SPL"
            handleOk={(e: any) => {
              onClickProceedToSpl(e);
              setProceedToSpl(false);
            }}
            handleCancel={() => {
              setProceedToSpl(false);
            }}
            title="Really Proceed to SPL?"
            message={proceedToSplWarning}
          />
        )}
      </Form.Row>
      <h3>Option 3: Add to Enhanced Referral Process</h3>
      <Form.Row>
        <div className="justify-content-center add-space-below">
          <Button
            disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
            onClick={() => onClickAddToErp()}
          >
            Add to Enhanced Referral Process
          </Button>
        </div>
      </Form.Row>
    </Container>
  );
};

export default ExemptionEnhancedReferralCompleteForm;
