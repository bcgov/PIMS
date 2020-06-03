import React from 'react';
import { CellProps } from 'react-table';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils';
import { IProject } from '.';
import { ColumnWithProps } from 'components/Table';
import { FaTrash } from 'react-icons/fa';
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

export const columns = (onDelete: (id: string) => void): ColumnWithProps<IProject>[] => {
  return [
    {
      Header: 'Project No.',
      accessor: 'projectNumber', // accessor is the "key" in the data
      align: 'left',
      responsive: true,
      width: spacing.small,
      minWidth: 65,
      Cell: (props: CellProps<IProject>) => {
        return (
          <div>
            <FaTrash
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => onDelete(props.row.original.projectNumber)}
            />
            <Link to={`/projects/${props.row.original.projectNumber}?disabled=true`}>
              {props.row.original.projectNumber}
            </Link>
          </div>
        );
      },
    },
    {
      Header: 'Name',
      accessor: 'name',
      align: 'left',
      responsive: true,
      width: spacing.medium,
      minWidth: 80,
    },
    {
      Header: 'Description',
      accessor: 'description',
      align: 'left',
      responsive: true,
      width: spacing.large,
      minWidth: 160,
    },
    {
      Header: 'Status',
      accessor: 'status',
      align: 'left',
      responsive: true,
      width: spacing.medium,
      minWidth: 80,
    },
    {
      Header: 'No. of properties',
      accessor: 'properties',
      align: 'left',
      responsive: true,
      width: spacing.small,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return props.row.original.properties.length;
      },
    },
    {
      Header: 'Last Updated',
      accessor: 'updatedOn',
      align: 'left',
      responsive: true,
      width: spacing.medium,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return formatDate(props.row.original.updatedOn || props.row.original.createdOn);
      },
    },
    {
      Header: 'Last Updated By',
      accessor: 'updatedById',
      align: 'left',
      responsive: true,
      width: spacing.medium,
      minWidth: 80,
      Cell: (props: CellProps<IProject>) => {
        return props.row.original.updatedBy || props.row.original.createdBy;
      },
    },
  ];
};
