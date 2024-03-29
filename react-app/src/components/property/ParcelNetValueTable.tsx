import { dateFormatter, formatMoney } from '@/utils/formatters';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface IParcelNetValueTable {
  rows: Record<string, any>[];
}

const ParcelNetValueTable = (props: IParcelNetValueTable) => {
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
      valueFormatter: (params) => formatMoney(params.value),
    },
  ];

  if (!props.rows) return <></>;

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
      rows={props.rows ?? []}
    />
  );
};

export default ParcelNetValueTable;
