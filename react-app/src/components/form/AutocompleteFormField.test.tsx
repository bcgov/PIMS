import AutocompleteFormField from '@/components/form/AutocompleteFormField';
import { create } from 'react-test-renderer';
import React from 'react';

// Mock data
const name = 'testName';
const label = 'testLabel';
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];
const sx = { marginTop: '10px' };

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

describe('AutocompleteFormField.tsx', () => {
  it('should match the existing snapshot', () => {
    const tree = create(
      <AutocompleteFormField name={name} label={label} options={options} sx={sx} />,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
