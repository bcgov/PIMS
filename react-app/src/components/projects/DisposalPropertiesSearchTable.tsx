import { Agency } from '@/hooks/api/useAgencyApi';
import { Building, BuildingEvaluation } from '@/hooks/api/useBuildingsApi';
import { Parcel, ParcelEvaluation } from '@/hooks/api/useParcelsApi';
import usePimsApi from '@/hooks/usePimsApi';
import { Delete, Search } from '@mui/icons-material';
import { IconButton, Box, Autocomplete, TextField, InputAdornment, useTheme } from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';

interface IDisposalProjectSearch {
  rows: any[];
  setRows: (a: any[]) => void;
}

export type ParcelWithType = Parcel & {
  Type: string;
};

export type BuildingWithType = Building & {
  Type: string;
};

const DisposalProjectSearch = (props: IDisposalProjectSearch) => {
  const { rows, setRows } = props;
  const [autoCompleteVal, setAutoCompleteVal] = useState(null);
  const [fuzzySearchOptions, setFuzzySearchOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const api = usePimsApi();
  const theme = useTheme();

  const getAutoCompleteLabel = (input: ParcelWithType | BuildingWithType | string) => {
    if (typeof input === 'string') {
      return '';
    }

    if (input.PID) {
      return `${input.Type} - PID: ${input.PID}`;
    } else if (input.PIN) {
      return `${input.Type} - PIN: ${input.PIN}`;
    } else if (input.Address1) {
      return `${input.Type} - Address: ${input.Address1}`;
    } else {
      return `${input.Type} - No identifying info.`;
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'Type',
      headerName: 'Type',
      flex: 1,
      maxWidth: 75,
    },
    {
      field: 'PID_Address',
      headerName: 'PID/Address',
      flex: 1,
      renderCell: (params) => {
        return (
          <Link
            to={`/properties/${params.row.Type.toLowerCase()}/${params.row.Id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.palette.primary.main }}
          >
            {params.row.Type === 'Building' && params.row.Address1
              ? params.row.Address1
              : params.row.PID}
          </Link>
        ) as ReactNode;
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      valueGetter: (value: Agency) => value?.Name ?? 'N/A',
      flex: 1,
    },
    {
      field: 'EvaluationYears',
      headerName: 'Year',
      flex: 1,
      maxWidth: 75,
      valueGetter: (evaluationYears: number[]) => {
        return evaluationYears?.sort((a, b) => b - a)?.[0] ?? 'N/A'; //Sort in reverse order to obtain most recent year.
      },
    },
    {
      field: 'Evaluations',
      headerName: 'Assessed',
      maxWidth: 120,
      valueGetter: (evaluations: ParcelEvaluation[] | BuildingEvaluation[]) => {
        return evaluations?.sort((a, b) => b.Year - a.Year)[0]?.Value ?? 'N/A';
      },
      flex: 1,
    },
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
        ) as ReactNode;
      },
    },
  ];
  return (
    <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
      <Autocomplete
        freeSolo
        loading={loadingOptions}
        clearOnBlur={true}
        blurOnSelect={true}
        options={fuzzySearchOptions}
        onChange={(event, value) => {
          const row = value;
          if (row) {
            setRows([...rows, row]);
            setAutoCompleteVal('');
            setFuzzySearchOptions([]);
          }
        }}
        getOptionLabel={(option) => getAutoCompleteLabel(option)}
        getOptionKey={(option) => option.Id + option.Type}
        onInputChange={(_event, value) => {
          setLoadingOptions(true);
          api.properties.propertiesFuzzySearch(value).then((response) => {
            setLoadingOptions(false);
            setFuzzySearchOptions([
              ...response.Parcels.map((a) => ({
                ...a,
                Type: 'Parcel',
                EvaluationYears: a.Evaluations.map((e) => e.Year),
              })),
              ...response.Buildings.map((a) => ({
                ...a,
                Type: 'Building',
                EvaluationYears: a.Evaluations.map((e) => e.Year),
              })),
            ]);
          });
        }}
        filterOptions={(options) => options.filter((x) => !rows.find((row) => row.Id === x.Id))}
        value={autoCompleteVal}
        renderInput={(params) => (
          <TextField
            {...params}
            onBlur={() => {
              setFuzzySearchOptions([]);
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
      <DataGrid
        getRowId={(row) => row.Id + row.Type}
        autoHeight
        hideFooter
        columns={columns}
        rows={rows}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Box>
  );
};

export default DisposalProjectSearch;
