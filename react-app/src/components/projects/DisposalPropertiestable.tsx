import { Agency } from '@/hooks/api/useAgencyApi';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface IDisposalPropertiesTable {
  rows: Record<string, any>[];
}

const DisposalPropertiesTable = (props: IDisposalPropertiesTable) => {
  const columns: GridColDef[] = [
    {
      field: 'PropertyType',
      headerName: 'Type',
    },
    {
      field: 'PID/Address',
      headerName: 'PID/Address',
      flex: 1,
      valueGetter: (value, row) => row.PID ?? row.PIN ?? row.Address1,
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
      }
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
      }}
      hideFooter
      getRowId={(row) => row.Id + row.PropertyType}
      columns={columns}
      rows={props.rows ?? []}
    />
  );
};

export default DisposalPropertiesTable;
