import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { WorkflowStatus } from 'hooks/api/projects';
import React from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

interface IProjectNotSPLProps {
  disabled?: boolean;
}

export const ProjectNotSPL: React.FC<IProjectNotSPLProps> = ({ disabled = false }) => {
  const formik = useFormikContext<IProjectForm>();
  const {
    values: { statusCode },
  } = formik;

  const showTransferredWithinGRE =
    statusCode === WorkflowStatus.NotInSpl || statusCode === WorkflowStatus.TransferredGRE;

  return (
    <styled.ProjectNotSPL>
      <h2>Not in Surplus Properties List</h2>
      <Row>
        <Col flex="1">
          <TextArea label="Offers Received" field="offersNote" disabled={disabled} />
          <Input label="Purchaser" field="purchaser" disabled={disabled} />
          <FastCurrencyInput
            label="Offer Amount"
            field="offerAmount"
            formikProps={formik}
            disabled={disabled}
          />
          <FastDatePicker
            label="Date of Accepted Offer"
            field="offerAcceptedOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
          <FastDatePicker
            label="Disposal Date"
            field="disposedOn"
            formikProps={formik}
            size="sm"
            disabled={disabled}
          />
        </Col>
        <Col flex="1" align="flex-end">
          {showTransferredWithinGRE && (
            <FastDatePicker
              label="Transferred within the GRE On"
              field="transferredWithinGreOn"
              formikProps={formik}
              size="sm"
              disabled={disabled}
            />
          )}
        </Col>
      </Row>
    </styled.ProjectNotSPL>
  );
};
