import React from 'react';
import { SxProps, Typography, Box, useTheme, Switch } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface ToggleSwitchProps {
  name: string;
  label: string;
  sx?: SxProps;
  required?: boolean;
}

const ToggleSwitch = (props: ToggleSwitchProps) => {
  const { control } = useFormContext();
  const theme = useTheme();
  const { name, label, required } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate: (value) => !required || value || 'Required field.' }}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Switch
              id={`single-checkbox-${name}`}
              onChange={(_, data) => onChange(data)}
              onBlur={onBlur}
              checked={!!value}
              required={required}
            />
            <Typography>
              {label} {required ? <sup>{'*'}</sup> : <></>}
            </Typography>
          </Box>
          {!!error && !!error.message ? (
            <Box>
              <Typography ml={'3.2em'} fontSize={'smaller'} color={theme.palette.error.main}>
                {error.message}
              </Typography>
            </Box>
          ) : (
            <></>
          )}
        </>
      )}
    />
  );
};

export default ToggleSwitch;
