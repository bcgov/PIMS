import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { useFormikContext } from 'formik';
import { IProjectForm } from '../interfaces';
import React from 'react';
import { Col, Row } from 'components/flex';
import * as styled from './styled';

interface IProjectSPLContractInPlaceProps {}

export const ProjectSPLContractInPlace: React.FC<IProjectSPLContractInPlaceProps> = props => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectSPL>
      <h2>Contract In Place</h2>
      <Row>
        <Col flex="1">
          <TextArea label="Offers Received" field="offersNote" />
        </Col>
        <Col flex="1">
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
      </Row>
    </styled.ProjectSPL>
  );
};
