import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Form, FastDatePicker, FastInput, FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';
import {
  ProjectNotes,
  ReviewWorkflowStatus,
  IProject,
  TasksForm,
  disposeWarning,
  dateEnteredMarket,
  DisposalWorkflows,
  onTransferredWithinTheGreTooltip,
} from '../../common';
import './SurplusPropertyListForm.scss';
import _ from 'lodash';
import GenericModal from 'components/common/GenericModal';
import TooltipIcon from 'components/common/TooltipIcon';
import { SurplusPropertyListApprovalForm } from '..';

interface ISurplusPropertyListFormProps {
  isReadOnly?: boolean;
  onClickProceedToSPL: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickRemoveFromSPL: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickPreMarketing: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickMarketedOn: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickContractInPlaceConditional: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onClickContractInPlaceUnconditional: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onClickDisposedExternally: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickGreTransferred: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Determine which button is the primary action for the current project status.
 * @param status Project status code.
 * @returns A code to identify the primary button.
 */
const primaryButton = (status?: string): string => {
  switch (status) {
    case ReviewWorkflowStatus.PreMarketing:
      return 'M';
    case ReviewWorkflowStatus.OnMarket:
      return 'CIP';
    case ReviewWorkflowStatus.ContractInPlaceConditional:
    case ReviewWorkflowStatus.ContractInPlaceUnconditional:
      return 'D';
    default:
      return 'PM';
  }
};

/**
 * Form component of SurplusPropertyListForm. TODO: add button click functionality.
 * @param param0 isReadOnly disable editing
 */
const SurplusPropertyListForm = ({
  isReadOnly,
  onClickProceedToSPL,
  onClickRemoveFromSPL,
  onClickPreMarketing,
  onClickMarketedOn,
  onClickContractInPlaceConditional,
  onClickContractInPlaceUnconditional,
  onClickDisposedExternally,
  onClickGreTransferred,
}: ISurplusPropertyListFormProps) => {
  const formikProps = useFormikContext<IProject>();
  const [dispose, setDispose] = useState(false);
  const cipConditionalTasks = _.filter(formikProps.values.tasks, {
    statusCode: ReviewWorkflowStatus.ContractInPlaceConditional,
  });
  const cipUnconditionalTasks = _.filter(formikProps.values.tasks, {
    statusCode: ReviewWorkflowStatus.ContractInPlaceUnconditional,
  });

  const mainBtn = primaryButton(formikProps.values.statusCode);

  return (
    <Container fluid className="SurplusPropertyListForm">
      {formikProps.values.statusCode !== ReviewWorkflowStatus.Cancelled &&
        formikProps.values.statusCode !== ReviewWorkflowStatus.Disposed && (
          <Form.Row>
            <Form.Label column md={3}>
              Change the Status
            </Form.Label>
            <Form.Group>
              {formikProps.values.workflowCode === DisposalWorkflows.Erp && (
                <Button
                  disabled={
                    isReadOnly ||
                    !formikProps.values.clearanceNotificationSentOn ||
                    !formikProps.values.requestForSplReceivedOn
                  }
                  onClick={onClickProceedToSPL}
                >
                  Return to SPL
                </Button>
              )}

              {formikProps.values.statusCode === ReviewWorkflowStatus.PreMarketing && (
                <Button
                  variant="secondary"
                  disabled={
                    isReadOnly ||
                    formikProps.values.statusCode !== ReviewWorkflowStatus.PreMarketing
                  }
                  onClick={onClickRemoveFromSPL}
                >
                  Remove from SPL
                </Button>
              )}
              {formikProps.values.statusCode !== ReviewWorkflowStatus.PreMarketing &&
                formikProps.values.workflowCode === DisposalWorkflows.Spl && (
                  <Button
                    variant={mainBtn === 'PM' ? 'primary' : 'secondary'}
                    disabled={isReadOnly}
                    onClick={onClickPreMarketing}
                  >
                    Pre-Marketing
                  </Button>
                )}
              {formikProps.values.statusCode !== ReviewWorkflowStatus.OnMarket &&
                formikProps.values.workflowCode === DisposalWorkflows.Spl && (
                  <Button
                    variant={mainBtn === 'M' ? 'primary' : 'secondary'}
                    disabled={isReadOnly}
                    onClick={onClickMarketedOn}
                  >
                    On the Market
                  </Button>
                )}
              {(formikProps.values.statusCode === ReviewWorkflowStatus.PreMarketing ||
                formikProps.values.statusCode === ReviewWorkflowStatus.OnMarket) && (
                <Button
                  variant={mainBtn === 'CIP' ? 'primary' : 'secondary'}
                  disabled={isReadOnly}
                  onClick={onClickContractInPlaceConditional}
                >
                  Conditional
                </Button>
              )}

              {(formikProps.values.statusCode === ReviewWorkflowStatus.PreMarketing ||
                formikProps.values.statusCode === ReviewWorkflowStatus.OnMarket ||
                formikProps.values.statusCode ===
                  ReviewWorkflowStatus.ContractInPlaceConditional) && (
                <Button
                  variant={mainBtn === 'CIP' ? 'primary' : 'secondary'}
                  disabled={isReadOnly}
                  onClick={onClickContractInPlaceUnconditional}
                >
                  Unconditional
                </Button>
              )}
              {(formikProps.values.statusCode === ReviewWorkflowStatus.ContractInPlaceConditional ||
                formikProps.values.statusCode ===
                  ReviewWorkflowStatus.ContractInPlaceUnconditional) && (
                <Button
                  variant={mainBtn === 'D' ? 'primary' : 'secondary'}
                  disabled={
                    isReadOnly ||
                    (formikProps.values.statusCode ===
                      ReviewWorkflowStatus.ContractInPlaceConditional &&
                      _.filter(cipConditionalTasks, { isCompleted: false, isOptional: false })
                        .length !== 0) ||
                    (formikProps.values.statusCode ===
                      ReviewWorkflowStatus.ContractInPlaceUnconditional &&
                      _.filter(cipUnconditionalTasks, { isCompleted: false, isOptional: false })
                        .length !== 0)
                  }
                  onClick={() => setDispose(true)}
                >
                  Dispose
                </Button>
              )}

              <div className="col-md-6">
                {dispose && (
                  <GenericModal
                    display={dispose}
                    cancelButtonText="Close"
                    okButtonText="Dispose Project"
                    handleOk={(e: any) => {
                      onClickDisposedExternally(e);
                      setDispose(false);
                    }}
                    handleCancel={() => {
                      setDispose(false);
                    }}
                    title="Really Dispose Project?"
                    message={disposeWarning}
                  />
                )}
              </div>
            </Form.Group>
          </Form.Row>
        )}

      <SurplusPropertyListApprovalForm isReadOnly={isReadOnly} />

      <Form.Row>
        <h3>Marketing</h3>
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Date Entered Market
          <TooltipIcon toolTipId="dateEnteredMarket" toolTip={dateEnteredMarket} />
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="marketedOn"
        />
      </Form.Row>

      <Form.Row>
        <h3>Contract in Place</h3>
      </Form.Row>
      <ProjectNotes
        label="Offers Received"
        tooltip="Review required for offer(s) in Tier 3 & 4"
        field="offersNote"
        className="col-md-auto"
        outerClassName="col-md-12"
        disabled={isReadOnly}
      />
      <Form.Row>
        <Form.Label column md={3}>
          Date of Accepted Offer
        </Form.Label>
        <FastDatePicker
          required
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="offerAcceptedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Purchaser
        </Form.Label>
        <FastInput
          required
          field="purchaser"
          outerClassName="col-md-2"
          disabled={isReadOnly}
          formikProps={formikProps}
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Offer Amount
        </Form.Label>
        <FastCurrencyInput
          required
          field="offerAmount"
          outerClassName="col-md-2"
          disabled={isReadOnly}
          formikProps={formikProps}
        />
      </Form.Row>
      <TasksForm tasks={cipConditionalTasks} />
      <TasksForm tasks={cipUnconditionalTasks} />

      {(formikProps.values.statusCode === ReviewWorkflowStatus.ContractInPlaceConditional ||
        formikProps.values.statusCode === ReviewWorkflowStatus.ContractInPlaceUnconditional) && (
        <>
          <Form.Row>
            <h3>Dispose Externally</h3>
          </Form.Row>
          <Form.Row>
            <Form.Label column md={3}>
              Disposal Date
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-2"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="disposedOn"
            />
          </Form.Row>
        </>
      )}

      {formikProps.values.statusCode === ReviewWorkflowStatus.PreMarketing && (
        <>
          <Form.Row>
            <h3>Remove from SPL</h3>
          </Form.Row>
          <Form.Row>
            <Form.Label column md={3}>
              Request for removal on
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-2"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="removalFromSplRequestOn"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={3}>
              Request for removal approved on
            </Form.Label>
            <FastDatePicker
              outerClassName="col-md-2"
              formikProps={formikProps}
              disabled={isReadOnly}
              field="removalFromSplApprovedOn"
            />
          </Form.Row>
          <ProjectNotes
            label="Rationale for removal"
            field="removalFromSplRationale"
            className="col-md-auto"
            outerClassName="col-md-12"
            disabled={isReadOnly}
          />
        </>
      )}

      <Form.Row>
        <h3>Transfer within GRE</h3>
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
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
        <div className="col-md-6">
          <Button
            disabled={isReadOnly || !formikProps.values.transferredWithinGreOn}
            onClick={onClickGreTransferred}
          >
            Update Property Information
          </Button>
        </div>
      </Form.Row>
    </Container>
  );
};

export default SurplusPropertyListForm;
