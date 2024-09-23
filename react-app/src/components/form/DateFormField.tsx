import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
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
            <DatePicker
              disabled={disabled}
              onChange={onChange}
              value={value}
              label={label}
              format={'LL'}
              sx={{
                width: '100%',
              }}
              slotProps={{
                textField: {
                  error: !!error && !!error.message,
                  InputProps: {
                    style: { fontSize: '14px' }, // Font size for input text
                  },
                  InputLabelProps: {
                    style: { fontSize: '14px' }, // Font size for label
                  },
                  required: required ? true : undefined,
                },
              }}
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
