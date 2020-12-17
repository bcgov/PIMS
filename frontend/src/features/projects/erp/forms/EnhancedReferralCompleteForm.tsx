import './EnhancedReferralCompleteForm.scss';
import React, { useState } from 'react';
import { Container, Button, Col } from 'react-bootstrap';
import { Form, FastDatePicker } from 'components/common/form';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import TooltipIcon from 'components/common/TooltipIcon';
import {
  ReviewWorkflowStatus,
  IProject,
  onTransferredWithinTheGreTooltip,
  onHoldNotificationTooltip,
  clearanceNotifictionSent,
  proceedToSplWarning,
  notInSplWarning,
  requestForSplReceivedOn,
  approvedForSplOn,
  ProjectNotes,
} from '../../common';
import GenericModal from 'components/common/GenericModal';
import { validateFormikWithCallback } from 'utils';

const OrText = styled.div`
  margin: 0.75rem 2rem 0.75rem 2rem;
`;

interface IEnhancedReferralCompleteFormProps {
  isReadOnly?: boolean;
  onClickOnHold: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickGreTransferred: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickProceedToSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickNotInSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Form component of EnhancedReferralCompleteForm. TODO: add button click functionality.
 * @param param0 isReadOnly disable editing
 */
const EnhancedReferralCompleteForm = ({
  isReadOnly,
  onClickOnHold,
  onClickGreTransferred,
  onClickProceedToSpl,
  onClickNotInSpl,
}: IEnhancedReferralCompleteFormProps) => {
  const formikProps = useFormikContext<IProject>();
  const [proceedToSpl, setProceedToSpl] = useState(false);
  const [notInSpl, setNotInSpl] = useState(false);
  return (
    <Container fluid className="EnhancedReferralCompleteForm">
      <h3>Enhanced Referral Process Complete</h3>
      <Form.Row>
        <Form.Label column md={4}>
          Interest Received On
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="interestedReceivedOn"
        />
      </Form.Row>
      <Form.Row>
        <Col>
          <ProjectNotes
            field="interestFromEnhancedReferralNote"
            label="Interest Note"
            disabled={isReadOnly}
            outerClassName="col"
          />
        </Col>
      </Form.Row>

      <Form.Row>
        <Form.Label column md={4}>
          On Hold Notification Sent{' '}
          <TooltipIcon toolTipId="onHoldTooltip" toolTip={onHoldNotificationTooltip} />
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="onHoldNotificationSentOn"
        />
        {formikProps.values.statusCode === ReviewWorkflowStatus.InErp && (
          <div className="col-md-6">
            <Button
              disabled={isReadOnly || !formikProps.values.onHoldNotificationSentOn}
              onClick={onClickOnHold}
            >
              Place Project On Hold
            </Button>
          </div>
        )}
      </Form.Row>
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
          disabled={isReadOnly}
          field="transferredWithinGreOn"
        />
        {(formikProps.values.statusCode === ReviewWorkflowStatus.InErp ||
          formikProps.values.statusCode === ReviewWorkflowStatus.OnHold) && (
          <div className="col-md-6">
            <Button
              disabled={isReadOnly || !formikProps.values.transferredWithinGreOn}
              onClick={onClickGreTransferred}
            >
              Update Property Information
            </Button>
          </div>
        )}
      </Form.Row>
      <OrText>OR</OrText>
      <Form.Row>
        <Form.Label column md={4}>
          Clearance Notification Sent
          <TooltipIcon toolTipId="clearanceNotificationSent" toolTip={clearanceNotifictionSent} />
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="clearanceNotificationSentOn"
        />
      </Form.Row>
      {formikProps.values.workflowCode === 'ERP' && (
        <>
          <Form.Row>
            <Form.Label column md={4}>
              Request for SPL Received On
              <TooltipIcon toolTipId="requestForSplReceivedOn" toolTip={requestForSplReceivedOn} />
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
              <TooltipIcon toolTipId="approvedForSplOn" toolTip={approvedForSplOn} />
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-2"
              formikProps={formikProps}
              disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
              field="approvedForSplOn"
            />
            {(formikProps.values.statusCode === ReviewWorkflowStatus.ApprovedForErp ||
              formikProps.values.statusCode === ReviewWorkflowStatus.InErp ||
              formikProps.values.statusCode === ReviewWorkflowStatus.OnHold ||
              formikProps.values.statusCode === ReviewWorkflowStatus.ApprovedForExemption ||
              formikProps.values.statusCode === ReviewWorkflowStatus.NotInSpl) && (
              <div className="col-md-6" style={{ display: 'flex' }}>
                <Button
                  disabled={
                    isReadOnly ||
                    !formikProps.values.clearanceNotificationSentOn ||
                    !formikProps.values.requestForSplReceivedOn ||
                    !formikProps.values.approvedForSplOn
                  }
                  onClick={() =>
                    validateFormikWithCallback(formikProps, () => setProceedToSpl(true))
                  }
                >
                  Proceed to SPL
                </Button>
                {formikProps.values.statusCode !== ReviewWorkflowStatus.NotInSpl && (
                  <>
                    <OrText>OR</OrText>
                    <Button
                      disabled={isReadOnly || !formikProps.values.clearanceNotificationSentOn}
                      onClick={() =>
                        validateFormikWithCallback(formikProps, () => setNotInSpl(true))
                      }
                    >
                      Not Included in the SPL
                    </Button>
                  </>
                )}
              </div>
            )}
            {notInSpl && (
              <GenericModal
                display={notInSpl}
                cancelButtonText="Close"
                okButtonText="Yes"
                handleOk={(e: any) => {
                  onClickNotInSpl(e);
                  setNotInSpl(false);
                }}
                handleCancel={() => {
                  setNotInSpl(false);
                }}
                title="Really Not in SPL?"
                message={notInSplWarning}
              />
            )}
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
        </>
      )}
    </Container>
  );
};

export default EnhancedReferralCompleteForm;
