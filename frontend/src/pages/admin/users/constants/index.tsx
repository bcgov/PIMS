import * as React from 'react';
import { MUIDataTableColumnDef, MUIDataTableColumn } from 'mui-datatables';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { AccountActive } from '../interfaces/IUserRecord';
import { RowActions } from '../components/RowActions';
import { IUsersSort } from 'actions/adminActions';

export const columns = (sort: IUsersSort): MUIDataTableColumnDef[] => {
  let items: MUIDataTableColumn[] = [
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
          const id = tableMeta.rowData[0] + `-${active}`;
          return active === AccountActive.YES ? (
            <FaCheck data-testid={id} />
          ) : (
            <FaTimes data-testid={id} />
          );
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
      label: ' ',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          return <RowActions userId={tableMeta.rowData[0]} active={tableMeta.rowData[5]} />;
        },
      },
    },
  ];

  return items.map(x => {
    if (!sort || (sort && x.name !== sort.sortBy)) {
      return x;
    }
    x.options = x.options || {};
    return { ...x, options: { ...x.options, sortDirection: sort.direction } };
  });
};
