import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Form, FastDatePicker, FastInput, FastCurrencyInput, Check } from 'components/common/form';
import { useFormikContext } from 'formik';
import {
  ProjectNotes,
  ReviewWorkflowStatus,
  IProject,
  TasksForm,
  disposeWarning,
} from '../../common';
import { PrivateNotes, PublicNotes } from '../../common/components/ProjectNotes';
import './SurplusPropertyListForm.scss';
import _ from 'lodash';
import GenericModal from 'components/common/GenericModal';
import { validateFormikWithCallback } from 'utils';

interface ISurplusPropertyListFormProps {
  isReadOnly?: boolean;
  onClickMarketedOn: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickContractInPlace: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickPreMarketing: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickDisposedExternally: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * Form component of SurplusPropertyListForm. TODO: add button click functionality.
 * @param param0 isReadOnly disable editing
 */
const SurplusPropertyListForm = ({
  isReadOnly,
  onClickMarketedOn,
  onClickContractInPlace,
  onClickPreMarketing,
  onClickDisposedExternally,
}: ISurplusPropertyListFormProps) => {
  const formikProps = useFormikContext<IProject>();
  const contractTasks = _.filter(formikProps.values.tasks, {
    statusCode: ReviewWorkflowStatus.ContractInPlace,
  });
  const [dispose, setDispose] = useState(false);

  return (
    <Container fluid className="SurplusPropertyListForm">
      <Form.Row>
        <Form.Label column md={3}>
          Date Entered Market
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="marketedOn"
        />
        <div className="col-md-7">
          <Button
            disabled={
              isReadOnly ||
              !formikProps.values.marketedOn ||
              formikProps.values.statusCode !== ReviewWorkflowStatus.PreMarketing
            }
            onClick={onClickMarketedOn}
          >
            Change Status to Marketing
          </Button>
          {formikProps.values.statusCode === ReviewWorkflowStatus.OnMarket}
        </div>
      </Form.Row>
      <ProjectNotes
        label="Offers Received"
        tooltip="Review Required for offer(s) in Tier 3 & 4"
        field="offersNote"
        outerClassName="col-md-12"
        disabled={isReadOnly}
      />
      <Form.Row>
        <Form.Label column md={3}>
          Contract in Place
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <Check
          type="radio"
          field="isContractConditional"
          radioLabelOne="Conditional"
          radioLabelTwo="Unconditional"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Date of Accepted Offer
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="offerAcceptedOn"
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Purchaser
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastInput
          field="purchaser"
          outerClassName="col-md-2"
          disabled={isReadOnly}
          formikProps={formikProps}
        />
      </Form.Row>
      <Form.Row>
        <Form.Label column md={3}>
          Offer Amount
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastCurrencyInput
          field="offerAmount"
          outerClassName="col-md-2"
          disabled={isReadOnly}
          formikProps={formikProps}
        />
        <ToggleContractOrPreMarketing
          isReadOnly={isReadOnly}
          onClickContractInPlace={onClickContractInPlace}
          onClickPreMarketing={onClickPreMarketing}
        />
        <div className="col-md-6"></div>
      </Form.Row>
      <TasksForm tasks={contractTasks} />
      <ProjectNotes outerClassName="col-md-12" disabled={true} />
      <ProjectNotes
        outerClassName="col-md-12"
        field="appraisedNote"
        label="Appraised Notes"
        disabled={isReadOnly}
      />
      <PublicNotes outerClassName="col-md-12" disabled={isReadOnly} />
      <PrivateNotes outerClassName="col-md-12" disabled={isReadOnly} />
      <Form.Row>
        <Form.Label column md={3}>
          Date Disposed Externally
          <span className="required">&nbsp;*</span>
        </Form.Label>
        <FastDatePicker
          outerClassName="col-md-2"
          formikProps={formikProps}
          disabled={isReadOnly}
          field="disposedOn"
        />
        <div className="col-md-6">
          <Button
            disabled={
              isReadOnly ||
              !formikProps.values.disposedOn ||
              _.filter(contractTasks, { isCompleted: false, isOptional: false }).length !== 0 ||
              formikProps.values.statusCode !== ReviewWorkflowStatus.ContractInPlace
            }
            onClick={() => validateFormikWithCallback(formikProps, () => setDispose(true))}
          >
            Change Status to Disposed Externally
          </Button>
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
      </Form.Row>
    </Container>
  );
};

const ToggleContractOrPreMarketing = ({
  isReadOnly,
  onClickContractInPlace,
  onClickPreMarketing,
}: {
  isReadOnly?: boolean;
  onClickContractInPlace: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClickPreMarketing: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const formikProps = useFormikContext<IProject>();
  return formikProps.values.statusCode === ReviewWorkflowStatus.ContractInPlace ? (
    <Button disabled={isReadOnly} onClick={onClickPreMarketing}>
      Change Status to Pre-Marketing
    </Button>
  ) : (
    <Button
      disabled={
        isReadOnly ||
        !formikProps.values.offerAmount ||
        formikProps.values.statusCode !== ReviewWorkflowStatus.OnMarket
      }
      onClick={onClickContractInPlace}
    >
      Change Status to Contract in Place
    </Button>
  );
};

export default SurplusPropertyListForm;
