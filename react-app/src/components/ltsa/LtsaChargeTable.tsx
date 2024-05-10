import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

interface IChargeRowProps {
  length: any;
  row: {
    rows: Record<string, any>[];
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
  };
  index: number;
}

const LtsaChargeTable = (props: IChargeRowProps) => {
  const { row } = props;
  const columns: GridColDef[] = [
    {
      field: 'ChargeNumber',
      headerName: 'Charge#',
      valueGetter: () => `${row.chargeNumber}`,
    },
    {
      field: 'Status',
      headerName: 'Status',
      valueGetter: () => `${row.status}`,
    },
    {
      field: 'Entered Date',
      headerName: 'Entered Date',
      valueGetter: () => new Date(`${row.enteredDate}`).toLocaleDateString(),
    },
    {
      field: 'Received Date',
      headerName: 'Received Date',
      valueGetter: () => new Date(`${row.charge.applicationReceivedDate}`).toLocaleDateString(),
    },
    {
      field: 'Transaction Type',
      headerName: 'Transaction Type',
      valueGetter: () => `${row.charge.transactionType}`,
    },
    {
      field: 'Remarks',
      headerName: 'Remarks',
      valueGetter: () => `${row.chargeRemarks}`,
    },
  ];
  if (!props.row) return <></>;

  return !props.length ? (
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
      getRowId={(row) => row.Id + row.ChargeNumber}
      columns={columns}
      rows={props.row ?? []}
    />
  );
};

export default LtsaChargeTable;
