import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Formik, Form } from 'formik';
import SumFinancialsForm from './SumFinancialsForm';
import { IFinancialYear } from './EvaluationForm';
import { EvaluationKeys } from 'constants/evaluationKeys';
import { FiscalKeys } from 'constants/fiscalKeys';

describe('sub-form SumFinancialsForm functionality', () => {
  afterEach(() => {
    cleanup();
  });
  const getSumFinancialsForm = (initialValues: any) => {
    return (
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {formikProps => (
          <Form>
            <SumFinancialsForm formikProps={formikProps}></SumFinancialsForm>
          </Form>
        )}
      </Formik>
    );
  };
  it('sums financial data', () => {
    const financials: IFinancialYear[] = [
      {
        assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2020 },
        improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2020 },
        appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2020 },
        market: { key: FiscalKeys.Market, value: 10000, year: 2020 },
        netbook: { key: FiscalKeys.NetBook, value: 100000, year: 2020 },
      },
    ];
    const sumFinancialsForm = getSumFinancialsForm({ financials: financials });
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('100')).toBeVisible();
    expect(getByDisplayValue('10000')).toBeVisible();
    expect(getByDisplayValue('100000')).toBeVisible();
  });

  it('only sums financial data from the current year', () => {
    const financials: IFinancialYear[] = [
      {
        assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2020 },
        improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2020 },
        appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2020 },
        market: { key: FiscalKeys.Market, value: 103, year: 2020 },
        netbook: { key: FiscalKeys.NetBook, value: 104, year: 2020 },
      },
      {
        assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2019 },
        improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2019 },
        appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2019 },
        market: { key: FiscalKeys.Market, value: 103, year: 2019 },
        netbook: { key: FiscalKeys.NetBook, value: 104, year: 2019 },
      },
    ];
    const sumFinancialsForm = getSumFinancialsForm({ financials: financials });
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('100')).toBeVisible();
  });

  it('sums financials from properties and buildings', () => {
    const financials: any = {
      financials: [
        {
          assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2020 },
          improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2020 },
          appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2020 },
          market: { key: FiscalKeys.Market, value: 103, year: 2020 },
          netbook: { key: FiscalKeys.NetBook, value: 104, year: 2020 },
        },
      ],
      buildings: [
        {
          financials: [
            {
              assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2020 },
              improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2020 },
              appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2020 },
              market: { key: FiscalKeys.Market, value: 103, year: 2020 },
              netbook: { key: FiscalKeys.NetBook, value: 104, year: 2020 },
            },
          ],
        },
      ],
    };
    const sumFinancialsForm = getSumFinancialsForm(financials);
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('200')).toBeVisible();
  });

  it('sums financials from properties and buildings only in the most recent year', () => {
    const financials: any = {
      financials: [
        {
          assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2020 },
          improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2020 },
          appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2020 },
          market: { key: FiscalKeys.Market, value: 103, year: 2020 },
          netbook: { key: FiscalKeys.NetBook, value: 104, year: 2020 },
        },
      ],
      buildings: [
        {
          financials: [
            {
              assessed: { key: EvaluationKeys.Assessed, value: 100, year: 2019 },
              improvements: { key: EvaluationKeys.Improvements, value: 101, year: 2019 },
              appraised: { key: EvaluationKeys.Appraised, value: 102, year: 2019 },
              market: { key: FiscalKeys.Market, value: 103, year: 2019 },
              netbook: { key: FiscalKeys.NetBook, value: 104, year: 2019 },
            },
          ],
        },
      ],
    };
    const sumFinancialsForm = getSumFinancialsForm(financials);
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('100')).toBeVisible();
  });

  it('displays no sums if passed no financial values', () => {
    const sumFinancialsForm = getSumFinancialsForm({});
    const { getAllByPlaceholderText } = render(sumFinancialsForm);
    expect(getAllByPlaceholderText('$0')).toHaveLength(3);
  });
});
