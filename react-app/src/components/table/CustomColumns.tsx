import React from 'react';
import {
  useGridApiContext,
  GridRenderEditCellParams,
  GRID_DATE_COL_DEF,
  GridColTypeDef,
  GridFilterInputValueProps,
  getGridDateOperators,
} from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { TextFieldProps } from '@mui/material/TextField';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

/**
 * `date` column
 */

export const dateColumnType: GridColTypeDef<Date, string> = {
  ...GRID_DATE_COL_DEF,
  resizable: false,
  renderEditCell: (params) => {
    return <GridEditDateCell {...params} />;
  },
  filterOperators: getGridDateOperators(false).map((item) => ({
    ...item,
    InputComponent: GridFilterDateInput,
    InputComponentProps: { showTime: false },
  })),
  valueFormatter: (value) => {
    if (value) {
      return dayjs(value).toString();
    }
    return '';
  },
};

const GridEditDateInput = styled(InputBase)({
  fontSize: 'inherit',
  padding: '0 9px',
});

function WrappedGridEditDateInput(props: TextFieldProps) {
  const { InputProps, ...other } = props;
  return <GridEditDateInput fullWidth {...InputProps} {...(other as InputBaseProps)} />;
}

function GridEditDateCell({
  id,
  field,
  value,
  colDef,
}: GridRenderEditCellParams<any, Date | null, string>) {
  const apiRef = useGridApiContext();

  const Component = colDef.type === 'dateTime' ? DateTimePicker : DatePicker;

  const handleChange = (newValue: unknown) => {
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component
        value={dayjs(value)}
        autoFocus
        onChange={handleChange}
        slots={{ textField: WrappedGridEditDateInput }}
      />
    </LocalizationProvider>
  );
}

function GridFilterDateInput(props: GridFilterInputValueProps & { showTime?: boolean }) {
  const { item, showTime, applyValue, apiRef } = props;

  const Component = showTime ? DateTimePicker : DatePicker;

  const handleFilterChange = (newValue: unknown) => {
    applyValue({ ...item, value: newValue });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component
        value={item.value ? dayjs(item.value) : null}
        autoFocus
        label={apiRef.current.getLocaleText('filterPanelInputLabel')}
        slotProps={{
          textField: {
            variant: 'standard',
          },
          inputAdornment: {
            sx: {
              '& .MuiButtonBase-root': {
                marginRight: -1,
              },
            },
          },
        }}
        onChange={handleFilterChange}
      />
    </LocalizationProvider>
  );
}
