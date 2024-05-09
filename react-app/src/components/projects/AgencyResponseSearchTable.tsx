import React from 'react';
import { Building } from '@/hooks/api/useBuildingsApi';
import { Parcel } from '@/hooks/api/useParcelsApi';
import { Search } from '@mui/icons-material';
import {
  Box,
  Autocomplete,
  TextField,
  InputAdornment,
  Chip,
  autocompleteClasses,
  SxProps,
} from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import useGroupedAgenciesApi from '@/hooks/api/useGroupedAgenciesApi';

interface IAgencySearchTable {
  rows: any[];
  setRows: (a: any[]) => void;
}

export type ParcelWithType = Parcel & {
  Type: string;
};

export type BuildingWithType = Building & {
  Type: string;
};

interface IAgencySimpleTable {
  rows: any[];
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
      columns={columns}
      sx={props.sx}
      rows={props.rows}
    />
  );
};

const AgencySearchTable = (props: IAgencySearchTable) => {
  const { rows, setRows } = props;
  const [autoCompleteVal, setAutoCompleteVal] = useState(null);
  const { agencyOptions, ungroupedAgencies } = useGroupedAgenciesApi();

  return (
    <Box display={'flex'} minWidth={'700px'} flexDirection={'column'} gap={'1rem'}>
      <Autocomplete
        clearOnBlur={true}
        blurOnSelect={true}
        options={agencyOptions}
        onChange={(event, data) => {
          const row = ungroupedAgencies.find((a) => a.Id === data.value);
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
      <AgencySimpleTable rows={rows} />
    </Box>
  );
};

export default AgencySearchTable;
