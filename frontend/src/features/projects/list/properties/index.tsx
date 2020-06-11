import * as React from 'react';
import { columns } from './columns';
import { Table } from 'components/Table';
import { IProperty } from '../../dispose';

interface IProps {
  data: IProperty[];
}

export const Properties: React.FC<IProps> = ({ data }) => {
  return (
    <Table<IProperty>
      name="nestedPropertiesTable"
      columns={columns}
      data={data}
      pageCount={1}
      hideToolbar={true}
    />
  );
};
