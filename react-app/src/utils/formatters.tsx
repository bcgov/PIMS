import { Chip, useTheme } from '@mui/material';
import React from 'react';

export const dateFormatter = (input: any) => {
  if (!(input instanceof Date)) {
    input = new Date(input);
  }
  return `${input.getDay()}/${input.getMonth() + 1}/${input.getFullYear()}`;
};

export const columnNameFormatter = (input: string) => {
  return input.replace(/([a-z])([A-Z])/g, '$1 $2');
};

type ChipStatus = 'Pending' | 'Active' | 'Hold'; //Replace with a better type eventually.
export const statusChipFormatter = (value: ChipStatus) => {
  const theme = useTheme();
  const colorMap = {
    Pending: 'info',
    Active: 'success',
    OnHold: 'warning',
  };
  return (
    <>
      <Chip
        sx={{
          width: '6rem',
          color: theme.palette[colorMap[value] ?? 'warning']['main'],
          backgroundColor: theme.palette[colorMap[value] ?? 'warning']['light'],
        }}
        label={value}
      />
    </>
  );
};
