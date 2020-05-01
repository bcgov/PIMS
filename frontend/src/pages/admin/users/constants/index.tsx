import * as React from 'react';
import { MUIDataTableColumnDef } from 'mui-datatables';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { AccountActive } from '../interfaces/IUserRecord';
import { RowActions } from '../components/RowActions';
export const columns: MUIDataTableColumnDef[] = [
  {
    name: 'id',
    label: 'ID',
    options: {
      display: 'excluded',
      filter: false,
    },
  },
  {
    name: 'username',
    label: 'IDIR/BCeID',
    options: {
      customBodyRender: (username: string, tableMeta: any) => {
        return <a href={`/admin/user/${tableMeta.rowData[0]}`}>{username}</a>;
      },
    },
  },
  {
    name: 'firstName',
    label: 'First name',
  },
  {
    name: 'lastName',
    label: 'Last name',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'active',
    label: 'Active',
    options: {
      customBodyRender: (active: AccountActive, tableMeta: any) => {
        return active === AccountActive.YES ? <FaCheck /> : <FaTimes />;
      },
    },
  },
  {
    name: 'agency',
    label: 'Agency',
  },
  {
    name: 'position',
    label: 'Position',
  },
  {
    name: 'role',
    label: 'Role',
  },
  {
    name: 'action',
    label: 'Actions',
    options: {
      customBodyRender: (value: any, tableMeta: any) => {
        return <RowActions userId={tableMeta.rowData[0]} active={tableMeta.rowData[5]} />;
      },
    },
  },
];
