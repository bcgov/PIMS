import React from 'react';
import {
  Autocomplete,
  SxProps,
  TextField,
  Paper,
  Box,
  autocompleteClasses,
  FilterOptionsState,
} from '@mui/material';
import { ISelectMenuItem } from './SelectFormField';
import { Controller, useFormContext } from 'react-hook-form';

type AutocompleteFormProps = {
  name: string;
  label: string;
  options: ISelectMenuItem[];
  sx?: SxProps;
  required?: boolean;
  allowNestedIndent?: boolean;
  disableOptionsFunction?: (option: ISelectMenuItem) => boolean;
  disableClearable?: boolean;
  defaultValue?: ISelectMenuItem | null;
  customOptionsFilter?: (
    options: ISelectMenuItem[],
    state: FilterOptionsState<ISelectMenuItem>,
  ) => ISelectMenuItem[];
};

const CustomPaper = (props) => {
  return <Paper elevation={4} {...props} />;
};

const AutocompleteFormField = (props: AutocompleteFormProps) => {
  const { control, getValues, formState } = useFormContext();
  const {
    name,
    options,
    label,
    sx,
    required,
    allowNestedIndent,
    disableClearable,
    disableOptionsFunction,
    customOptionsFilter,
    ...rest
  } = props;

  const defaultOptionsFilter = (
    options: ISelectMenuItem[],
    state: FilterOptionsState<ISelectMenuItem>,
  ) => options.filter((item) => item.label.toLowerCase().includes(state.inputValue.toLowerCase()));

  const optionsFilter = customOptionsFilter ? customOptionsFilter : defaultOptionsFilter;

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required }}
      render={({ field: { onChange } }) => (
        <Autocomplete
          disablePortal={false}
          id={`autocompleteinput-${label}`}
          options={options}
          PaperComponent={CustomPaper}
          sx={sx}
          disableClearable={disableClearable}
          getOptionLabel={(option: ISelectMenuItem) => option.label}
          getOptionDisabled={disableOptionsFunction}
          filterOptions={optionsFilter}
          renderOption={(props, option, state, ownerState) => (
            <Box
              sx={{
                fontWeight: option.parent ? 900 : 500,
                [`&.${autocompleteClasses.option}`]: {
                  padding: 1,
                  paddingLeft: allowNestedIndent && !option.parent ? 2 : 1,
                },
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
          onChange={(_, data) => {
            if (data) onChange(data.value);
          }}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={options.find((option) => option.value === getValues()[name]) ?? null}
          {...rest}
        />
      )}
    />
  );
};

export default AutocompleteFormField;
