import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const TextFormField = (props: TextFieldProps) => {
  const { register, formState } = useFormContext();
  const { name } = props;
  return (
    <TextField
      {...props}
      {...register(name, { required: props.required })}
      error={!!formState.errors?.[name]}
      helperText={formState.errors?.[name] ? 'This field is required.' : undefined}
    />
  );
};

export default TextFormField;
