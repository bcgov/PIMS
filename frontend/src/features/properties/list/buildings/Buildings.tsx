import * as React from 'react';
import { Table, ColumnWithProps } from 'components/Table';
import { IProperty } from '..';

/**
 * Buildings table component properties
 * @interface IProps
 */
export interface IProps {
  /** An array of properties. */
  data: IProperty[];
  /** Whether to hide the headers. */
  hideHeaders?: boolean;
  /** Optionally override the columns */
  columns: ColumnWithProps<IProperty>[];
  /** handle click event on table building row*/
  onRowClick?: (data: IProperty) => void;
}

/**
 * A table displaying a list of buildings.
 * @param {IProps} props Component properties.
 */
export const Buildings: React.FC<IProps> = ({
  data,
  hideHeaders,
  columns: externalColumns,
  onRowClick,
}) => {
  return (
    <Table<IProperty>
      hideHeaders={hideHeaders}
      name="nestedPropertiesTable"
      columns={externalColumns}
      data={data}
      pageCount={1}
      hideToolbar={true}
      onRowClick={onRowClick}
    />
  );
};
