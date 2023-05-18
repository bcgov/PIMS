import {
  FastCurrencyInput,
  FastDatePicker,
  FastFiscalYearInput,
  Input,
  TextArea,
} from 'components/common/form';
import { Col, Row } from 'components/flex';
import { getIn, useFormikContext } from 'formik';
import React from 'react';

import { IProjectForm } from '../interfaces';
import { ProjectNote } from '../notes';
import * as styled from './styled';
import { calcGainBeforeSpl, calcNetProceeds, getNumber } from './utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProjectCloseOutProps {}

export const ProjectCloseOut: React.FC<IProjectCloseOutProps> = () => {
  const formik = useFormikContext<IProjectForm>();
  const { values, setFieldValue } = useFormikContext<IProjectForm>();

  const market = getIn(values, 'market');
  const interestComponent = getIn(values, 'interestComponent');
  const salesCost = getIn(values, 'salesCost');
  const netBook = getIn(values, 'netBook');
  const gainBeforeSpl = getIn(values, 'gainBeforeSpl');
  const programCost = getIn(values, 'programCost');
  const netProceeds = getIn(values, 'netProceeds');

  React.useEffect(() => {
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

  React.useEffect(() => {
    const calculatedValue = calcNetProceeds(getNumber(gainBeforeSpl), getNumber(programCost));
    if (netProceeds !== calculatedValue) {
      // Calculate the Gain after SPL.
      setFieldValue('netProceeds', calculatedValue);
    }
  }, [gainBeforeSpl, programCost, setFieldValue, netProceeds]);

  return (
    <styled.ProjectCloseOut>
      <Col>
        <h2>Project Information</h2>
        <Row>
          <Col flex="1">
            <Input label="Project Number" field="projectNumber" disabled />
            <Input label="Agency" field="agency" disabled />
          </Col>
          <Col flex="1">
            <Input label="Project Manager(s)" field="manager" disabled />
            {formik.values.subAgency && <Input label="Sub Agency" field="subAgency" disabled />}
          </Col>
        </Row>
      </Col>
      <Col>
        <h2>Purchase Information</h2>
        <Row>
          <Col flex="1">
            <Input label="Name of Purchaser" field="purchaser" disabled />
            <Input label="Real Estate Agent" field="realtor" />
            <FastCurrencyInput label="Assessed Value" field="assessed" formikProps={formik} />
          </Col>
          <Col flex="1">
            <Input label="Real Estate Agent Rate" field="realtorRate" />
            <FastCurrencyInput
              label="Real Estate Commission Paid"
              field="realtorCommission"
              formikProps={formik}
            />
            <FastCurrencyInput label="Appraised Value" field="appraised" formikProps={formik} />
          </Col>
        </Row>
      </Col>
      <Col>
        <h2>Sales Information</h2>
        <Row>
          <Col flex="1">
            <FastDatePicker
              label="Sales Completion Date"
              field="disposedOn"
              formikProps={formik}
              size="sm"
            />
            <FastDatePicker
              label="Sales Adjustment Date"
              field="adjustedOn"
              formikProps={formik}
              size="sm"
            />
          </Col>
          <Col flex="1">
            <FastFiscalYearInput
              label="Actual or Forecasted Fiscal Year of Sale"
              field="actualFiscalYear"
              formikProps={formik}
            />
            <Input label="Best Information of Future Planned Use" field="plannedFutureUse" />
          </Col>
        </Row>
      </Col>
      <Col>
        <h2>Financial Summary</h2>
        <Row>
          <Col flex="1">
            <FastCurrencyInput label="Sale Price" field="market" formikProps={formik} />
            <FastCurrencyInput
              label="Interest Component"
              field="interestComponent"
              formikProps={formik}
            />
            <FastCurrencyInput label="Cost of Sale" field="salesCost" formikProps={formik} />
            <FastCurrencyInput label="Net Book Value" field="netBook" formikProps={formik} />
            <hr />
            <FastCurrencyInput
              label="Gain before SPL Cost"
              field="gainBeforeSpl"
              allowNegative={true}
              disabled
              formikProps={formik}
            />
            <FastCurrencyInput label="SPL Cost" field="programCost" formikProps={formik} />
            <hr />
            <FastCurrencyInput
              label="Gain after SPL Cost"
              field="netProceeds"
              allowNegative={true}
              disabled
              formikProps={formik}
            />
            <FastCurrencyInput
              label="Net Proceeds"
              field="netProceeds"
              allowNegative={true}
              formikProps={formik}
            />
          </Col>
          <Col flex="1">
            <ProjectNote
              label="Remediation (Not funded through COS. TRAN only)"
              field="remediationNote"
            />
            <ProjectNote label="SPL Cost Calculation Notes" field="programCostNote" />
            <ProjectNote label="Gain after SPL Cost Calculation Notes" field="gainNote" />
            <ProjectNote label="Project Comments" field="comments" />
          </Col>
        </Row>
      </Col>
      <Col>
        <h2>OCG</h2>
        <Row>
          <Col flex="1">
            <FastCurrencyInput
              label="OCG Gain/Loss"
              field="ocgFinancialStatement"
              formikProps={formik}
            />
          </Col>
          <Col flex="1">
            <ProjectNote label="OCG Variance Notes" field="salesHistoryNote" />
          </Col>
        </Row>
      </Col>
      <Col>
        <h2>Signed by Chief Financial Officer</h2>
        <Row>
          <Col flex="1">
            <Input label="Preliminary Form Signed By" field="preliminaryFormSignedBy" />
          </Col>
          <Col flex="1">
            <FastDatePicker
              label="Signature Date"
              field="preliminaryFormSignedOn"
              formikProps={formik}
              size="sm"
            />
          </Col>
        </Row>
        <Row>
          <Col flex="1">
            <Input label="Final Form Signed By" field="finalFormSignedBy" />
          </Col>
          <Col flex="1">
            <FastDatePicker
              label="Signature Date"
              field="finalFormSignedOn"
              formikProps={formik}
              size="sm"
            />
          </Col>
        </Row>
      </Col>
      <Col>
        <h2>Adjustment to Prior Year Sale</h2>
        <Row>
          <Col flex="1">
            <Row nowrap>
              <FastCurrencyInput
                label="Adjustment to Prior Year Sale Amount"
                field="priorYearAdjustmentAmount"
                formikProps={formik}
              />
              <FastDatePicker
                label="Adjustment to Prior Year Sale Date"
                field="priorYearAdjustmentOn"
                formikProps={formik}
                size="sm"
              />
            </Row>
          </Col>
          <Col flex="1">
            <TextArea label="Adjustment to Prior Year Sale Notes" field="adjustmentNote" />
          </Col>
        </Row>
      </Col>
    </styled.ProjectCloseOut>
  );
};
