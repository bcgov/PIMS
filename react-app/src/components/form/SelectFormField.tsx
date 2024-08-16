import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  FormHelperText,
} from '@mui/material';
import { Controller, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

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
  disabled?: boolean;
  options: ISelectMenuItem[];
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
}

const SelectFormField = (props: ISelectInputProps) => {
  const { label, options, name, rules, disabled } = props;
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth>
          <InputLabel id={`select-inputlabel-${label}`}>{label}</InputLabel>
          <Select
            disabled={disabled}
            labelId={`select-label-${label}`}
            id={`select-${label}`}
            label={label}
            {...field}
          >
            {options.map((option) => (
              <MenuItem key={`menu-item-${label}-${option.label}`} value={option.value}>
                <ListItemText
                  primary={option.label}
                  secondary={option.tooltip}
                  sx={{
                    margin: 0,
                  }}
                />
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default SelectFormField;
