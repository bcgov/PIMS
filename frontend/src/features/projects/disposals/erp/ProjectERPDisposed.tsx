import { FastCurrencyInput, FastDatePicker, Input, TextArea } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';
import { IProjectForm } from '../interfaces';
import * as styled from './styled';
import { Col, Row } from 'components/flex';

export const ProjectERPDisposed: React.FC = () => {
  const formik = useFormikContext<IProjectForm>();

  return (
    <styled.ProjectERPDisposed>
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
    </styled.ProjectERPDisposed>
  );
};
