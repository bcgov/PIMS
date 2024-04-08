import React from 'react';
import { SxProps, Checkbox, Typography, Box } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface SingleSelectBoxFormFieldProps {
  name: string;
  label: string;
  sx?: SxProps;
  required?: boolean;
}

const SingleSelectBoxFormField = (props: SingleSelectBoxFormFieldProps) => {
  const { control, getValues } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            id={`single-checkbox-${name}`}
            onChange={(_, data) => onChange(data)}
            checked={getValues()[name]}
          />
          <Typography>{label}</Typography>
        </Box>
      )}
    />
  );
};

export default SingleSelectBoxFormField;
