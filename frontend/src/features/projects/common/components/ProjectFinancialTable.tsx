import * as React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';

const ProjectFinancialTable = () => {
  const context = useFormikContext();
  return (
    <>
      <Row>
        <Col md={4}>
          <Row>
            <Form.Label column md={4}>
              Net Book Value <span className="required">*</span>
            </Form.Label>
            <FastCurrencyInput field="netBook" formikProps={context} />
          </Row>
          <Row>
            <Form.Label column md={4}>
              Estimated Market Value <span className="required">*</span>
            </Form.Label>
            <FastCurrencyInput field="estimated" formikProps={context} />
          </Row>
        </Col>
        <Col md={4}>
          <Row>
            <Form.Label column md={4}>
              Assessed Value <span className="required">*</span>
            </Form.Label>
            <FastCurrencyInput field="assessed" formikProps={context} />
          </Row>
          <Row>
            <Form.Label column md={4}>
              Appraised Value
            </Form.Label>
            <FastCurrencyInput field="appraised" formikProps={context} />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ProjectFinancialTable;
