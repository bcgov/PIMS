import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { Col, Row } from 'components/flex';
import { useFormikContext } from 'formik';
import React from 'react';

import { IProjectForm } from '../interfaces';
import * as styled from './styled';

interface IProjectSPLContractInPlaceProps {
  disabled?: boolean;
}

export const ProjectSPLContractInPlace: React.FC<IProjectSPLContractInPlaceProps> = ({
  disabled = false,
}) => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectSPL>
      <h2>Contract In Place</h2>
      <Row>
        <Col flex="1">
          <TextArea label="Offers Received" field="offersNote" disabled={disabled} />
        </Col>
        <Col flex="1">
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
      </Row>
    </styled.ProjectSPL>
  );
};
