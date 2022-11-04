import { FastDatePicker, FastFiscalYearInput, FastInput, Form } from 'components/common/form';
import { useFormikContext } from 'formik';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

interface IAdditionalPropertyInformationFormProps {
  isReadOnly?: boolean;
}

/**
 * Surplus Properties information - in addition to standard property information.
 * @param param0 isReadOnly disable editing
 */
const AdditionalPropertyInformationForm = ({
  isReadOnly,
}: IAdditionalPropertyInformationFormProps) => {
  const formikProps = useFormikContext();
  return (
    <Container fluid>
      <Row>
        <Form.Label column md={3}>
          Project Approved On
        </Form.Label>
        <Col md="auto">
          <FastDatePicker
            outerClassName="col-md-2"
            formikProps={formikProps}
            disabled={isReadOnly}
            field="approvedOn"
          />
        </Col>
      </Row>
      <Row>
        <Form.Label column md={3}>
          Manager Names
        </Form.Label>
        <Col md="auto">
          <FastInput
            outerClassName="col-md-2"
            formikProps={formikProps}
            disabled={isReadOnly}
            field="manager"
          />
        </Col>
      </Row>
      <Row>
        <Form.Label column md={3}>
          Reported Fiscal Year
        </Form.Label>
        <Col md="auto">
          <FastFiscalYearInput
            outerClassName="col-md-2"
            formikProps={formikProps}
            disabled={isReadOnly}
            field="reportedFiscalYear"
          />
        </Col>
      </Row>
      <Row>
        <Form.Label column md={3}>
          Actual or Forecasted Fiscal Year of Sale
        </Form.Label>
        <Col md="auto">
          <FastFiscalYearInput
            outerClassName="col-md-2"
            formikProps={formikProps}
            disabled={isReadOnly}
            field="actualFiscalYear"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AdditionalPropertyInformationForm;
