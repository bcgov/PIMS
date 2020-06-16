import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Formik, Form } from 'formik';
import SumFinancialsForm from './SumFinancialsForm';
import { IFinancial } from './EvaluationForm';
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
    const financials: IFinancial[] = [
      { key: EvaluationKeys.Assessed, value: 100 },
      { key: FiscalKeys.Estimated, value: 10000 },
      { key: FiscalKeys.NetBook, value: 100000 },
    ];
    const sumFinancialsForm = getSumFinancialsForm({ financials: financials });
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('100')).toBeVisible();
    expect(getByDisplayValue('10000')).toBeVisible();
    expect(getByDisplayValue('100000')).toBeVisible();
  });

  it('only sums financial data from the current year', () => {
    const financials: IFinancial[] = [
      { key: EvaluationKeys.Assessed, value: 100, year: 2020 },
      { key: EvaluationKeys.Assessed, value: 100, year: 2019 },
    ];
    const sumFinancialsForm = getSumFinancialsForm({ financials: financials });
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('100')).toBeVisible();
  });

  it('sums financials from properties and buildings', () => {
    const financials: any = {
      financials: [{ key: EvaluationKeys.Assessed, value: 100, year: 2020 }],
      buildings: [{ financials: { key: EvaluationKeys.Assessed, value: 100, year: 2020 } }],
    };
    const sumFinancialsForm = getSumFinancialsForm(financials);
    const { getByDisplayValue } = render(sumFinancialsForm);
    expect(getByDisplayValue('200')).toBeVisible();
  });

  it('sums financials from properties and buildings only in the most recent year', () => {
    const financials: any = {
      financials: [{ key: EvaluationKeys.Assessed, value: 100, year: 2020 }],
      buildings: [{ financials: { key: EvaluationKeys.Assessed, value: 100, year: 2019 } }],
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
