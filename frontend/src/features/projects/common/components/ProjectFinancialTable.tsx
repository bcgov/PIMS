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
              Net Book Value <span className="required">*</span>
            </Form.Label>
            <FastCurrencyInput field="netBook" formikProps={context} disabled={disabled} />
          </Row>
          <Row>
            <Form.Label column md={4}>
              Estimated Market Value <span className="required">*</span>
            </Form.Label>
            <FastCurrencyInput field="market" formikProps={context} disabled={disabled} />
          </Row>
        </Col>
        <Col md={4}>
          <Row>
            <Form.Label column md={4}>
              Assessed Value <span className="required">*</span>
            </Form.Label>
            <FastCurrencyInput field="assessed" formikProps={context} disabled={disabled} />
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
