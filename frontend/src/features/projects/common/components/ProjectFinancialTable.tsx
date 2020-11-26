import * as React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';

const ProjectFinancialTable = ({ disabled }: { disabled: boolean }) => {
  const context = useFormikContext();
  return (
    <>
      <Row>
        <Col md={4}>
          <Row>
            <Form.Label column md={4}>
              Net Book Value
            </Form.Label>
            <FastCurrencyInput field="netBook" required formikProps={context} disabled={disabled} />
          </Row>
          <Row>
            <Form.Label column md={4}>
              Estimated Market Value
            </Form.Label>
            <FastCurrencyInput field="market" required formikProps={context} disabled={disabled} />
          </Row>
        </Col>
        <Col md={4}>
          <Row>
            <Form.Label column md={4}>
              Assessed Value
            </Form.Label>
            <FastCurrencyInput
              field="assessed"
              required
              formikProps={context}
              disabled={disabled}
            />
          </Row>
          <Row>
            <Form.Label column md={4}>
              Appraised Value
            </Form.Label>
            <FastCurrencyInput field="appraised" formikProps={context} disabled={disabled} />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ProjectFinancialTable;
