import React from 'react';
import { CellProps } from 'react-table';
import { formatDate, formatMoney } from 'utils';
import { IProject } from '.';
import { ColumnWithProps } from 'components/Table';
import { FaTrash } from 'react-icons/fa';
import { Workflows } from 'constants/workflows';
// NOTE - There numbers below match the total number of columns ATM (13)
// If additional columns are added or deleted, these numbers need tp be updated...
const howManyColumns = 13;
const totalWidthPercent = 100; // how wide the table should be; e.g. 100%

// Setup a few sample widths: x/2, 1x, 2x (percentage-based)
const unit = Math.floor(totalWidthPercent / howManyColumns);
const spacing = {
  xxsmall: 1,
  xsmall: unit / 4,
  small: unit / 2,
  medium: unit,
  large: unit * 2,
  xlarge: unit * 4,
  xxlarge: unit * 8,
};

export const columns = (
  onDelete?: (id: string) => void,
  isAdmin?: boolean,
  projectEditClaim?: boolean,
  user?: string,
): ColumnWithProps<IProject>[] => {
  return [
    {
      Header: 'Project No.',
      accessor: 'projectNumber', // accessor is the "key" in the data
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.small,
      minWidth: 65,
      Cell: (props: CellProps<IProject>) => {
        return (
          <div>
            {/* delete icon will be shown only if the project is still in draft and they have the edit claim, or an admin claim, or they created the project */}
            {!!onDelete &&
              props.row.original.workflowCode === Workflows.SUBMIT_DISPOSAL &&
              (projectEditClaim || isAdmin || user === props.row.original.createdBy) && (
                <FaTrash
                  style={{ marginRight: 10, cursor: 'pointer' }}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    onDelete(props.row.original.projectNumber);
                  }}
                />
              )}
            <span>{props.row.original.projectNumber}</span>
          </div>
        );
      },
    },
    {
      Header: 'Name',
      accessor: 'name',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 200,
    },
    {
      Header: 'Status',
      accessor: 'status',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 50,
    },
    {
      Header: 'Agency',
      accessor: item => (item.subAgency ? `${item.subAgency} (${item.agency})` : item.agency),
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 80,
    },
    {
      Header: 'Zoning',
      accessor: 'zoning',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.small,
      minWidth: 80,
    },
    {
      Header: 'Zoning Potential',
      accessor: 'zoningPotential',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.small,
      minWidth: 80,
    },
    {
      Header: 'Net Book Value',
      accessor: 'netBook',
      align: 'left',
      clickable: true,
      responsive: true,
      width: spacing.small,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return formatMoney(props.row.original.netBook);
      },
    },
    {
      Header: 'Market Value',
      accessor: 'market',
      align: 'left',
      clickable: true,
      responsive: true,
      width: spacing.small,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return formatMoney(props.row.original.market);
      },
    },
    {
      Header: 'Updated On',
      accessor: 'updatedOn',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return formatDate(props.row.original.updatedOn || props.row.original.createdOn);
      },
    },
    {
      Header: 'Updated By',
      accessor: 'updatedById',
      align: 'left',
      responsive: true,
      clickable: true,
      width: spacing.medium,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return props.row.original.updatedBy || props.row.original.createdBy;
      },
    },
  ];
};
