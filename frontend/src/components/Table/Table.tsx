import './Table.scss';

import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import {
  useTable,
  usePagination,
  useFlexLayout,
  TableOptions,
  Row,
  Cell,
  IdType,
  useRowSelect,
} from 'react-table';
import classnames from 'classnames';
import { TablePagination } from '.';
import { CellWithProps, ColumnInstanceWithProps } from './types';
import { TableSort, SortDirection } from './TableSort';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { TablePageSizeSelector } from './PageSizeSelector';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SELECTOR_OPTIONS } from './constants';
import { Spinner } from 'react-bootstrap';
import _ from 'lodash';

// these provide a way to inject custom CSS into table headers and cells
const headerProps = <T extends object>(
  props: any,
  { column }: { column: ColumnInstanceWithProps<T> },
) => {
  return getStyles(props, true, column);
};

const cellProps = <T extends object>(props: any, { cell }: { cell: Cell<T> }) => {
  return getStyles(props, false, cell.column);
};

const getStyles = <T extends object>(
  props: any,
  isHeader: boolean,
  column: ColumnInstanceWithProps<T>,
) => {
  // override column width when percentage value is provided - react-table deals with pixel values
  const colSize = !!column?.responsive
    ? {
        width: `${column?.width}%`,
      }
    : {};
  // return CSS styles: `props` are react-table defaults, the rest are our overrides...
  return [
    props,
    {
      style: {
        justifyContent: column?.align === 'right' ? 'flex-end' : 'flex-start',
        textAlign: column?.align === 'right' ? 'right' : 'left',
        alignItems: isHeader ? 'center' : 'flex-start',
        display: 'flex',
        ...colSize,
      },
    },
    colSize,
  ];
};

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
  setSelectedRows?: Function;
  lockPageSize?: boolean;
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  );
});

/**
 * A table component. Supports sorting, filtering and paging.
 * Uses `react-table` to handle table logic.
 */
const Table = <T extends object>(props: PropsWithChildren<TableProps<T>>): ReactElement => {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 100, // width is used for both the flex-basis and flex-grow
    }),
    [],
  );

  const { columns, data, onRequestData, pageCount: controlledPageCount, setSelectedRows } = props;

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
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => {
        return props.setSelectedRows
          ? [
              {
                id: 'selection',
                // Make this column a groupByBoundary. This ensures that groupBy columns
                // are placed after it
                groupByBoundary: true,
                // The header can use the table's getToggleAllRowsSelectedProps method
                // to render a checkbox
                Header: ({ getToggleAllRowsSelectedProps }) => (
                  <div>
                    <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                  </div>
                ),
                // The cell can use the individual row's getToggleRowSelectedProps method
                // to the render a checkbox
                Cell: ({ row }: { row: any }) => (
                  <div>
                    <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                  </div>
                ),
              },
              ...columns,
            ]
          : columns;
      });
    },
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
    state: { pageIndex, pageSize, selectedRowIds },
  } = instance;

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    onRequestData?.({ pageIndex, pageSize });
  }, [onRequestData, pageIndex, pageSize]);

  useEffect(() => {
    if (setSelectedRows && Object.keys(selectedRowIds).length) {
      const selectedRows = _.filter(page, { isSelected: true });
      const selectedData = selectedRows.map((row: Row<T>) => row.original);
      setSelectedRows(selectedData);
    }
  }, [data, setSelectedRows, page, selectedRowIds]);

  const getNextSortDirection = (column: ColumnInstanceWithProps<T>): SortDirection => {
    if (!props.sort) return 'asc';

    if (props.sort.column !== column.id || props.sort.direction === 'desc') {
      return 'asc';
    }

    return 'desc';
  };

  const renderHeaderCell = (column: ColumnInstanceWithProps<T>) => {
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
              {row.cells.map((cell: CellWithProps<T>) => {
                return (
                  <div
                    {...cell.getCellProps(cellProps)}
                    className="td"
                    onClick={() => {
                      props.onRowClick && cell.column.clickable && props.onRowClick(row.original);
                    }}
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
      <div {...getTableProps({ style: { minWidth: undefined } })} className="table">
        <div className="thead thead-light">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column: ColumnInstanceWithProps<T>) => (
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
        {props.pageSize !== -1 && <TablePagination<T> instance={instance} />}
        {!props.lockPageSize && props.data.length > 0 && (
          <TablePageSizeSelector
            options={props.pageSizeOptions || DEFAULT_PAGE_SELECTOR_OPTIONS}
            value={props.pageSize || DEFAULT_PAGE_SIZE}
            onChange={onPageSizeChange}
            alignTop={props.data.length >= 20}
          />
        )}
      </div>
    </>
  );
};

export default Table;
