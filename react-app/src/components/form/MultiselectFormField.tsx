import React from 'react';
import {
  Autocomplete,
  SxProps,
  TextField,
  Paper,
  Chip,
  Box,
  autocompleteClasses,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { ISelectMenuItem } from '@/components/form/SelectFormField';

interface MultiselectFormFieldProps {
  name: string;
  label: string;
  options: ISelectMenuItem[];
  allowNestedIndent?: boolean;
  sx?: SxProps;
  required?: boolean;
}

const CustomPaper = (props) => {
  return <Paper elevation={4} {...props} />;
};

const MultiselectFormField = (props: MultiselectFormFieldProps) => {
  const { control, getValues, formState } = useFormContext();
  const { name, label, sx, required, options, allowNestedIndent, ...rest } = props;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: { value: required, message: 'Required field.' },
      }}
      render={({ field: { onChange } }) => (
        <Autocomplete
          multiple
          freeSolo={false}
          disablePortal={false}
          id={`multiselect-input-${label}`}
          options={options}
          PaperComponent={CustomPaper}
          sx={sx}
          limitTags={2}
          fullWidth
          disableClearable={true}
          getOptionLabel={(option: ISelectMenuItem) => option.label}
          isOptionEqualToValue={(sourceOption, selectedOption) =>
            sourceOption.value === selectedOption.value
          }
          renderTags={(selectedOptions, props) =>
            selectedOptions.map((option, index) => (
              <Chip
                {...props({ index })}
                key={option.value}
                label={option.label ?? 'N/A'}
                variant="outlined"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!formState.errors?.[name]}
              required={required}
              label={label}
              helperText={(formState.errors?.[name]?.message as string) ?? undefined}
            />
          )}
          renderOption={(props, option) => (
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
              key={option.value}
            >
              {option.label ?? 'N/A'}
            </Box>
          )}
          onChange={(_, data) => {
            return data && onChange(data);
          }}
          value={getValues()[name]}
          {...rest}
        />
      )}
    />
  );
};

export default MultiselectFormField;
