import { Chip, useTheme } from '@mui/material';
import React from 'react';

export const dateFormatter = (input: any) => {
  const asDate = new Date(input);
  if (!isFinite(asDate.getTime())) {
    return 'Invalid Date';
  }
  return input
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date(input))
    : '';
};

export const columnNameFormatter = (input: string) => {
  return input.replace('OCG', 'OCG ').replace(/([a-z])([A-Z])/g, '$1 $2'); //ExampleHeaderHere -> Example Header Here
};

type ChipStatus = 'OnHold' | 'Active' | 'Disabled' | 'Denied'; //Replace with a better type eventually.
export const statusChipFormatter = (value: ChipStatus) => {
  const theme = useTheme();
  const colorMap = {
    Disabled: 'warning',
    Active: 'success',
    OnHold: 'info',
    Denied: 'warning',
  };
  return (
    <>
      <Chip
        sx={{
          padding: '.25rem',
          color: theme.palette[colorMap[value] ?? 'warning']['main'],
          backgroundColor: theme.palette[colorMap[value] ?? 'warning']['light'],
        }}
        label={value
          .match(/([A-Z]?[^A-Z]*)/g)
          .slice(0, -1)
          .join(' ')}
      />
    </>
  );
};

export const projectStatusChipFormatter = (value: string) => {
  const theme = useTheme();
  const colorMap = {
    ['Draft']: 'info',
    ['In ERP']: 'info',
    ['Approved for ERP']: 'success',
    ['Approved for Exemption']: 'success',
    ['Denied']: 'warning',
    ['Approved for SPL']: 'success',
    ['Disposed']: 'success',
    ['Cancelled']: 'warning',
  };
  return (
    <>
      <Chip
        sx={{
          padding: '.25rem',
          color: theme.palette[colorMap[value] ?? 'warning']['main'],
          backgroundColor: theme.palette[colorMap[value] ?? 'warning']['light'],
        }}
        label={value}
      />
    </>
  );
};

export const formatMoney = (value?: number | ''): string => {
  // if we dont have a number to format just display what we have
  if (typeof value != 'number') {
    return value;
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value || 0);
};

export const parseIntOrNull = (int: string | number) => {
  if (typeof int === 'number') {
    return int;
  }
  return int.length > 0 ? parseInt(int) : null;
};

export const parseFloatOrNull = (flt: string | number) => {
  if (typeof flt === 'number') {
    return flt;
  }
  return flt.length > 0 ? parseFloat(flt) : null;
};

export const zeroPadPID = (pid: number | string): string => {
  return String(pid).replace(/[^\d]/g, '').padStart(9, '0');
};

export const pidFormatter = (pid: number | string): string => {
  if (pid == null) return '';
  return zeroPadPID(pid).match(/\d{3}/g).join('-').slice(0, 11);
};

export const formatNumber = (num: number) => num.toLocaleString();

/**
 * @param input The string being capitalized.
 * @param patterns A list of objects with split and join values.
 * For each object, the string will be split, capitalized, then joined with the provided characters.
 * Default splits on spaces and joins with spaces again.
 * @returns A string with the capitalized result.
 */
export const capitalizeFirstLetters = (
  input: string,
  patterns = [
    {
      split: /[\s]/,
      join: ' ',
    },
  ],
) => {
  if (!input.length) return '';
  let returnValue = input.toLowerCase().trim();
  // For each provided pattern, split the string, capitalize each initial letter, then join it again
  patterns.forEach((pattern) => {
    const parts = returnValue.split(pattern.split);
    const result = [];
    parts.forEach((part) => {
      if (part.length) {
        const firstLetter = part.at(0).toUpperCase();
        result.push(firstLetter + part.slice(1));
      }
    });
    returnValue = result.join(pattern.join);
  });
  return returnValue;
};
