import * as React from 'react';
import { Col, Form } from 'react-bootstrap';
import { FastCurrencyInput } from 'components/common/form';
import { useFormikContext } from 'formik';

export interface IProjectFinacialTableProps {
  /** Whether form fields are disabled. */
  disabled: boolean;
  /** An optional title to display. */
  title?: string;
}

/**
 * Provides a way to display and edit project financial information.
 */
export const ProjectFinancialTable = ({ disabled, title }: IProjectFinacialTableProps) => {
  const context = useFormikContext();
  return (
    <>
      {title && (
        <Form.Row style={{ alignItems: 'unset' }}>
          <h3 className="col-md-8">{title}</h3>
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
