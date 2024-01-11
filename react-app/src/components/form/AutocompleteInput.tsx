import React from 'react';
import { Autocomplete, SxProps, TextField } from '@mui/material';
import { ISelectMenuItem } from './SelectInput';

interface IAutocompleteProps {
  label: string;
  options: ISelectMenuItem[];
  sx?: SxProps;
}

const AutocompleteInput = (props: IAutocompleteProps) => {
  const { options, label, sx } = props;

  return (
    <Autocomplete
      freeSolo={false}
      disablePortal
      id={`autocompleteinput-${label}`}
      options={options}
      sx={sx}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
};

export default AutocompleteInput;
