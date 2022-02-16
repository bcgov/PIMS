import { FastCurrencyInput } from 'components/common/form';
import { IProject } from 'features/projects/interfaces';
import {
  calcGainBeforeSpl,
  calcNetProceeds,
  getNumber,
} from 'features/projects/spl/forms/CloseOutFinancialSummaryForm';
import { getIn, useFormikContext } from 'formik';
import * as React from 'react';
import { useEffect } from 'react';
import { Col, Form } from 'react-bootstrap';

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
  const { values, setFieldValue } = useFormikContext<IProject>();

  const market = getIn(values, 'market');
  const interestComponent = getIn(values, 'interestComponent');
  const salesCost = getIn(values, 'salesCost');
  const netBook = getIn(values, 'netBook');
  const gainBeforeSpl = getIn(values, 'gainBeforeSpl');
  useEffect(() => {
    const calculatedValue = calcGainBeforeSpl(
      getNumber(market),
      getNumber(interestComponent),
      getNumber(salesCost),
      getNumber(netBook),
    );
    if (gainBeforeSpl !== calculatedValue) {
      // Calculate the Gain before SPL.
      setFieldValue('gainBeforeSpl', calculatedValue);
    }
  }, [market, interestComponent, salesCost, netBook, setFieldValue, gainBeforeSpl]);

  const programCost = getIn(values, 'programCost');
  const netProceeds = getIn(values, 'netProceeds');
  useEffect(() => {
    const calculatedValue = calcNetProceeds(getNumber(gainBeforeSpl), getNumber(programCost));
    if (netProceeds !== calculatedValue) {
      // Calculate the Gain after SPL.
      setFieldValue('netProceeds', calculatedValue);
    }
  }, [gainBeforeSpl, programCost, setFieldValue, netProceeds]);

  const context = useFormikContext();
  return (
    <>
      {title && (
        <>
          <Form.Group style={{ alignItems: 'unset' }}>
            <h3 className="col-md-8">{title}</h3>
          </Form.Group>
          <Form.Group>
            <h6 className="col-md-12" style={{ margin: '0 0 1rem 0' }}>
              These values are for the <strong>project</strong>, not the individual properties.
            </h6>
          </Form.Group>
        </>
      )}
      <Form.Group>
        <Col md={4}>
          <Form.Group>
            <Form.Label column md={4}>
              Assessed Value
            </Form.Label>
            <FastCurrencyInput
              field="assessed"
              required
              formikProps={context}
              disabled={disabled}
              md={6}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Net Book Value
            </Form.Label>
            <FastCurrencyInput
              field="netBook"
              required
              formikProps={context}
              disabled={disabled}
              md={6}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label column md={4}>
              Estimated Market Value
            </Form.Label>
            <FastCurrencyInput
              field="market"
              required
              formikProps={context}
              disabled={disabled}
              md={6}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Appraised Value
            </Form.Label>
            <FastCurrencyInput field="appraised" formikProps={context} disabled={disabled} md={6} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label column md={4}>
              Estimated Sales Costs
            </Form.Label>
            <FastCurrencyInput field="salesCost" formikProps={context} disabled={disabled} md={6} />
          </Form.Group>
          <Form.Group>
            <Form.Label column md={4}>
              Estimated Program Recovery Fees
            </Form.Label>
            <FastCurrencyInput
              field="programCost"
              formikProps={context}
              disabled={disabled}
              md={6}
            />
          </Form.Group>
        </Col>
      </Form.Group>
    </>
  );
};

export default ProjectFinancialTable;
