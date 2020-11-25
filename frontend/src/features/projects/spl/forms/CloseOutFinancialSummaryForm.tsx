import { Fragment } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { useFormikContext } from 'formik';
import { Form, FastInput, FastCurrencyInput } from 'components/common/form';
import { NoteTypes, IProject } from 'features/projects/common';

interface CloseOutFinancialSummaryFormProps {
  isReadOnly?: boolean;
}

/**
 * Close out form financial summary fields.
 * @param props
 */
const CloseOutFinancialSummaryForm = (props: CloseOutFinancialSummaryFormProps) => {
  const formikProps = useFormikContext<IProject>();
  return (
    <Fragment>
      <h3>Financial Summary</h3>
      <Form.Row>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              Sales Proceeds
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="market"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Cost of Sales
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="salesCost"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Net Book Value
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="netBook"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Gain Before SPP Cost
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="gainBeforeSpp"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Remediation (Not funded throuch COS. TRAN only)
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="remediation"
            />
          </Form.Row>
        </Col>
        <Col md={6}>
          <Form.Row>
            <Form.Label column md={4}>
              SPP Cost
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="programCost"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              SPP Cost Calculation Notes
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field={`notes[${NoteTypes.SppCost}].note`}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Gain after SPP Cost
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="gainAfterSpp"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Gain after SPP Cost Calculation Notes
            </Form.Label>
            <FastInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field={`notes[${NoteTypes.SppGain}].note`}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Interest Component
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="interestComponent"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={4}>
              Net Proceeds
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              outerClassName="col-md-8"
              field="netProceeds"
            />
          </Form.Row>
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutFinancialSummaryForm;
