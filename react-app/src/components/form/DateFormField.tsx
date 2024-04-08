import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

type DateFieldFormProps = {
  name: string;
  label: string;
};

const DateFormField = (props: DateFieldFormProps) => {
  const { control } = useFormContext();
  const { name, label } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField fullWidth onChange={onChange} value={value} label={label} format={'LL'} />
          </LocalizationProvider>
        );
      }}
    />
  );
};

export default DateFormField;
