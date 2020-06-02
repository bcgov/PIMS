import * as React from 'react';
import { ColumnWithProps } from 'components/Table';
import { IAccessRequestModel } from '../interfaces';
import { CellProps } from 'react-table';
import { AccessStatusDisplayMapper } from 'constants/accessStatus';
import { RowActions } from '../components/RowActions';

export const columnDefinitions: ColumnWithProps<IAccessRequestModel>[] = [
  {
    Header: 'IDIR/BCeID',
    accessor: 'username',
    align: 'left',
    Cell: (props: CellProps<IAccessRequestModel>) => {
      return <a href={`/admin/user/${props.row.original.userId}`}>{props.row.original.username}</a>;
    },
  },
  {
    Header: 'First name',
    accessor: 'firstName',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Last name',
    accessor: 'lastName',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Email',
    accessor: 'email',
    align: 'left',
    clickable: true,
    minWidth: 200,
  },
  {
    Header: 'Position',
    accessor: 'position',
    align: 'left',
    clickable: true,
  },
  {
    Header: 'Status',
    accessor: 'status',
    align: 'left',
    clickable: true,
    width: 100,
    Cell: (props: CellProps<IAccessRequestModel>) =>
      AccessStatusDisplayMapper[props.row.original.status],
  },
  {
    Header: 'Agency',
    accessor: 'agency',
    align: 'left',
    clickable: true,
    minWidth: 200,
  },
  {
    Header: 'Role',
    accessor: 'role',
    align: 'left',
    clickable: true,
    minWidth: 200,
  },
  {
    Header: ' ',
    Cell: RowActions,
    width: 75,
  },
];
