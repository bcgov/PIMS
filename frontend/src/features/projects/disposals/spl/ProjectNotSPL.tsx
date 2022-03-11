import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import { IProjectForm } from '../interfaces';
import React from 'react';

import * as styled from './styled';
import { WorkflowStatus } from 'hooks/api/projects';

interface IProjectNotSPLProps {}

export const ProjectNotSPL: React.FC<IProjectNotSPLProps> = props => {
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
          <TextArea label="Offers Received" field="offersNote" />
          <Input label="Purchaser" field="purchaser" />
          <FastCurrencyInput label="Offer Amount" field="offerAmount" formikProps={formik} />
          <FastDatePicker
            label="Date of Accepted Offer"
            field="offerAcceptedOn"
            formikProps={formik}
            size="sm"
          />
          <FastDatePicker label="Disposal Date" field="disposedOn" formikProps={formik} size="sm" />
        </Col>
        <Col flex="1" align="flex-end">
          {showTransferredWithinGRE && (
            <FastDatePicker
              label="Transferred within the GRE On"
              field="transferredWithinGreOn"
              formikProps={formik}
              size="sm"
            />
          )}
        </Col>
      </Row>
    </styled.ProjectNotSPL>
  );
};
