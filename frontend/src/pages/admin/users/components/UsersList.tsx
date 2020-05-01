import React from 'react';
import { columns } from '../constants/index';
import { IUserRecord } from '../interfaces/IUserRecord';
import MUIDataTable, { MUIDataTableState } from 'mui-datatables';
import { SearchBox } from './SearchBox';

export type TableStateChangeFn = (action: string, tableState: MUIDataTableState) => void;

export interface IUsersListProps {
  data: IUserRecord[];
  page: number;
  pageSize: number;
  totalRows: number;
  onTableChange: TableStateChangeFn;
}

export const UsersList = (props: IUsersListProps) => {
  const searchBox = (
    searchText: any,
    handleSearch: any,
    hideSearch: any,
    options: any,
  ): JSX.Element => {
    return (
      <SearchBox
        handleSearch={handleSearch}
        searchText={searchText}
        options={options}
        hideSearch={hideSearch}
      />
    );
  };

  return (
    <MUIDataTable
      title={'PIMS Users'}
      data={props.data}
      columns={columns}
      options={{
        selectableRows: 'none',
        page: props.page,
        download: false,
        print: false,
        filter: true,
        count: props.totalRows,
        customSearchRender: searchBox,
        elevation: 1,
        rowHover: true,
        onTableChange: props.onTableChange,
      }}
    />
  );
};
