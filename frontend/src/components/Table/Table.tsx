import './Table.scss';

import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import { useTable, usePagination, TableOptions, Row, useFlexLayout } from 'react-table';
import classnames from 'classnames';
import { TablePagination } from '.';

// these provide a way to inject custom CSS into table headers and cells
const headerProps = (props: any, { column }: any) => getStyles(props, true, column.align);
const cellProps = (props: any, { cell }: any) => getStyles(props, false, cell.column.align);

const getStyles = (props: any, isColumnHeader: boolean, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      textAlign: align === 'right' ? 'right' : 'left',
      alignItems: isColumnHeader ? 'center' : 'flex-start',
      display: 'flex',
    },
  },
];

export interface TableProps<T extends object = {}> extends TableOptions<T> {
  name: string;
  onRequestData?: (props: { pageIndex: number; pageSize: number }) => void;
  loading?: boolean; // TODO: Show loading indicator while fetching data from server
  pageCount?: number;
}

/**
 * A table component. Supports sorting, filtering and paging.
 * Uses `react-table` to handle table logic.
 */
const Table = <T extends object>(props: PropsWithChildren<TableProps<T>>): ReactElement => {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    [],
  );

  const { columns, data, onRequestData, pageCount: controlledPageCount } = props;

  // Use the useTable hook to create your table configuration
  const instance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      manualPagination: true, // Tell the usePagination hook
      // that we'll handle our own data fetching.
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    useFlexLayout,
    usePagination,
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // Get state from react-table
    state: { pageIndex, pageSize },
  } = instance;

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    onRequestData?.({ pageIndex, pageSize });
  }, [onRequestData, pageIndex, pageSize]);

  // Render the UI for your table
  return (
    <>
      <div {...getTableProps()} className="table">
        <div className="thead thead-light">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map(column => (
                <div
                  {...column.getHeaderProps(headerProps)}
                  className={classnames(
                    'th',
                    column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : '',
                  )}
                >
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className="tbody">
          {page.map((row: Row<T>, i) => {
            // This line is necessary to prepare the rows and get the row props from `react-table` dynamically
            prepareRow(row);

            // Each row can be rendered directly as a string using `react-table` render method
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map(cell => {
                  return (
                    <div {...cell.getCellProps(cellProps)} className="td">
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <TablePagination<T> instance={instance} />
    </>
  );
};

export default Table;
