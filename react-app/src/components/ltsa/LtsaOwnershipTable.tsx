import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface IOwnershipRowProps {
  row: {
    length: number;
    rows: any[];
    jointTenancyIndication: boolean;
    interestFractionNumerator: string;
    interestFractionDenominator: string;
    titleOwners: {
      lastNameOrCorpName1: string;
      givenName: string;
      incorporationNumber: string;
    }[];
  };
  // index: number;
}

const LtsaOwnershipTable = (props: IOwnershipRowProps) => {
  const { row } = props;
  const getPercentage = (numerator: string, denominator: string) => {
    const value = (parseInt(numerator) / parseInt(denominator)) * 100;
    // If it's a whole number, just return it. Otherwise, crop to 2 decimal places
    return value % 1 === 0 ? value : value.toFixed(2);
  };
  const columns: GridColDef[] = [
    {
      field: 'ownershipPercentage',
      headerName: 'Ownership %',
      valueGetter: () =>
        getPercentage(row.interestFractionNumerator, row.interestFractionDenominator).toString(),
    },
    {
      field: 'ownerName',
      headerName: 'Owner(s) / Corporation(s)',
      valueGetter: () =>
        row.titleOwners
          .map((owner) => `${owner.lastNameOrCorpName1}, ${owner.givenName}`)
          .join('; '),
    },
    {
      field: 'incorporationNumber',
      headerName: 'Incorporation #',
      valueGetter: () => row.titleOwners.map((owner) => owner.incorporationNumber),
    },
  ];

  if (!props.row) return <></>;

  return !props.row.length ? (
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
      getRowId={(row) => row.Id}
      columns={columns}
      rows={row.rows ?? []}
    />
  );
};

export default LtsaOwnershipTable;
