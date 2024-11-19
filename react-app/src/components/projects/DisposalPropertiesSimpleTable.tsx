import { PropertyTypes } from '@/constants/propertyTypes';
import { Agency } from '@/hooks/api/useAgencyApi';
import { formatMoney, pidFormatter } from '@/utilities/formatters';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { Link } from 'react-router-dom';

interface IDisposalPropertiesTable {
  rows: Record<string, any>[];
}

const DisposalPropertiesTable = (props: IDisposalPropertiesTable) => {
  const theme = useTheme();
  const columns: GridColDef[] = [
    {
      field: 'PropertyType',
      headerName: 'Type',
    },
    {
      field: 'PID/Address',
      headerName: 'PID/Address',
      flex: 1,
      valueGetter: (value, row) =>
        row.PropertyTypeId === PropertyTypes.BUILDING && row.Address1
          ? row.Address1
          : pidFormatter(row.PID) ?? row.PIN,
      renderCell: (params: GridCellParams) => {
        const urlType = params.row.PropertyTypeId === 0 ? 'parcel' : 'building';
        return (
          <Link
            to={`/properties/${urlType}/${params.row.Id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
          >
            {String(params.value)}
          </Link>
        );
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
      valueGetter: (value: Agency) => value.Name,
    },
    {
      field: 'FiscalYear',
      headerName: 'Year',
      flex: 1,
      valueGetter: (value, row) => {
        return row.Fiscals?.map((a) => a.FiscalYear)?.sort((a, b) => b - a)?.[0] ?? 'N/A'; //Sort in reverse order to obtain most recent year.
      },
    },
    {
      field: 'AssessedValue',
      headerName: 'Assessed',
      flex: 1,
      valueGetter: (value, row) => {
        return row.Evaluations?.sort((a, b) => b.Year - a.Year)?.[0]?.Value ?? 'N/A';
      },
      valueFormatter: formatMoney,
    },
  ];

  if (!props.rows) return <></>;

  return !props.rows.length ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No properties selected .</Typography>
    </Box>
  ) : (
    <DataGrid
      sx={{
        borderStyle: 'none',
        '& .MuiDataGrid-columnHeaders': {
          borderBottom: 'none',
        },
        '& div div div div >.MuiDataGrid-cell': {
          borderBottom: 'none',
          borderTop: '1px solid rgba(224, 224, 224, 1)',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: 'transparent',
        },
      }}
      disableRowSelectionOnClick
      hideFooter
      getRowId={(row) => row.Id + row.PropertyType}
      columns={columns}
      rows={props.rows ?? []}
    />
  );
};

export default DisposalPropertiesTable;
