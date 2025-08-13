import React from 'react';
import { Box, TextField, TextFieldProps, Tooltip } from '@mui/material';
import { Controller, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';
import { pidFormatter } from '@/utilities/formatters';
import { Help } from '@mui/icons-material';

type TextFormFieldProps = {
  defaultVal?: string;
  name: string;
  label: string | JSX.Element;
  tooltip?: string;
  numeric?: boolean;
  isPid?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
} & TextFieldProps;

const TextFormField = (props: TextFormFieldProps) => {
  const { control, setValue } = useFormContext();
  const {
    name,
    label,
    rules,
    numeric,
    isPid,
    defaultVal,
    disabled,
    onBlur,
    tooltip,
    ...restProps
  } = props;
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: props.required ? 'Required field.' : undefined, ...rules }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <TextField
            onBlur={(event) => {
              if (numeric && parseFloat(event.currentTarget.value)) {
                setValue(name, parseFloat(event.currentTarget.value));
              }
              if (isPid) {
                setValue(name, event.target.value.replace(/-/g, ''));
                event.target.value = pidFormatter(parseInt(event.target.value.replace(/-/g, '')));
                onChange(event);
              }
              if (onBlur) onBlur(event);
            }}
            onChange={(event) => {
              if (isPid && (event.target.value === '' || /^[0-9-]*$/.test(event.target.value))) {
                onChange(event);
                return;
              } else if (
                numeric &&
                (event.target.value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(event.target.value))
              ) {
                onChange(event);
              } else if (numeric === undefined && isPid === undefined) {
                onChange(event);
                return;
              }
            }}
            value={value ?? defaultVal}
            fullWidth
            label={
              <Box display={'inline-flex'} alignItems={'center'}>
                {`${label} `}
                {tooltip && (
                  <Tooltip title={tooltip}>
                    <Help sx={{ ml: '4px' }} fontSize="small" />
                  </Tooltip>
                )}
              </Box>
            }
            type={'text'}
            error={!!error && !!error.message}
            helperText={error?.message}
            disabled={disabled}
            {...restProps}
          />
        );
      }}
    />
  );
};

export default TextFormField;
