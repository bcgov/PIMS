import './EnhancedReferralCompleteForm.scss';

import { FastCurrencyInput, FastDatePicker, FastInput, Form } from 'components/common/form';
import GenericModal, { ModalSize } from 'components/common/GenericModal';
import TooltipIcon from 'components/common/TooltipIcon';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Button, Col, Container } from 'react-bootstrap';
import styled from 'styled-components';
import { clearanceNotificationSentOnRequired, validateFormikWithCallback } from 'utils';

import {
  approvedForSplOn,
  clearanceNotifictionSent,
  disposeWarning,
  notInSplWarning,
  onHoldNotificationTooltip,
  onTransferredWithinTheGreTooltip,
  proceedToSplWarning,
  ProjectNotes,
  requestForSplReceivedOn,
} from '../../common';

const OrText = styled.div`
  margin: 0.75rem 2rem 0.75rem 2rem;
`;

interface IEnhancedReferralCompleteFormProps {
  isReadOnly?: boolean;
  onClickOnHold: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickInErp: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickGreTransferred: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickProceedToSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickNotInSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickDisposedExternally: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
  onClickDisposedExternally,
  onClickInErp,
}: IEnhancedReferralCompleteFormProps) => {
  const formikProps = useFormikContext<IProject>();
  const [proceedToSpl, setProceedToSpl] = useState(false);
  const [notInSpl, setNotInSpl] = useState(false);
  const [disposeExternally, setDisposeExternally] = useState(false);
  const isClearanceNotificationSentOnRequired =
    !formikProps.values.clearanceNotificationSentOn &&
    clearanceNotificationSentOnRequired(formikProps.values.status?.code ?? '');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <Container fluid className="EnhancedReferralCompleteForm">
      {showNotificationModal && (
        <GenericModal
          size={ModalSize.LARGE}
          message={
            <>
              <p>
                Are you sure you would like to change the status to <b>In ERP?</b>
              </p>
            </>
          }
          okButtonText="Yes"
          cancelButtonText="Close"
          handleCancel={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setShowNotificationModal(false);
          }}
          handleOk={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            onClickInErp(e);
            setShowNotificationModal(false);
          }}
        />
      )}

      {formikProps.values.statusCode === ReviewWorkflowStatus.NotInSpl && (
        <>
          <h3>Transition back to In ERP</h3>
          <Button disabled={isReadOnly} onClick={() => setShowNotificationModal(true)}>
            In ERP
          </Button>
        </>
      )}
      <h3>Enhanced Referral Process Complete</h3>
      <Form.Group>
        <Form.Label column md={4}>
          Interest Received On
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="interestedReceivedOn"
        />
      </Form.Group>
      <Form.Group>
        <Col>
          <ProjectNotes
            field="interestFromEnhancedReferralNote"
            label="Interest Note"
            disabled={isReadOnly}
            outerClassName="col"
          />
        </Col>
      </Form.Group>

      <Form.Group>
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
        {(formikProps.values.statusCode === ReviewWorkflowStatus.InErp ||
          formikProps.values.statusCode === ReviewWorkflowStatus.NotInSpl) && (
          <div className="col-md-6">
            <Button
              disabled={isReadOnly || !formikProps.values.onHoldNotificationSentOn}
              onClick={onClickOnHold}
            >
              Place Project On Hold
            </Button>
          </div>
        )}
      </Form.Group>
      <Form.Group>
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
          formikProps.values.statusCode === ReviewWorkflowStatus.OnHold ||
          formikProps.values.statusCode === ReviewWorkflowStatus.NotInSpl) && (
          <div className="col-md-6">
            <Button
              disabled={isReadOnly || !formikProps.values.transferredWithinGreOn}
              onClick={onClickGreTransferred}
            >
              Update Property Information
            </Button>
          </div>
        )}
      </Form.Group>
      <OrText>OR</OrText>
      <Form.Group>
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
      </Form.Group>
      {formikProps.values.workflowCode === 'ERP' && (
        <>
          <Form.Group>
            <Form.Label column md={4}>
              Request for SPL Received On
              <TooltipIcon toolTipId="requestForSplReceivedOn" toolTip={requestForSplReceivedOn} />
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-2"
              formikProps={formikProps}
              disabled={isReadOnly || isClearanceNotificationSentOnRequired}
              field="requestForSplReceivedOn"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              SPL Addition Approved On
              <TooltipIcon toolTipId="approvedForSplOn" toolTip={approvedForSplOn} />
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-2"
              formikProps={formikProps}
              disabled={isReadOnly || isClearanceNotificationSentOnRequired}
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
                    isClearanceNotificationSentOnRequired ||
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
                      disabled={isReadOnly || isClearanceNotificationSentOnRequired}
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
          </Form.Group>
          {formikProps.values.statusCode === ReviewWorkflowStatus.NotInSpl && (
            <>
              <OrText>OR</OrText>
              <Form.Group>
                <Form.Label column md={4}>
                  <h3>Dispose Externally</h3>
                </Form.Label>
              </Form.Group>
              <Form.Group>
                <Form.Label column md={4}>
                  Date of Accepted Offer
                </Form.Label>
                <FastDatePicker
                  outerClassName="col-md-2"
                  formikProps={formikProps}
                  disabled={isReadOnly}
                  field="offerAcceptedOn"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label column md={4}>
                  Purchaser
                </Form.Label>
                <FastInput
                  field="purchaser"
                  outerClassName="col-md-2"
                  disabled={isReadOnly}
                  formikProps={formikProps}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label column md={4}>
                  Offer Amount
                </Form.Label>
                <FastCurrencyInput
                  field="offerAmount"
                  outerClassName="col-md-2"
                  disabled={isReadOnly}
                  formikProps={formikProps}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label column md={4}>
                  Disposal Date
                </Form.Label>
                <FastDatePicker
                  required
                  outerClassName="col-md-2"
                  formikProps={formikProps}
                  disabled={isReadOnly}
                  field="disposedOn"
                />
                <Button
                  disabled={isReadOnly || !formikProps.values.disposedOn}
                  onClick={() =>
                    validateFormikWithCallback(formikProps, () => setDisposeExternally(true))
                  }
                >
                  Dispose
                </Button>
              </Form.Group>
            </>
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
          {disposeExternally && (
            <GenericModal
              display={disposeExternally}
              cancelButtonText="Close"
              okButtonText="Dispose Project"
              handleOk={(e: any) => {
                onClickDisposedExternally(e);
                setDisposeExternally(false);
              }}
              handleCancel={() => {
                setDisposeExternally(false);
              }}
              title="Really Dispose Project?"
              message={disposeWarning}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default EnhancedReferralCompleteForm;
