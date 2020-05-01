import './Table.scss';

import React from 'react';
import { Table as BootstrapTable } from 'react-bootstrap';
import { useTable, Column } from 'react-table';

export type TableProps<T extends object = {}> = {
  columns: Column<T>[];
  data: T[];
};

/**
 * A table component. Supports sorting, filtering and paging.
 * Uses `react-table` to handle table logic.
 */
const Table: React.FC<TableProps> = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <BootstrapTable {...getTableProps()}>
      <thead className="thead-light">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </BootstrapTable>
  );
};

export default Table;
