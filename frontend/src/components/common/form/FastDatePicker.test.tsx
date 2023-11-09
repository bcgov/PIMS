import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React from 'react';
import { fillInput } from 'utils/testUtils';

import { FastDatePicker } from './FastDatePicker';

const testRender = (props?: any, formikProps?: any) =>
  render(
    <Formik initialValues={formikProps?.initialValues ?? {}} onSubmit={noop}>
      {(formikProps) => (
        <FastDatePicker
          field="test"
          {...{ ...(props ?? {}) }}
          formikProps={{
            ...{
              ...formikProps,
              initialValues: { test: '2020-12-31', ...formikProps.initialValues },
              values: { test: '2020-12-31', ...formikProps.values },
            },
          }}
        ></FastDatePicker>
      )}
    </Formik>,
  );

describe('fast date picker old date functionality', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  beforeAll(() => {
    (global as any).IS_REACT_ACT_ENVIRONMENT = false;
  });
  it('handles an empty value', () => {
    const { container } = testRender(
      { oldDateWarning: true },
      { initialValues: { test: '' }, values: { test: '' } },
    );
    fillInput(container, 'test', '12/29/2020', 'datepicker');
  });
  it('handles identical starting values and current value', () => {
    const { container } = testRender({ oldDateWarning: true }, { values: { test: '2020-12-31' } });
    fillInput(container, 'test', '12/31/2020', 'datepicker');
  });
  it('displays a warning when an older date is entered', async () => {
    const { container } = testRender({ oldDateWarning: true }, { values: { test: '2020-12-29' } });
    fillInput(container, 'test', '12/29/2020', 'datepicker');
    expect(await screen.findByText('Older Date Entered')).toBeInTheDocument();
  });
  it('sets the input when ok button clicked', async () => {
    const { container } = testRender({ oldDateWarning: true }, { values: { test: '2020-12-29' } });
    fillInput(container, 'test', '12/29/2020', 'datepicker');
    expect(await screen.findByText('Older Date Entered')).toBeInTheDocument();
    const okButton = document.body.querySelector('button');
    waitFor(() => fireEvent.click(okButton!));
    expect(await screen.findByDisplayValue('12/31/2020')).toBeInTheDocument();
  });
  it('sets the input when cancel button clicked', async () => {
    const { container } = testRender({ oldDateWarning: true }, { values: { test: '2020-12-29' } });
    fillInput(container, 'test', '12/29/2020', 'datepicker');
    expect(await screen.findByText('Older Date Entered')).toBeInTheDocument();
    const cancelButton = document.body.querySelectorAll('button')[1];
    fireEvent.click(cancelButton!);
    expect(await screen.findByDisplayValue('12/29/2020')).toBeInTheDocument();
  });
});
