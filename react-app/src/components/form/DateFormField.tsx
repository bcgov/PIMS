import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DateFieldFormProps = {
  name: string;
  label: string;
  disabled?: boolean;
};

const DateFormField = (props: DateFieldFormProps) => {
  const { control } = useFormContext();
  const { name, label, disabled } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
              disabled={disabled}
              fullWidth
              onChange={onChange}
              value={value}
              label={label}
              format={'LL'}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default DateFormField;
