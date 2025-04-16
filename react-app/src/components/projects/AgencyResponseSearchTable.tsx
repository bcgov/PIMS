import React from 'react';
import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import { Delete, Search } from '@mui/icons-material';
import {
  Box,
  Autocomplete,
  TextField,
  InputAdornment,
  autocompleteClasses,
  SxProps,
  IconButton,
  useTheme,
} from '@mui/material';
import { GridColDef, DataGrid, DataGridProps } from '@mui/x-data-grid';
import { useState } from 'react';
import { ISelectMenuItem } from '../form/SelectFormField';
import { Agency } from '@/hooks/api/useAgencyApi';
import { dateFormatter } from '@/utilities/formatters';
import { AgencyResponseType } from '@/constants/agencyResponseTypes';
import { enumReverseLookup } from '@/utilities/helperFunctions';

interface IAgencySearchTable {
  rows: any[];
  setRows: (a: any[]) => void;
  options: ISelectMenuItem[];
  agencies: Agency[];
}

export type ParcelWithType = Parcel & {
  Type: string;
};

export type BuildingWithType = Building & {
  Type: string;
};

interface IAgencySimpleTable {
  rows: Array<Agency & { ReceivedOn: Date; Note: string }>;
  additionalColumns?: GridColDef[];
  sx?: SxProps;
  dataGridProps?: Omit<DataGridProps, 'columns'>;
  editMode: boolean;
}

export const AgencySimpleTable = (props: IAgencySimpleTable) => {
  const theme = useTheme();
  const edit = props.editMode;
  const columns: GridColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'ReceivedOn',
      headerName: 'Received On',
      width: 150,
      editable: edit,
      type: 'date',
      valueGetter: (value) => (value == null ? null : new Date(value)),
      renderCell: (params) =>
        params.value ? (
          dateFormatter(params.value)
        ) : (
          <Box sx={{ color: theme.palette.gray.main }}>{edit ? 'Double click / Enter' : 'N/A'}</Box>
        ),
    },
    {
      field: 'Note',
      headerName: 'Note',
      flex: 1,
      editable: edit,
      type: 'string',
      renderCell: (params) =>
        params.value ? (
          params.value
        ) : (
          <Box sx={{ color: theme.palette.gray.main }}>{edit ? 'Double click / Enter' : 'N/A'}</Box>
        ),
    },
    {
      field: 'Response',
      headerName: 'Response',
      flex: 1,
      editable: edit,
      type: 'singleSelect',
      valueOptions: Object.keys(AgencyResponseType).filter((key) => isNaN(Number(key))),
    },
  ];
  return (
    <DataGrid
      getRowId={(row) => row.Id}
      autoHeight
      hideFooter
      disableRowSelectionOnClick
      columns={[...columns, ...(props.additionalColumns ?? [])]}
      sx={{
        ...props.sx,
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'transparent',
        },
      }}
      rows={props.rows}
      {...props.dataGridProps}
    />
  );
};

const AgencySearchTable = (props: IAgencySearchTable) => {
  const { rows, setRows, agencies, options } = props;
  const [autoCompleteVal, setAutoCompleteVal] = useState(null);

  return (
    <Box display={'flex'} minWidth={'700px'} flexDirection={'column'} gap={'1rem'}>
      <Autocomplete
        clearOnBlur={true}
        blurOnSelect={true}
        options={options}
        filterOptions={(options, state) =>
          options.filter(
            (x) =>
              !rows.find((row) => row.Id === x.value) &&
              x.sendEmail &&
              x.label.toLowerCase().includes(state.inputValue.toLowerCase()),
          )
        }
        onChange={(event, data) => {
          const row = {
            ...agencies.find((a) => a.Id === data?.value),
            Response: enumReverseLookup(AgencyResponseType, AgencyResponseType.Unsubscribe),
          };
          if (row) {
            setRows([...rows, row]);
            setAutoCompleteVal(null);
          }
        }}
        noOptionsText={'Agencies must have Sent Email checked and an email set to appear here.'}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderOption={(props, option, state, ownerState) => (
          <Box
            sx={{
              fontWeight: option.parent ? 900 : 500,
              [`&.${autocompleteClasses.option}`]: {
                padding: 1,
                paddingLeft: !option.parent ? 2 : 1,
              },
            }}
            component="li"
            {...props}
            key={option.value}
          >
            {ownerState.getOptionLabel(option)}
          </Box>
        )}
        value={autoCompleteVal}
        renderInput={(params) => (
          <TextField
            {...params}
            onBlur={() => {
              setAutoCompleteVal(null);
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            label={'Search by any keyword...'}
          />
        )}
      />
      <AgencySimpleTable
        editMode={true}
        additionalColumns={[
          {
            field: 'Actions',
            headerName: '',
            flex: 1,
            maxWidth: 60,
            renderCell: (params) => {
              return (
                <IconButton
                  onClick={() => {
                    const index = rows.findIndex((x) => x.Id === params.row.Id);
                    if (index != null) {
                      setRows([...rows.slice(0, index), ...rows.slice(index + 1)]);
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              );
            },
          },
        ]}
        rows={rows}
        dataGridProps={{
          processRowUpdate: (newRow) => {
            setRows(rows.map((row) => (row.Id === newRow.Id ? newRow : row)));
            return newRow;
          },
          onProcessRowUpdateError: (error) => console.log(error),
        }}
      />
    </Box>
  );
};

export default AgencySearchTable;
