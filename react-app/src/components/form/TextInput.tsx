import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const TextInput = (props: TextFieldProps) => {
  const { register } = useFormContext();
  const { name } = props;
  return <TextField {...props} {...register(name)} />;
};

export default TextInput;
