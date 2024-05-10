import React from 'react';
import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import { Delete, Search } from '@mui/icons-material';
import {
  Box,
  Autocomplete,
  TextField,
  InputAdornment,
  Chip,
  autocompleteClasses,
  SxProps,
  IconButton,
} from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { ISelectMenuItem } from '../form/SelectFormField';
import { Agency } from '@/hooks/api/useAgencyApi';

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
  rows: any[];
  additionalColumns?: GridColDef[];
  sx?: SxProps;
}

export const AgencySimpleTable = (props: IAgencySimpleTable) => {
  const columns: GridColDef[] = [
    {
      field: 'Name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'Code',
      headerName: 'Short Name',
      flex: 1,
      maxWidth: 150,
    },
    {
      field: 'SendEmail',
      headerName: 'Notification',
      flex: 1,
      valueFormatter: (value: boolean) => (value ? 'Yes' : 'No'),
      maxWidth: 120,
    },
    {
      field: 'Email',
      headerName: 'Send To',
      flex: 1,
      maxWidth: 250,
      renderCell: (params) =>
        params.value
          ?.split(';')
          .map((email) =>
            email ? (
              <Chip
                title={email}
                key={email}
                label={email}
                variant="outlined"
                sx={{ marginRight: '5px' }}
              />
            ) : (
              ''
            ),
          ),
    },
  ];
  return (
    <DataGrid
      getRowId={(row) => row.Id}
      autoHeight
      hideFooter
      columns={[...columns, ...(props.additionalColumns ?? [])]}
      sx={props.sx}
      rows={props.rows}
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
        filterOptions={(options) => options.filter((x) => !rows.find((row) => row.Id === x.value))}
        onChange={(event, data) => {
          const row = agencies.find((a) => a.Id === data.value);
          if (row) {
            setRows([...rows, row]);
            setAutoCompleteVal('');
          }
        }}
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
          >
            {ownerState.getOptionLabel(option)}
          </Box>
        )}
        value={autoCompleteVal}
        renderInput={(params) => (
          <TextField
            {...params}
            onBlur={() => {
              setAutoCompleteVal('');
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
      />
    </Box>
  );
};

export default AgencySearchTable;
