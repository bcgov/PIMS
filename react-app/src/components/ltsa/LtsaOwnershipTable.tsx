import { Box, Chip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

interface IOwnershipRowProps {
  rows: {
    jointTenancyIndication: boolean;
    interestFractionNumerator: string;
    interestFractionDenominator: string;
    titleOwners: {
      lastNameOrCorpName1: string;
      givenName: string;
      incorporationNumber: string;
    }[];
  }[];
}

const LtsaOwnershipTable = (props: IOwnershipRowProps) => {
  const { rows } = props;
  const getPercentage = (numerator: string, denominator: string) => {
    const value = (parseInt(numerator) / parseInt(denominator)) * 100;
    // If it's a whole number, just return it. Otherwise, crop to 2 decimal places
    return value % 1 === 0 ? value : value.toFixed(2);
  };
  const newRows = rows?.map((row, index) => ({
    ...row,
    ownershipPercentage: getPercentage(
      row.interestFractionNumerator,
      row.interestFractionDenominator,
    ),
    ownerNames: row.titleOwners.map((owner) => `${owner.lastNameOrCorpName1}, ${owner.givenName}`),
    incorporationNumbers: row.titleOwners.map((owner) => owner.incorporationNumber),
    id: index,
  }));

  const renderOwnerNamesCell = (params: GridRenderCellParams) => (
    <Box>
      {params.value.map((ownerName: string, index: number) => (
        <Chip key={index} label={ownerName} style={{ marginRight: '5px' }} />
      ))}
    </Box>
  );

  const renderIncorporationNumbersCell = (params: GridRenderCellParams) => {
    const { value } = params;
    if (Array.isArray(value) && value.length > 0 && value.every((val) => val.trim() !== '')) {
      return value.join('; ');
    }
    return '';
  };

  const columns: GridColDef[] = [
    {
      field: 'ownershipPercentage',
      headerName: 'Ownership %',
      width: 150,
    },
    {
      field: 'ownerNames',
      headerName: 'Owner(s) / Corporation(s)',
      renderCell: renderOwnerNamesCell,
      width: 700,
    },
    {
      field: 'incorporationNumbers',
      headerName: 'Incorporation #',
      renderCell: renderIncorporationNumbersCell,
      width: 250,
    },
  ];

  if (!rows) return <></>;

  return !rows.length ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No available ownership information.</Typography>
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
      getRowId={(row) => row.id}
      columns={columns}
      rows={newRows ?? []}
    />
  );
};

export default LtsaOwnershipTable;
