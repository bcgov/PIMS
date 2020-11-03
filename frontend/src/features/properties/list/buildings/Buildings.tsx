import * as React from 'react';
import { columns } from './columns';
import { Table } from 'components/Table';
import { IProperty } from './IProperty';

/**
 * Buildings table component properties
 * @interface IProps
 */
export interface IProps {
  /** An array of properties. */
  data: IProperty[];
  /** Whether to hide the headers. */
  hideHeaders?: boolean;
}

/**
 * A table displaying a list of buildings.
 * @param {IProps} props Component properties.
 */
export const Buildings: React.FC<IProps> = ({ data, hideHeaders }) => {
  return (
    <Table<IProperty>
      hideHeaders={hideHeaders}
      name="nestedPropertiesTable"
      columns={columns}
      data={data}
      pageCount={1}
      hideToolbar={true}
    />
  );
};
