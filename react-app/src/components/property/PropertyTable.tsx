import React from 'react';
import { FilterSearchDataGrid } from '../table/DataTable';
import { Box, SxProps } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { CheckBox } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { dateFormatter } from '@/utils/formatters';

const PropertyTable = () => {
  const columns: GridColDef[] = [
    {
      field: 'PID',
      headerName: 'PID',
      flex: 1,
    },
    {
      field: 'ClassificationId',
      headerName: 'Classification',
      flex: 1,
    },
    {
      field: 'AgencyId',
      headerName: 'Agency',
      flex: 1,
    },
    {
      field: 'Address1',
      headerName: 'Main Address',
      flex: 1,
    },
    {
      field: 'ProjectNumbers', // right field??
      headerName: 'Title Number',
      flex: 1,
    },
    {
      field: 'Corporation',
      headerName: 'Corporation',
      flex: 1,
    },
    {
      field: 'Ownership',
      headerName: 'Ownership',
      flex: 1,
    },
    {
      field: 'IsSensitive',
      headerName: 'Sensitive',
      renderCell: (params) => {
        if (params.value) {
          return <CheckBox />;
        } else return <></>;
      },
      flex: 1,
    },
    {
      field: 'UpdatedOn',
      headerName: 'Last Update',
      flex: 1,
      valueFormatter: (params) => dateFormatter(params.value),
    },
  ];

  const buildings1 = [
    {
      Id: 1,
      ClassificationId: 0,
    },
    {
      Id: 2,
      ClassificationId: 1,
    },
    {
      Id: 3,
      ClassificationId: 2,
    },
  ];

  const buildings2 = [
    {
      Id: 4,
      ClassificationId: 3,
    },
    {
      Id: 5,
      ClassificationId: 4,
    },
    {
      Id: 6,
      ClassificationId: 5,
    },
  ];

  const rows = [
    {
      Id: 1,
      PID: '010-113-1332',
      ClassificationId: 1,
      AgencyId: 1,
      Address1: '1450 Whenever Pl',
      ProjectNumbers: 'FX1234',
      Corporation: 'asdasda',
      Ownership: 'BC Gov',
      IsSensitive: true,
      UpdatedOn: new Date(),
      Buildings: buildings1,
    },
    {
      Id: 2,
      PID: '330-11-4335',
      ClassificationId: 2,
      AgencyId: 2,
      Address1: '1143 Bigapple Rd',
      ProjectNumbers: 'FX121a4',
      Corporation: 'Big Corp',
      Ownership: 'BC Gov',
      IsSensitive: false,
      UpdatedOn: new Date(),
      Buildings: buildings2,
    },
  ];

  return (
    <Box
      sx={
        {
          padding: '24px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        } as SxProps
      }
    >
      <FilterSearchDataGrid
        onPresetFilterChange={(value: string, ref: React.MutableRefObject<GridApiCommunity>) => {
          console.log('value changed');
        }}
        getRowId={(row) => row.Id}
        defaultFilter={'All Properties'}
        presetFilterSelectOptions={[]}
        tableHeader={'Properties Overview'}
        excelTitle={'Properties'}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
};

export default PropertyTable;
