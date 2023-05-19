import { Table } from 'components/Table';
import { IProperty } from 'features/projects/interfaces';
import * as React from 'react';

import { columns } from './columns';

export interface IProps {
  data: IProperty[];
  hideHeaders?: boolean;
}

export const Properties: React.FC<IProps> = ({ data, hideHeaders }) => {
  return (
    <Table<IProperty, any>
      hideHeaders={hideHeaders}
      name="nestedPropertiesTable"
      columns={columns}
      data={data}
      pageCount={1}
      hideToolbar={true}
    />
  );
};
