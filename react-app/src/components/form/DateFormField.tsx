import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Typography, useTheme } from '@mui/material';

type DateFieldFormProps = {
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
};

const DateFormField = (props: DateFieldFormProps) => {
  const { control } = useFormContext();
  const theme = useTheme();
  const { name, label, disabled, required } = props;
  return (
    <Controller
      control={control}
      name={name}
      rules={{ validate: (value) => !required || value || 'Required field.' }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              disabled={disabled}
              fullWidth
              onChange={onChange}
              value={value}
              label={label}
              format={'LL'}
              required={required}
              slotProps={{ textField: { error: !!error && !!error.message } }}
            />
            {!!error && !!error.message ? (
              <Box>
                <Typography ml={'3.2em'} fontSize={'smaller'} color={theme.palette.error.main}>
                  {error.message}
                </Typography>
              </Box>
            ) : (
              <></>
            )}
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default DateFormField;
