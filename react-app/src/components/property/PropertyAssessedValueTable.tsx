import React from 'react';
import { PinnedColumnDataGrid } from '../table/DataTable';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

interface IPropertyAssessedValueTable {
  rows: Record<string, any>[];
  isBuilding: boolean;
  parcelRelatedBuildingsNum: number;
}

const PropertyAssessedValueTable = (props: IPropertyAssessedValueTable) => {
  const { rows, isBuilding, parcelRelatedBuildingsNum } = props;
  const willOverflow = Object.keys(props.rows).length >= 4;
  const assesValCol: GridColDef[] = [
    {
      field: 'Year',
      headerName: 'Year',
      flex: willOverflow ? 0 : 1,
    },
    {
      field: isBuilding ? 'Value' : 'Land',
      headerName: isBuilding ? 'Value' : 'Land',
      flex: willOverflow ? 0 : 1,
    },
    ...[...Array(parcelRelatedBuildingsNum).keys()].map(
      (idx): GridColDef => ({
        field: `Building${idx + 1}`,
        headerName: `Building (${idx + 1})`,
        flex: willOverflow ? 0 : 1,
        valueGetter: (params) => (params.value ? params.value : 'N/A'),
      }),
    ),
  ];

  if (!rows.length) {
    return (
      <Box display={'flex'} justifyContent={'center'}>
        <Typography>No assessed values recorded.</Typography>
      </Box>
    );
  }

  return willOverflow ? (
    <PinnedColumnDataGrid
      hideFooter
      getRowId={(row) => row.Year}
      pinnedFields={['Year', 'Land']}
      columns={assesValCol}
      rows={rows}
      scrollableSxProps={{
        borderStyle: 'none',
        '& .MuiDataGrid-columnHeaders': {
          borderBottom: 'none',
        },
        '& div div div div >.MuiDataGrid-cell': {
          borderBottom: 'none',
          borderTop: '1px solid rgba(224, 224, 224, 1)',
        },
      }}
      pinnedSxProps={{
        borderStyle: 'none',
        '& .MuiDataGrid-columnHeaders': {
          borderBottom: 'none',
        },
        '& div div div div >.MuiDataGrid-cell': {
          borderBottom: 'none',
        },
      }}
    />
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
      columns={assesValCol}
      rows={rows}
      getRowId={(row) => row.Year}
    />
  );
};

export default PropertyAssessedValueTable;
