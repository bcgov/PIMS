import { render } from '@testing-library/react';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React from 'react';

import { Check, CheckProps } from './Check';

describe('Check component tests', () => {
  const renderCheck = (props: CheckProps, initialValues: any = { test: '' }) => (
    <Formik onSubmit={noop} initialValues={initialValues}>
      <Check {...props}></Check>
    </Formik>
  );
  it('Displays a simple checkbox by default', () => {
    const { getByLabelText } = render(renderCheck({ field: 'test', label: 'label' }));
    expect(getByLabelText('label')).not.toBeChecked();
  });
  it('Displays a radio if radio props specified', () => {
    const { getByLabelText } = render(
      renderCheck({ field: 'test', radioLabelOne: 'Yes', radioLabelTwo: 'No', type: 'radio' }),
    );
    expect(getByLabelText('Yes')).toBeInTheDocument();
    expect(getByLabelText('No')).toBeInTheDocument();
  });
  it('by default, no radio option is selected if the field value is not true or false', () => {
    const { getByLabelText } = render(
      renderCheck({ field: 'test', radioLabelOne: 'Yes', radioLabelTwo: 'No', type: 'radio' }),
    );
    expect(getByLabelText('Yes')).not.toBeChecked();
    expect(getByLabelText('No')).not.toBeChecked();
  });
  it('by default, the first radio is selected if the value is true', () => {
    const { getByLabelText } = render(
      renderCheck(
        { field: 'test', radioLabelOne: 'Yes', radioLabelTwo: 'No', type: 'radio' },
        { test: true },
      ),
    );
    expect(getByLabelText('Yes')).toBeChecked();
    expect(getByLabelText('No')).not.toBeChecked();
  });
  it('by default, the second radio is selected if the value is false', () => {
    const { getByLabelText } = render(
      renderCheck(
        { field: 'test', radioLabelOne: 'Yes', radioLabelTwo: 'No', type: 'radio' },
        { test: false },
      ),
    );
    expect(getByLabelText('Yes')).not.toBeChecked();
    expect(getByLabelText('No')).toBeChecked();
  });
});
