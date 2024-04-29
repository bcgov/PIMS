import { dateFormatter } from '@/utilities/formatters';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface IPropertyNetValueTable {
  rows: Record<string, any>[];
}

const PropertyNetValueTable = (props: IPropertyNetValueTable) => {
  const columns: GridColDef[] = [
    {
      field: 'FiscalYear',
      headerName: 'Year',
    },
    {
      field: 'EffectiveDate',
      headerName: 'Effective Date',
      flex: 1,
      renderCell: (params) => (params.value ? dateFormatter(params.value) : 'Not provided'),
    },
    {
      field: 'Value',
      headerName: 'Net Book Value',
      flex: 1,
    },
  ];

  if (!props.rows) return <></>;

  return !props.rows.length ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No net book values recorded.</Typography>
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
      getRowId={(row) => row.FiscalYear}
      columns={columns}
      rows={props.rows ?? []}
    />
  );
};

export default PropertyNetValueTable;
