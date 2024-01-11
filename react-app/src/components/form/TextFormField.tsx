import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const TextFormField = (props: TextFieldProps) => {
  const { register } = useFormContext();
  const { name } = props;
  return <TextField {...props} {...register(name)} />;
};

export default TextFormField;
