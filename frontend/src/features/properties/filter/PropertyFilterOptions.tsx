import { GeocoderAutoComplete } from 'features/properties/components/GeocoderAutoComplete';
import { useFormikContext } from 'formik';
import React from 'react';

import { InputGroup, Select } from '../../../components/common/form';
import { IPropertyFilter } from './IPropertyFilter';

interface IPropertyFilterOptions {
  disabled?: boolean;
}

/**
 * Provides a dropdown with list of search options for properties.
 */
export const PropertyFilterOptions: React.FC<IPropertyFilterOptions> = ({ disabled }) => {
  const state: { options: any[]; placeholders: Record<string, string> } = {
    options: [
      { label: 'Address', value: 'address' },
      { label: 'PID/PIN', value: 'pid' },
    ],
    placeholders: {
      address: 'Enter an address',
      pid: 'Enter a PID or PIN',
    },
  };

  // access the form context values, no need to pass props
  const {
    values: { searchBy, address },
    setFieldValue,
  } = useFormikContext<IPropertyFilter>();
  const desc = state.placeholders[searchBy] || '';

  const reset = () => {
    setFieldValue('address', '');
  };

  return (
    <InputGroup
      fast={
        searchBy === 'address' ? (
          <GeocoderAutoComplete
            placeholder={desc}
            field="address"
            value={address}
            displayErrorTooltips
            onSelectionChanged={(selection) => {
              setFieldValue('address', selection.fullAddress);
              setFieldValue('administrativeArea', selection.administrativeArea);
            }}
            onTextChange={(value) => {
              setFieldValue('address', value);
            }}
          />
        ) : (
          false
        )
      }
      formikProps={null as any}
      prepend={
        <Select field="searchBy" options={state.options} onChange={reset} disabled={disabled} />
      }
      field={searchBy}
      placeholder={desc}
      disabled={disabled}
    ></InputGroup>
  );
};
