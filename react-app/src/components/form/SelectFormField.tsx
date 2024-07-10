import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, ListItemText } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export interface ISelectMenuItem {
  label: string;
  value: any;
  parentId?: number;
  children?: unknown[];
  tooltip?: string;
}

interface ISelectInputProps {
  name: string;
  label: string | JSX.Element;
  required: boolean;
  options: ISelectMenuItem[];
}

const SelectFormField = (props: ISelectInputProps) => {
  const { label, options, name } = props;
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id={`select-inputlabel-${label}`}>{label}</InputLabel>
          <Select labelId={`select-label-${label}`} id={`select-${label}`} label={label} {...field}>
            {options.map((option) => (
              <MenuItem key={`menu-item-${label}-${option.label}`} value={option.value}>
                <ListItemText
                  primary={option.label}
                  secondary={option.tooltip}
                  sx={{
                    margin: 0,
                  }}
                />{' '}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectFormField;
