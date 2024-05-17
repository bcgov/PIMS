import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface IChargeRowProps {
  rows: {
    chargeNumber: string;
    status: string;
    enteredDate: string;
    interAlia: string;
    chargeRemarks: string;
    charge: {
      chargeNumber: string;
      transactionType: string;
      applicationReceivedDate: string;
      chargeOwnershipGroups: {
        jointTenancyIndication: boolean;
        interestFractionNumerator: string;
        interestFractionDenominator: string;
        ownershipRemarks: string;
        chargeOwners: {
          lastNameOrCorpName1: string;
          incorporationNumber: string;
        }[];
      }[];
      certificatesOfCharge: [];
      correctionsAltos1: [];
      corrections: [];
    };
    chargeRelease: object;
  }[];
}

const LtsaChargeTable = (props: IChargeRowProps) => {
  const { rows } = props;
  const newRows = rows?.map((row, index) => ({
    ...row,
    enteredDate: new Date(row.enteredDate).toLocaleDateString(),
    applicationReceivedDate: new Date(row.charge.applicationReceivedDate).toLocaleDateString(),
    id: index,
  }));
  const columns: GridColDef[] = [
    {
      field: 'chargeNumber',
      headerName: 'Charge#',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'enteredDate',
      headerName: 'Entered Date',
      width: 350,
    },
    {
      field: 'applicationReceivedDate',
      headerName: 'Received Date',
      width: 350,
    },
    {
      field: 'transactionType',
      headerName: 'Transaction Type',
      width: 200,
    },
    // {
    //   field: 'chargeRemarks',
    //   headerName: 'Remarks',
    // },
  ];
  if (!rows) return <></>;

  return !rows.length ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No available charges information.</Typography>
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
      rows={newRows ?? []}
    />
  );
};

export default LtsaChargeTable;
