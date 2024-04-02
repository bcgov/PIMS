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
      rules={{ required: required }}
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
              helperText={formState.errors?.[name] ? 'This field is required.' : undefined}
            />
          )}
          onChange={(_, data) => data && onChange(data)}
          onInputChange={(e, value) => {
            // To allow for other email delimiters
            const key = (e.nativeEvent as InputEvent).data;
            if (';,'.includes(key)) {
              onChange([...getValues()[name], value.trim().substring(0, value.length - 1)]);
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
