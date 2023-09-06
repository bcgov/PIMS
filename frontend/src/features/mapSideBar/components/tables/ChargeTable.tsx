import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ILTSAOrderModel } from 'actions/parcelsActions';
import * as React from 'react';

interface IRowProps {
  row: {
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

const Row = (props: IRowProps) => {
  const { row, index } = props;

  return (
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? 'white' : '#F2F2F2',
      }}
    >
      <TableCell>{row.chargeNumber}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>{new Date(row.enteredDate).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(row.charge.applicationReceivedDate).toLocaleDateString()}</TableCell>
      <TableCell>{row.charge.transactionType}</TableCell>
      <TableCell
        sx={{
          maxWidth: '15em',
        }}
      >
        {row.chargeRemarks}
      </TableCell>
    </TableRow>
  );
};

interface IChargesTableProps {
  ltsa: ILTSAOrderModel | undefined;
}

/**
 * @description Displays charges information from LTSA API data.
 * @param {IChargesTableProps} props
 * @returns A MUI table with LTSA charges.
 */
export const ChargesTable = (props: IChargesTableProps) => {
  const { ltsa } = props;

  if (!ltsa?.order.orderedProduct.fieldedData.chargesOnTitle) {
    return <p>No available charges information.</p>;
  }

  const headerStyle: React.CSSProperties = {
    fontWeight: 600,
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyle}>Charge #</TableCell>
            <TableCell sx={headerStyle}>Status</TableCell>
            <TableCell sx={headerStyle}>Entered Date</TableCell>
            <TableCell sx={headerStyle}>Received Date</TableCell>
            <TableCell sx={headerStyle}>Transaction Type</TableCell>
            <TableCell sx={headerStyle}>Remarks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ltsa?.order.orderedProduct.fieldedData.chargesOnTitle.map((row, index) => (
            <Row key={`${row.chargeNumber}`} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
