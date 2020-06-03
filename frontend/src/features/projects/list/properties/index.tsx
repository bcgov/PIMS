import * as React from 'react';
import { columns } from './columns';
import { Table } from 'components/Table';
import { IProjectProperty } from '../interfaces';

interface IProps {
  data: IProjectProperty[];
}

export const Properties: React.FC<IProps> = ({ data }) => {
  return (
    <Table<IProjectProperty>
      name="nestedPropertiesTable"
      columns={columns}
      data={data}
      pageCount={1}
      hideToolbar={true}
    />
  );
};
