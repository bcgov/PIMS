import './Table.scss';

import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import { useTable, usePagination, TableOptions, Row, useFlexLayout, IdType } from 'react-table';
import classnames from 'classnames';
import { TablePagination } from '.';
import { ClickableCell, ClickableColumnInstance } from './ColumnDefinition';
import { TableSort, SortDirection } from './TableSort';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { TablePageSizeSelector } from './PageSizeSelector';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SELECTOR_OPTIONS } from './constants';
import { Spinner } from 'react-bootstrap';

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
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (data: T) => void;
  onSortChange?: (field: IdType<T>, directions: SortDirection) => void;
  onPageSizeChange?: (size: number) => void;
  sort?: TableSort<T>;
  noRowsMessage?: string;
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

  const getNextSortDirection = (column: ClickableColumnInstance<T>): SortDirection => {
    if (!props.sort) return 'asc';

    if (props.sort.column !== column.id || props.sort.direction === 'desc') {
      return 'asc';
    }

    return 'desc';
  };

  const renderHeaderCell = (column: ClickableColumnInstance<T>) => {
    const isSorted = props.sort && props.sort.column === column.id;
    if (!column.sortable || !isSorted) {
      return column.render('Header');
    }

    return (
      <div className="sortable-column">
        {column.render('Header')}
        {props.sort?.direction === 'asc' ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />}
      </div>
    );
  };

  const onPageSizeChange = (size: number) => {
    props.onPageSizeChange && props.onPageSizeChange(size);
  };

  const renderLoading = () => {
    return (
      <div className="table-loading">
        <Spinner animation="border"></Spinner>
      </div>
    );
  };

  const renderBody = () => {
    if (props.loading) {
      return renderLoading();
    }

    if (props.data.length === 0) {
      return <div className="no-rows-message">{props.noRowsMessage || 'No rows to display'}</div>;
    }

    return (
      <div {...getTableBodyProps()} className="tbody">
        {page.map((row: Row<T>, i) => {
          // This line is necessary to prepare the rows and get the row props from `react-table` dynamically
          prepareRow(row);
          // Each row can be rendered directly as a string using `react-table` render method
          return (
            <div {...row.getRowProps()} className="tr">
              {row.cells.map((cell: ClickableCell<T>) => {
                return (
                  <div
                    {...cell.getCellProps(cellProps)}
                    className="td"
                    onClick={() =>
                      props.onRowClick && cell.column.clickable && props.onRowClick(row.original)
                    }
                  >
                    {cell.render('Cell')}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Render the UI for your table
  return (
    <>
      <div {...getTableProps()} className="table">
        <div className="thead thead-light">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column: ClickableColumnInstance<T>) => (
                <div
                  {...column.getHeaderProps(headerProps)}
                  onClick={() =>
                    props.onSortChange &&
                    column.sortable &&
                    props.onSortChange(column.id, getNextSortDirection(column))
                  }
                  className={classnames(
                    'th',
                    column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : '',
                  )}
                >
                  {renderHeaderCell(column)}
                </div>
              ))}
            </div>
          ))}
        </div>
        {renderBody()}
      </div>
      <div className="table-toolbar">
        <TablePagination<T> instance={instance} />
        {props.data.length > 0 && (
          <TablePageSizeSelector
            options={props.pageSizeOptions || DEFAULT_PAGE_SELECTOR_OPTIONS}
            value={props.pageSize || DEFAULT_PAGE_SIZE}
            onChange={onPageSizeChange}
          />
        )}
      </div>
    </>
  );
};

export default Table;
