import { dateFormatter } from '@/utils/formatters';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

const ParcelNetValueTable = () => {
  const columns: GridColDef[] = [
    {
      field: 'FiscalYear',
      headerName: 'Year',
    },
    {
      field: 'EffectiveDate',
      headerName: 'Effective Date',
      flex: 1,
    },
    {
      field: 'Value',
      headerName: 'Net Book Value',
      flex: 1,
    },
  ];

  const testData = [
    {
      FiscalYear: '24/23',
      EffectiveDate: dateFormatter(new Date()),
      Value: '$34000000',
    },
    {
      FiscalYear: '23/22',
      EffectiveDate: dateFormatter(new Date()),
      Value: '$145000000',
    },
  ];

  return (
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
      rows={testData}
    />
  );
};

export default ParcelNetValueTable;
