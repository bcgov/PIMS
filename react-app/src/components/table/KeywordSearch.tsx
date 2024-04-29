import { SxProps, TextField, InputAdornment, useTheme } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

/**
 * @interface
 * @description Props for the KeywordSearch field.
 * @prop {Function} onChange (Optional) Function to run when value of field changes.
 * @prop {[string, Dispatch<SetStateAction<string>>]} optionalExternalState (Optional) An external state getter and setter for field value. Component also contains internal state if that suffices.
 */
interface IKeywordSearchProps {
  onChange?: Function;
  optionalExternalState?: [string, Dispatch<SetStateAction<string>>];
}

/**
 * @description Input field that is a search icon when minimized but can be expanded upon click.
 * @param props Properties passed to the component.
 */
const KeywordSearch = (props: IKeywordSearchProps) => {
  const { onChange, optionalExternalState } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fieldContents, setFieldContents] = optionalExternalState
    ? optionalExternalState
    : useState<string>('');
  const theme = useTheme();

  // To reopen field when state restored from cookie
  useEffect(() => {
    if (fieldContents) setIsOpen(true);
  }, [fieldContents]);

  // Style shared when both open and closed
  const commonStyle: SxProps = {
    fontSize: theme.typography.fontWeightBold,
    fontFamily: theme.typography.fontFamily,
    padding: '5px',
    marginBottom: '1px',
    boxSizing: 'content-box',
    borderRadius: '5px',
  };

  // Style when open
  const openStyle: SxProps = {
    ...commonStyle,
    width: '240px',
    transition: 'width 0.3s ease-in, border 1s',
    border: `1.5px solid ${theme.palette.grey[400]}`,
    '&:focus-within': {
      border: '1.5px solid black',
    },
  };

  // Style when closed
  const closedStyle: SxProps = {
    ...commonStyle,
    width: '32px',
    transition: 'width 0.3s ease-in, border 1s',
    border: '1.5px solid transparent',
    '&:hover': {
      cursor: 'default',
    },
  };
  return (
    <TextField
      id="keyword-search"
      variant="standard"
      sx={isOpen ? openStyle : closedStyle}
      size="small"
      style={{ fontSize: '5em' }}
      placeholder="Search..."
      value={fieldContents}
      onChange={(e) => {
        setFieldContents(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      InputProps={{
        disableUnderline: true,
        sx: { cursor: 'default' },
        endAdornment: (
          <InputAdornment position={'end'}>
            {fieldContents ? (
              <CloseIcon
                onClick={() => {
                  // Clear text and filter
                  setFieldContents('');
                  if (onChange) onChange('');
                  document.getElementById('keyword-search').focus();
                }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            ) : (
              <SearchIcon
                onClick={() => {
                  setIsOpen(!isOpen);
                  document.getElementById('keyword-search').focus();
                }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default KeywordSearch;
