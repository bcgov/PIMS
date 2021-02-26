import React, { useState, useMemo } from 'react';
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
  IProperty,
  disposeSubdivisionWarning,
  IParentParcel,
} from '../../common';
import './SurplusPropertyListForm.scss';
import _ from 'lodash';
import GenericModal, { ModalSize } from 'components/common/GenericModal';
import TooltipIcon from 'components/common/TooltipIcon';
import { SurplusPropertyListApprovalForm } from '..';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';
import variables from '_variables.module.scss';
import { LinkList, ILinkListItem } from 'components/common/LinkList';
import { useLocation } from 'react-router-dom';
import { pidFormatter } from 'features/properties/components/forms/subforms/PidPinForm';
import queryString from 'query-string';

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

const FloatCheck = styled(FaExclamationTriangle)`
  margin: 1em;
  color: ${variables.accentColor};
  float: left;
`;

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
  const location = useLocation();
  const { values } = formikProps;
  const cipConditionalTasks = _.filter(values.tasks, {
    statusCode: ReviewWorkflowStatus.ContractInPlaceConditional,
  });
  const cipUnconditionalTasks = _.filter(values.tasks, {
    statusCode: ReviewWorkflowStatus.ContractInPlaceUnconditional,
  });

  const mainBtn = primaryButton(values.statusCode);
  const subdivisions =
    values.properties.filter((property: IProperty) => property.propertyTypeId === 2) ?? [];
  const parentParcels = _.uniqBy(_.flatten(subdivisions.map(s => s.parcels ?? [])), 'pid');

  const linkListItems = useMemo<ILinkListItem[]>(
    () =>
      parentParcels.map(
        (parcel: IParentParcel): ILinkListItem => ({
          key: parcel.id,
          label: `PID ${pidFormatter(parcel.pid ?? '')}`,
          pathName: '/mapview',
          search: queryString.stringify({
            ...queryString.parse(location.search),
            sidebar: true,
            disabled: true,
            loadDraft: false,
            parcelId: parcel.id,
          }),
        }),
      ),
    [location.search, parentParcels],
  );

  return (
    <Container fluid className="SurplusPropertyListForm">
      {values.statusCode !== ReviewWorkflowStatus.Cancelled &&
        values.statusCode !== ReviewWorkflowStatus.Disposed && (
          <Form.Row>
            <Form.Label column md={3}>
              Change the Status
            </Form.Label>
            <Form.Group>
              {values.workflowCode === DisposalWorkflows.Erp && (
                <Button
                  disabled={
                    isReadOnly ||
                    !values.clearanceNotificationSentOn ||
                    !values.requestForSplReceivedOn
                  }
                  onClick={onClickProceedToSPL}
                >
                  Return to SPL
                </Button>
              )}

              {values.statusCode === ReviewWorkflowStatus.PreMarketing && (
                <Button
                  variant="secondary"
                  disabled={isReadOnly || values.statusCode !== ReviewWorkflowStatus.PreMarketing}
                  onClick={onClickRemoveFromSPL}
                >
                  Remove from SPL
                </Button>
              )}
              {values.statusCode !== ReviewWorkflowStatus.PreMarketing &&
                values.workflowCode === DisposalWorkflows.Spl && (
                  <Button
                    variant={mainBtn === 'PM' ? 'primary' : 'secondary'}
                    disabled={isReadOnly}
                    onClick={onClickPreMarketing}
                  >
                    Pre-Marketing
                  </Button>
                )}
              {values.statusCode !== ReviewWorkflowStatus.OnMarket &&
                values.workflowCode === DisposalWorkflows.Spl && (
                  <Button
                    variant={mainBtn === 'M' ? 'primary' : 'secondary'}
                    disabled={isReadOnly}
                    onClick={onClickMarketedOn}
                  >
                    On the Market
                  </Button>
                )}
              {(values.statusCode === ReviewWorkflowStatus.PreMarketing ||
                values.statusCode === ReviewWorkflowStatus.OnMarket) && (
                <Button
                  variant={mainBtn === 'CIP' ? 'primary' : 'secondary'}
                  disabled={isReadOnly}
                  onClick={onClickContractInPlaceConditional}
                >
                  Conditional
                </Button>
              )}

              {(values.statusCode === ReviewWorkflowStatus.PreMarketing ||
                values.statusCode === ReviewWorkflowStatus.OnMarket ||
                values.statusCode === ReviewWorkflowStatus.ContractInPlaceConditional) && (
                <Button
                  variant={mainBtn === 'CIP' ? 'primary' : 'secondary'}
                  disabled={isReadOnly}
                  onClick={onClickContractInPlaceUnconditional}
                >
                  Unconditional
                </Button>
              )}
              {(values.statusCode === ReviewWorkflowStatus.ContractInPlaceConditional ||
                values.statusCode === ReviewWorkflowStatus.ContractInPlaceUnconditional) && (
                <Button
                  variant={mainBtn === 'D' ? 'primary' : 'secondary'}
                  disabled={
                    isReadOnly ||
                    (values.statusCode === ReviewWorkflowStatus.ContractInPlaceConditional &&
                      _.filter(cipConditionalTasks, { isCompleted: false, isOptional: false })
                        .length !== 0) ||
                    (values.statusCode === ReviewWorkflowStatus.ContractInPlaceUnconditional &&
                      _.filter(cipUnconditionalTasks, { isCompleted: false, isOptional: false })
                        .length !== 0)
                  }
                  onClick={() => setDispose(true)}
                >
                  Dispose
                </Button>
              )}

              <div className="col-md-6">
                <GenericModal
                  size={subdivisions.length > 0 ? ModalSize.LARGE : ModalSize.MEDIUM}
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
                  message={
                    <>
                      {disposeWarning}
                      {subdivisions.length > 0 && (
                        <>
                          <hr></hr>
                          <FloatCheck size={32} />
                          <p className="mb-3">{disposeSubdivisionWarning}</p>
                          <LinkList
                            noItemsMessage="No Associated Parent Parcels"
                            listItems={linkListItems}
                          />
                        </>
                      )}
                    </>
                  }
                />
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

      {(values.statusCode === ReviewWorkflowStatus.ContractInPlaceConditional ||
        values.statusCode === ReviewWorkflowStatus.ContractInPlaceUnconditional) && (
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

      {values.statusCode === ReviewWorkflowStatus.PreMarketing && (
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
            disabled={isReadOnly || !values.transferredWithinGreOn}
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
