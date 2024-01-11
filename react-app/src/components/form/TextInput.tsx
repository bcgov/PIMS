import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type ITextInputProps = TextFieldProps;

const TextInput = (props: ITextInputProps) => {
  return <TextField {...props}></TextField>;
};

export default TextInput;
