import React, { useState } from 'react';
import { Autocomplete, SxProps, TextField, Paper, Chip } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface EmailChipFormFieldProps {
  name: string;
  label: string;
  sx?: SxProps;
  required?: boolean;
}

const CustomPaper = (props) => {
  return <Paper elevation={4} {...props} />;
};

const EmailChipFormField = (props: EmailChipFormFieldProps) => {
  const { control, getValues, formState } = useFormContext();
  const { name, label, sx, required, ...rest } = props;
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: { value: required, message: 'Required field.' },
        validate: (value: string[]) => {
          if (
            value.some(
              (email) =>
                !email.match(
                  // eslint-disable-next-line no-useless-escape
                  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                ),
            )
          ) {
            return 'Emails must be valid addresses.';
          }
          return true;
        },
      }}
      render={({ field: { onChange } }) => (
        <Autocomplete
          multiple
          freeSolo={true}
          disablePortal={false}
          id={`emailchipinput-${label}`}
          options={[]}
          PaperComponent={CustomPaper}
          sx={sx}
          fullWidth
          disableClearable={true}
          getOptionLabel={(option: string) => option}
          renderTags={(emails, props) => {
            return emails.map((email, index) => (
              <Chip key={email} label={email} variant="outlined" {...props({ index })} />
            ));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!formState.errors?.[name]}
              required={required}
              label={label}
              helperText={(formState.errors?.[name]?.message as string) ?? undefined}
            />
          )}
          onBlur={(e) => {
            // When they enter an email but forget to "chip it"
            const { value } = e.target as HTMLInputElement;
            if (value.length > 7) { // Minimum for valid email
              onChange([...getValues()[name], value.trim()]);
            }
            setInputValue('');
          }}
          onChange={(_, data) => data && onChange(data)}
          onInputChange={(e, value) => {
            // To allow for other email delimiters
            const key = (e.nativeEvent as InputEvent).data;
            if (';,'.includes(key)) {
              // Don't include just a blank chip
              if (value.length > 1) {
                onChange([...getValues()[name], value.trim().substring(0, value.length - 1)]);
              }
              setInputValue('');
            } else {
              setInputValue(value.trim());
            }
          }}
          value={getValues()[name]}
          inputValue={inputValue}
          {...rest}
        />
      )}
    />
  );
};

export default EmailChipFormField;
