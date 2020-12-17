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
      { label: 'Address', value: 'address' },
      { label: 'Location', value: 'administrativeArea' },
      { label: 'PID/PIN', value: 'pid' },
      { label: 'RAEG or SPP No.', value: 'projectNumber' },
    ],
    placeholders: {
      address: 'Enter an address or city',
      administrativeArea: 'Enter a location name',
      pid: 'Enter a PID or PIN',
      projectNumber: 'Enter an SPP/RAEG number',
    },
  };

  // access the form context values, no need to pass props
  const {
    values: { searchBy },
    setFieldValue,
  } = useFormikContext<IPropertyFilter>();
  const desc = state.placeholders[searchBy] || '';

  const reset = () => {
    setFieldValue('address', '');
    setFieldValue('administrativeArea', '');
    setFieldValue('projectNumber', '');
    setFieldValue('city', '');
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
