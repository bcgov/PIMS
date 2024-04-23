import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

type TextFormFieldProps = {
  defaultVal?: string;
  name: string;
  label: string;
  numeric?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
} & TextFieldProps;

const TextFormField = (props: TextFormFieldProps) => {
  const { control } = useFormContext();
  const { name, label, rules, numeric, defaultVal, ...restProps } = props;
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: props.required ? 'Required field.' : undefined, ...rules }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <TextField
            {...restProps}
            onChange={(event) => {
              if (numeric === undefined) {
                onChange(event);
                return;
              }
              if (event.target.value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(event.target.value)) {
                onChange(event);
              }
            }}
            value={value ?? defaultVal}
            fullWidth
            label={label}
            type={numeric ? 'number' : 'text'}
            error={!!error && !!error.message}
            helperText={error?.message}
          />
        );
      }}
    />
  );
};

export default TextFormField;
