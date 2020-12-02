import * as React from 'react';
import { Col, Form } from 'react-bootstrap';
import { FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';

export interface IProjectFinacialTableProps {
  /** Whether form fields are disabled. */
  disabled: boolean;
  /** An optional label to display. */
  label?: string;
}

/**
 *
 */
export const ProjectFinancialTable = ({ disabled, label }: IProjectFinacialTableProps) => {
  const context = useFormikContext();
  return (
    <>
      {label && (
        <Form.Row style={{ alignItems: 'unset' }}>
          <h3 className="col-md-8">{label}</h3>
        </Form.Row>
      )}
      <Form.Row>
        <Col md={4}>
          <Form.Row>
            <Form.Label column md={4}>
              Net Book Value
            </Form.Label>
            <FastCurrencyInput field="netBook" required formikProps={context} disabled={disabled} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Estimated Market Value
            </Form.Label>
            <FastCurrencyInput field="market" required formikProps={context} disabled={disabled} />
          </Form.Row>
        </Col>
        <Col md={4}>
          <Form.Row>
            <Form.Label column md={4}>
              Assessed Value
            </Form.Label>
            <FastCurrencyInput
              field="assessed"
              required
              formikProps={context}
              disabled={disabled}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Appraised Value
            </Form.Label>
            <FastCurrencyInput field="appraised" formikProps={context} disabled={disabled} />
          </Form.Row>
        </Col>
        <Col md={4}>
          <Form.Row>
            <Form.Label column md={4}>
              Estimated Sales Costs
            </Form.Label>
            <FastCurrencyInput field="salesCost" formikProps={context} disabled={disabled} />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Estimated Program Recovery Fees
            </Form.Label>
            <FastCurrencyInput field="programCost" formikProps={context} disabled={disabled} />
          </Form.Row>
        </Col>
      </Form.Row>
    </>
  );
};

export default ProjectFinancialTable;
