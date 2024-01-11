import React from 'react';
import { Autocomplete, SxProps, TextField } from '@mui/material';
import { ISelectMenuItem } from './SelectInput';
import { Controller, useFormContext } from 'react-hook-form';

interface IAutocompleteProps {
  name: string;
  label: string;
  options: ISelectMenuItem[];
  sx?: SxProps;
}

const AutocompleteInput = (props: IAutocompleteProps) => {
  const { control } = useFormContext();
  const { name, options, label, sx } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <Autocomplete
          freeSolo={false}
          disablePortal
          id={`autocompleteinput-${label}`}
          options={options}
          sx={sx}
          renderInput={(params) => <TextField {...params} label={label} />}
          onChange={(_, data) => onChange(data.value)}
          {...props}
        />
      )}
    />
  );
};

export default AutocompleteInput;
