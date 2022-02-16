import './EnhancedReferralCompleteForm.scss';

import { FastCurrencyInput, FastDatePicker, FastInput, Form } from 'components/common/form';
import GenericModal from 'components/common/GenericModal';
import TooltipIcon from 'components/common/TooltipIcon';
import { ReviewWorkflowStatus } from 'features/projects/constants';
import { IProject } from 'features/projects/interfaces';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import styled from 'styled-components';
import { validateFormikWithCallback } from 'utils';

import {
  disposeWarning,
  onTransferredWithinTheGreTooltip,
  proceedToSplWarning,
} from '../../common';
import { ExemptionDetails } from '../components/ExemptionDetails';

const OrText = styled.div`
  margin: 0.75rem 2rem 0.75rem 2rem;
`;

interface IEnhancedReferralCompleteFormProps {
  isReadOnly?: boolean;
  onClickGreTransferred: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickProceedToSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickNotInSpl: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickDisposedExternally: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickAddToErp: () => void;
}

const ExemptionEnhancedReferralCompleteForm = ({
  isReadOnly,
  onClickGreTransferred,
  onClickProceedToSpl,
  onClickNotInSpl,
  onClickAddToErp,
  onClickDisposedExternally,
}: IEnhancedReferralCompleteFormProps) => {
  const formikProps = useFormikContext<IProject>();
  const [proceedToSpl, setProceedToSpl] = useState(false);
  const [disposeExternally, setDisposeExternally] = useState(false);

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

  const isComplete = [
    ReviewWorkflowStatus.Disposed,
    ReviewWorkflowStatus.Cancelled,
    ReviewWorkflowStatus.TransferredGRE,
  ].some((v) => v === formikProps.values.statusCode);

  return (
    <Container fluid className="EnhancedReferralCompleteForm">
      <ExemptionDetails isReadOnly={isReadOnly} />
      <Form.Group>
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
      </Form.Group>
      {![
        ReviewWorkflowStatus.ApprovedForSpl,
        ReviewWorkflowStatus.PreMarketing,
        ReviewWorkflowStatus.OnMarket,
        ReviewWorkflowStatus.ContractInPlaceConditional,
        ReviewWorkflowStatus.ContractInPlaceUnconditional,
      ].some((v) => v === formikProps.values.statusCode) && (
        <>
          <h3>Option 1: Transfer within the Greater Reporting Entity</h3>
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
            {!isComplete && (
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
        </>
      )}
      {!isComplete &&
        ![
          ReviewWorkflowStatus.ApprovedForSpl,
          ReviewWorkflowStatus.PreMarketing,
          ReviewWorkflowStatus.OnMarket,
          ReviewWorkflowStatus.ContractInPlaceConditional,
          ReviewWorkflowStatus.ContractInPlaceUnconditional,
        ].some((v) => v === formikProps.values.statusCode) && (
          <>
            <h3>Option 2: Proceed to Surplus Properties List</h3>
            <Form.Group>
              <Form.Label column md={4}>
                Request Received On
              </Form.Label>
              <FastDatePicker
                outerClassName="col-md-2"
                formikProps={formikProps}
                disabled={isReadOnly}
                field="requestForSplReceivedOn"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label column md={4}>
                SPL Addition Approved On
              </Form.Label>
              <FastDatePicker
                outerClassName="col-md-2"
                formikProps={formikProps}
                disabled={isReadOnly}
                field="approvedForSplOn"
              />
              {!isComplete &&
                ![
                  ReviewWorkflowStatus.ApprovedForSpl,
                  ReviewWorkflowStatus.PreMarketing,
                  ReviewWorkflowStatus.OnMarket,
                  ReviewWorkflowStatus.ContractInPlaceConditional,
                  ReviewWorkflowStatus.ContractInPlaceUnconditional,
                ].some((v) => v === formikProps.values.statusCode) && (
                  <>
                    <Button
                      disabled={
                        isReadOnly ||
                        !formikProps.values.requestForSplReceivedOn ||
                        !formikProps.values.approvedForSplOn
                      }
                      onClick={() => {
                        setProceedToSpl(true);
                      }}
                    >
                      Proceed to SPL
                    </Button>
                    {formikProps.values.statusCode !== ReviewWorkflowStatus.NotInSpl && (
                      <>
                        <OrText>OR</OrText>
                        <Button disabled={isReadOnly} onClick={onClickNotInSpl}>
                          Not Included in the SPL
                        </Button>
                      </>
                    )}
                  </>
                )}
            </Form.Group>
          </>
        )}
      {!isComplete &&
        ![
          ReviewWorkflowStatus.ApprovedForSpl,
          ReviewWorkflowStatus.PreMarketing,
          ReviewWorkflowStatus.OnMarket,
          ReviewWorkflowStatus.ContractInPlaceConditional,
          ReviewWorkflowStatus.ContractInPlaceUnconditional,
        ].some((v) => v === formikProps.values.statusCode) && (
          <>
            <h3>Option 3: Add to Enhanced Referral Process</h3>
            <Form.Group>
              <div className="justify-content-center add-space-below">
                <Button disabled={isReadOnly} onClick={() => onClickAddToErp()}>
                  Add to Enhanced Referral Process
                </Button>
              </div>
            </Form.Group>
          </>
        )}

      {formikProps.values.statusCode === ReviewWorkflowStatus.NotInSpl && (
        <>
          <h3>Option 4: Dispose Externally</h3>
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
            {!isComplete && (
              <Button
                disabled={isReadOnly || !formikProps.values.disposedOn}
                onClick={() =>
                  validateFormikWithCallback(formikProps, () => setDisposeExternally(true))
                }
              >
                Dispose
              </Button>
            )}
          </Form.Group>
        </>
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
    </Container>
  );
};

export default ExemptionEnhancedReferralCompleteForm;
