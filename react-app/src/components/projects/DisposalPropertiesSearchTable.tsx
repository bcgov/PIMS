import { Agency } from '@/hooks/api/useAgencyApi';
import { Building, BuildingEvaluation } from '@/hooks/api/useBuildingsApi';
import { Parcel, ParcelEvaluation } from '@/hooks/api/useParcelsApi';
import usePimsApi from '@/hooks/usePimsApi';
import { Delete, Search } from '@mui/icons-material';
import {
  IconButton,
  Box,
  Autocomplete,
  TextField,
  InputAdornment,
  useTheme,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Grid,
} from '@mui/material';
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';
import { formatMoney, pidFormatter } from '@/utilities/formatters';
import { ClassificationIcon } from '@/components/property/ClassificationIcon';
import { useClassificationStyle } from '@/components/property/PropertyTable';

interface IDisposalProjectSearch {
  rows: any[];
  setRows: (a: any[]) => void;
}

export type PropertyWithType = (Parcel | Building) & {
  Type: 'Parcel' | 'Building';
  EvaluationYears: number[];
};

const DisposalProjectSearch = (props: IDisposalProjectSearch) => {
  const { rows, setRows } = props;
  const [autoCompleteVal, setAutoCompleteVal] = useState(null);
  const [fuzzySearchOptions, setFuzzySearchOptions] = useState<Array<PropertyWithType>>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const api = usePimsApi();
  const theme = useTheme();
  const classification = useClassificationStyle();

  const getPidPinLabel = (input: PropertyWithType | string) => {
    if (typeof input === 'string') {
      return '';
    }

    if (input.PID) {
      return `PID: ${pidFormatter(input.PID)}`;
    } else if (input.PIN) {
      return `PIN: ${input.PIN}`;
    } else {
      return `No PID/PIN.`;
    }
  };

  const getAddressLabel = (input: PropertyWithType) => {
    const address = [];
    if (input.Address1) {
      address.push(input.Address1);
    }
    if (input.AdministrativeArea) {
      address.push(input.AdministrativeArea.Name);
    }
    return address.join(', ');
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
            to={`/properties/${params.row.Type?.toLowerCase()}/${params.row.Id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.palette.primary.main }}
          >
            {params.row.Type === 'Building' && params.row.Address1
              ? params.row.Address1
              : pidFormatter(params.row.PID)}
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
      valueFormatter: formatMoney,
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
        getOptionLabel={() => ''} // No label, because field should clear on select.
        renderOption={(props, option: PropertyWithType) => {
          const classificationColour =
            option.ClassificationId != null
              ? classification[option.ClassificationId].textColor
              : theme.palette.black.main;
          return (
            <ListItem {...props} key={`${option.Id},${option.PropertyTypeId}`}>
              <Grid container>
                <Grid item xs={1} pt={1} mr={1}>
                  <ListItemAvatar>
                    <ClassificationIcon
                      iconType={option.Type.toLowerCase() as 'building' | 'parcel'}
                      textColor={theme.palette.text.primary}
                      badgeColor={classificationColour}
                      scale={1.2}
                      badgeScale={1}
                    />
                  </ListItemAvatar>
                </Grid>
                <Grid item xs={5}>
                  <ListItemText
                    primary={getPidPinLabel(option)}
                    secondary={getAddressLabel(option)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <ListItemText
                    primary={option.Agency?.Name ?? 'No Agency'}
                    secondary={option.Name && option.Name !== '' ? option.Name : 'No Name'}
                  />
                </Grid>
              </Grid>
            </ListItem>
          );
        }}
        getOptionKey={(option) => option.Id + option.Type}
        onInputChange={(_event, value) => {
          setLoadingOptions(true);
          api.properties.propertiesFuzzySearch(value).then((response) => {
            setLoadingOptions(false);
            setFuzzySearchOptions([
              ...response.Parcels?.map((a) => ({
                ...a,
                Type: 'Parcel' as const,
                EvaluationYears: a.Evaluations?.map((e) => e.Year),
              })),
              ...response.Buildings?.map((a) => ({
                ...a,
                Type: 'Building' as const,
                EvaluationYears: a.Evaluations?.map((e) => e.Year),
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
