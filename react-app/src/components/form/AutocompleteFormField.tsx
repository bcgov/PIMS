import React from 'react';
import { Autocomplete, SxProps, TextField, Paper, Box, autocompleteClasses } from '@mui/material';
import { ISelectMenuItem } from './SelectFormField';
import { Controller, useFormContext } from 'react-hook-form';

interface IAutocompleteProps {
  name: string;
  label: string;
  options: ISelectMenuItem[];
  sx?: SxProps;
  required?: boolean;
}

const CustomPaper = (props) => {
  return <Paper elevation={4} {...props} />;
};

const AutocompleteFormField = (props: IAutocompleteProps) => {
  const { control, getValues, formState } = useFormContext();
  const { name, options, label, sx, required } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field: { onChange } }) => (
        <Autocomplete
          freeSolo={false}
          disablePortal={false}
          id={`autocompleteinput-${label}`}
          options={options}
          PaperComponent={CustomPaper}
          sx={sx}
          disableClearable={true}
          getOptionLabel={(option: ISelectMenuItem) => option.label}
          renderOption={(props, option, state, ownerState) => (
            <Box
              sx={{
                borderRadius: '8px',
                fontWeight: option.parent ? 900 : 500,
                margin: '3px',
                [`&.${autocompleteClasses.option}`]: {
                  padding: '4px',
                },
                marginLeft: option.parent ? '0' : '15px',
              }}
              component="li"
              {...props}
            >
              {ownerState.getOptionLabel(option)}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!formState.errors?.[name]}
              required={required}
              label={label}
              helperText={formState.errors?.[name] ? 'This field is required.' : undefined}
            />
          )}
          onChange={(_, data) => onChange(data.value)}
          value={options.find((option) => option.value === getValues()[name]) ?? null}
          {...props}
        />
      )}
    />
  );
};

export default AutocompleteFormField;
