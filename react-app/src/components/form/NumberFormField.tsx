import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type NumberFormFieldProps = {
  name: string;
  label: string;
} & TextFieldProps;

const NumberFormField = (props: NumberFormFieldProps) => {
  const { control } = useFormContext();
  const { name, label, ...restProps } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <TextField
            {...restProps}
            onChange={(event) => {
              if (event.target.value === '' || /^[0-9]*\.?[0-9]*$/.test(event.target.value)) {
                onChange(event);
              }
            }}
            value={value}
            fullWidth
            label={label}
            type="text"
            error={!!error && !!error.message}
          />
        );
      }}
    />
  );
};

export default NumberFormField;
