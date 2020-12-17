import { useFormikContext } from 'formik';
import React from 'react';
import { Select, InputGroup } from '../../../components/common/form';
import { IPropertyFilter } from './IPropertyFilter';

/**
 * Provides a dropdown with list of search options for properties.
 */
export const PropertyFilterOptions: React.FC = () => {
  const state: { options: any[]; placeholders: Record<string, string> } = {
    options: [
      { label: 'Property Name', value: 'name' },
      { label: 'Address', value: 'address' },
    ],
    placeholders: {
      name: 'Enter a name',
      address: 'Enter an address or city',
    },
  };

  // access the form context values, no need to pass props
  const {
    values: { searchBy },
    setFieldValue,
  } = useFormikContext<IPropertyFilter>();
  const desc = state.placeholders[searchBy] || '';

  const reset = () => {
    setFieldValue('name', '');
    setFieldValue('address', '');
  };

  return (
    <InputGroup
      fast={false}
      formikProps={null as any}
      prepend={<Select field="searchBy" options={state.options} onChange={reset} />}
      field={searchBy}
      placeholder={desc}
    ></InputGroup>
  );
};
