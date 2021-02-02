import React from 'react';
import { BuildingValuationForm } from './BuildingValuationForm';
import { render } from '@testing-library/react';
import { noop } from 'lodash';
import { Formik } from 'formik';

const form = (
  <Formik initialValues={{ assessedLand: '' }} onSubmit={noop}>
    {(props: any) => <BuildingValuationForm formikProps={props} />}
  </Formik>
);

it('renders correctly', () => {
  const { container } = render(form);
  expect(container.firstChild).toMatchSnapshot();
});

it('renders two seperate tables for assessed value and net book value', () => {
  const { getAllByRole } = render(form);
  const tables = getAllByRole('table');
  expect(tables).toHaveLength(2);
});

it('headers for (Assessed Value, Assessment Year, Assessed Building Value) + (Net Book Value, Fiscal Year, Effective Date, Net Book Value)', () => {
  const { getAllByRole } = render(form);
  const headers = getAllByRole('columnheader');
  expect(headers).toHaveLength(7);
});
