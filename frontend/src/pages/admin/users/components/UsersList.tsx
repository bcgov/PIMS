import React from 'react';
import { columns } from '../constants/index';
import { IUserRecord } from '../interfaces/IUserRecord';
import MUIDataTable, { MUIDataTableState } from 'mui-datatables';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import { IUsersState } from 'reducers/usersReducer';
import { IUsersSort } from 'actions/adminActions';

export type TableStateChangeFn = (action: string, tableState: MUIDataTableState) => void;

export interface IUsersListProps {
  data: IUserRecord[];
  page: number;
  pageSize: number;
  totalRows: number;
  onTableChange: TableStateChangeFn;
  sort: IUsersSort;
}

export const UsersList = (props: IUsersListProps) => {
  const filter = useSelector<RootState, string[][]>(state => {
    return (state.users as IUsersState).filterList;
  });

  return (
    <MUIDataTable
      title={'PIMS Users'}
      data={props.data}
      columns={columns(props.sort)}
      options={{
        pagination: true,
        serverSide: true,
        selectableRows: 'none',
        page: props.page,
        download: true,
        downloadOptions: {},
        print: false,
        filter: true,
        search: false,
        viewColumns: false,
        serverSideFilterList: filter,
        count: props.totalRows,
        rowsPerPage: props.pageSize,
        rowsPerPageOptions: [2, 5, 10, 20, 30, 40, 50],
        elevation: 1,
        rowHover: true,
        onTableChange: props.onTableChange,
        sort: true,
      }}
    />
  );
};
