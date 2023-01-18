import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React from 'react';

import { BuildingValuationForm } from './BuildingValuationForm';

const form = (
  <Formik initialValues={{ assessedLand: '' }} onSubmit={noop}>
    {(props: any) => <BuildingValuationForm formikProps={props} />}
  </Formik>
);

it('renders correctly', async () => {
  const { container } = render(form);
  await waitFor(() => expect(container.firstChild).toMatchSnapshot());
});

it('renders two seperate tables for assessed value and net book value', async () => {
  const { getAllByRole } = render(form);
  await waitFor(() => {
    const tables = getAllByRole('table');
    expect(tables).toHaveLength(2);
  });
});

it('headers for (Assessed Value, Assessment Year, Assessed Building Value) + (Net Book Value, Fiscal Year, Effective Date, Net Book Value)', async () => {
  const { getAllByRole } = render(form);
  await waitFor(() => {
    const headers = getAllByRole('columnheader');
    expect(headers).toHaveLength(14);
  });
});
