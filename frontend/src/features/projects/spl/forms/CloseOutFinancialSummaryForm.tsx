import { Fragment, useEffect } from 'react';
import React from 'react';
import { Col } from 'react-bootstrap';
import { getIn, useFormikContext } from 'formik';
import { Form, FastCurrencyInput } from 'components/common/form';
import { IProject, projectComments, ProjectNotes } from 'features/projects/common';

interface CloseOutFinancialSummaryFormProps {
  /** Whether the form inputs will be readonly. */
  isReadOnly?: boolean; // TODO: Need to make `disabled` and `isReadonly` consistent.  Choose one throughout app.
}

const getValue = (value?: string | number) => {
  const result = Number(value);
  return isNaN(result) ? 0 : result;
};

/**
 * Close out form financial summary fields.
 * @param props
 */
const CloseOutFinancialSummaryForm = (props: CloseOutFinancialSummaryFormProps) => {
  const { values, setFieldValue } = useFormikContext<IProject>();

  const market = getIn(values, 'market');
  const interestComponent = getIn(values, 'interestComponent');
  const salesCost = getIn(values, 'salesCost');
  const netBook = getIn(values, 'netBook');
  useEffect(() => {
    // Calculate the Gain before SPL.
    setFieldValue(
      'gainBeforeSpl',
      getValue(market) - getValue(interestComponent) - getValue(salesCost) - getValue(netBook),
    );
  }, [market, interestComponent, salesCost, netBook, setFieldValue]);

  const gainBeforeSpl = getIn(values, 'gainBeforeSpl');
  const programCost = getIn(values, 'programCost');
  useEffect(() => {
    // Calculate the Gain after SPL.
    setFieldValue('netProceeds', getValue(gainBeforeSpl) - getValue(programCost));
  }, [gainBeforeSpl, programCost, setFieldValue]);

  const formikProps = useFormikContext<IProject>();

  return (
    <Fragment>
      <h3>Financial Summary</h3>
      <Form.Row>
        <Col>
          <Form.Row>
            <Form.Label column md={6}>
              Sale Price
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              field="market"
              md={6}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={6}>
              Interest Component
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              field="interestComponent"
              md={6}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={6}>
              Cost of Sale
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              field="salesCost"
              md={6}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={6}>
              Net Book Value
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              field="netBook"
              md={6}
            />
          </Form.Row>
          <Form.Row style={{ borderTop: 'solid 1px grey' }}>
            <Form.Label column md={6}>
              Gain before SPL Cost
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={true}
              field="gainBeforeSpl"
              allowNegative={true}
              md={6}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label column md={6}>
              SPL Cost
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={props.isReadOnly}
              field="programCost"
              md={6}
            />
          </Form.Row>
          <Form.Row style={{ borderTop: 'solid 1px grey' }}>
            <Form.Label column md={6}>
              Gain after SPL Cost
            </Form.Label>
            <FastCurrencyInput
              formikProps={formikProps}
              disabled={true}
              field="netProceeds"
              allowNegative={true}
              md={6}
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
        <Col md={1}>&nbsp;</Col>
        <Col>
          <ProjectNotes
            field="remediationNote"
            label="Remediation (Not funded throuch COS. TRAN only)"
            disabled={props.isReadOnly}
            outerClassName="col"
            className="col-md-10"
          />
          <ProjectNotes
            field="programCostNote"
            label="SPL Cost Calculation Notes"
            disabled={props.isReadOnly}
            outerClassName="col"
            className="col-md-10"
          />
          <ProjectNotes
            field="gainNote"
            label="Gain after SPL Cost Calculation Notes"
            disabled={props.isReadOnly}
            outerClassName="col"
            className="col-md-10"
          />
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <ProjectNotes
            field="comments"
            label="Project Comments"
            outerClassName="col-md-11"
            className="col-md-auto"
            tooltip={projectComments}
            disabled={props.isReadOnly}
          />
        </Col>
      </Form.Row>
    </Fragment>
  );
};

export default CloseOutFinancialSummaryForm;
