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
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      flex: 1,
    },
    {
      field: 'FiscalYear',
      headerName: 'Year',
      flex: 1,
    },
    {
      field: 'AssessedValue',
      headerName: 'Assessed',
      flex: 1,
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
      getRowId={(row) => row.PropertyType}
      columns={columns}
      rows={props.rows ?? []}
    />
  );
};

export default DisposalPropertiesTable;
