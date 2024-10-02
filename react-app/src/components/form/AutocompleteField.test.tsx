import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import AutocompleteFormField from './AutocompleteFormField';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: () => <></>,
  useForm: () => ({
    control: () => ({}),
    handleSubmit: () => jest.fn(),
  }),
  useFormContext: () => ({
    control: () => ({}),
  }),
}));

jest.mock('@mui/utils', () => ({
  ...jest.requireActual('@mui/utils'),
  getReactNodeRef: () => null,
}));

describe('', () => {
  it('should render', () => {
    render(
      <AutocompleteFormField
        name={'test'}
        label={'test'}
        options={[
          {
            label: 'a',
            value: 'a',
          },
        ]}
      />,
    );
  });
});
