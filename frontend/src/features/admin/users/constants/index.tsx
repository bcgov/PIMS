import * as React from 'react';
import { ColumnWithProps } from 'components/Table';
import { CellProps } from 'react-table';
import { RowActions } from '../components/RowActions';
import { IUserRecord } from '../interfaces/IUserRecord';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const columnDefinitions: ColumnWithProps<IUserRecord>[] = [
  {
    Header: 'IDIR/BCeID',
    accessor: 'username',
    align: 'left',
    Cell: (props: CellProps<IUserRecord>) => {
      return <Link to={`/admin/user/${props.row.original.id}`}>{props.row.original.username}</Link>;
    },
    sortable: true,
  },
  {
    Header: 'First name',
    accessor: 'firstName',
    align: 'left',
    clickable: true,
    sortable: true,
  },
  {
    Header: 'Last name',
    accessor: 'lastName',
    align: 'left',
    clickable: true,
    sortable: true,
  },
  {
    Header: 'Email',
    accessor: 'email',
    align: 'left',
    clickable: true,
    sortable: true,
    minWidth: 200,
  },
  {
    Header: 'Position',
    accessor: 'position',
    align: 'left',
    clickable: true,
    sortable: true,
  },
  {
    Header: 'Active',
    accessor: 'isDisabled',
    align: 'left',
    clickable: true,
    sortable: true,
    width: 100,
    Cell: (props: CellProps<IUserRecord>) =>
      props.row.original.isDisabled ? <FaTimes /> : <FaCheck />,
  },
  {
    Header: 'Agency',
    accessor: 'agency',
    align: 'left',
    sortable: true,
    clickable: true,
    minWidth: 200,
  },
  {
    Header: 'Roles',
    accessor: 'roles',
    align: 'left',
    clickable: true,
    minWidth: 200,
  },
  {
    Header: 'Last Login',
    accessor: 'lastLogin',
    align: 'left',
    clickable: true,
    minWidth: 100,
  },
  {
    Header: 'Created On',
    accessor: 'createdOn',
    align: 'left',
    clickable: true,
    sortable: true,
    minWidth: 100,
  },
  {
    Header: ' ',
    Cell: RowActions,
    width: 75,
  },
];
