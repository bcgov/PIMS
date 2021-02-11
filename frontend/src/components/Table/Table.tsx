import './Table.scss';

import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  ReactNode,
  useMemo,
  useRef,
} from 'react';
import {
  useTable,
  usePagination,
  useFlexLayout,
  TableOptions,
  Row,
  Cell,
  IdType,
  useRowSelect,
  useSortBy,
} from 'react-table';
import classnames from 'classnames';
import { TablePagination } from '.';
import { CellWithProps, ColumnInstanceWithProps } from './types';
import { TableSort, SortDirection } from './TableSort';
import { TablePageSizeSelector } from './PageSizeSelector';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SELECTOR_OPTIONS } from './constants';
import _, { keys } from 'lodash';
import { Spinner, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight, FaUndo } from 'react-icons/fa';
import TooltipWrapper from 'components/common/TooltipWrapper';
import ColumnSort from './ColumnSort';
import ColumnFilter from './ColumnFilter';
import { Formik, FormikProps } from 'formik';
import { Button } from 'components/common/form/Button';
import classNames from 'classnames';
import useDeepCompareMemo from 'hooks/useDeepCompareMemo';
import useDeepCompareCallback from 'hooks/useDeepCompareCallback';

// these provide a way to inject custom CSS into table headers and cells
const headerProps = <T extends object>(
  props: any,
  { column }: { column: ColumnInstanceWithProps<T> },
) => {
  return getStyles(props, true, column);
};

const noHeaders = <T extends object>(
  props: any,
  { column }: { column: ColumnInstanceWithProps<T> },
) => {
  return getStyles(props, true, column, true);
};

const cellProps = <T extends object>(props: any, { cell }: { cell: Cell<T> }) => {
  return getStyles(props, false, cell.column);
};

const getStyles = <T extends object>(
  props: any,
  isHeader: boolean,
  column: ColumnInstanceWithProps<T>,
  hideHeaders?: boolean,
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
        display: isHeader && hideHeaders ? 'none' : 'flex',
        ...colSize,
      },
    },
    colSize,
  ];
};

interface DetailsOptions<T extends object> {
  render: (data: T) => ReactNode;
  icons?: { open: ReactNode; closed: ReactNode };
  onExpand?: (data: T[]) => void;
  checkExpanded: (row: T, state: T[]) => boolean;
  getRowId: (row: T) => any;
}

export interface TableProps<T extends object = {}> extends TableOptions<T> {
  name: string;
  hideHeaders?: boolean;
  onRequestData?: (props: { pageIndex: number; pageSize: number }) => void;
  loading?: boolean; // TODO: Show loading indicator while fetching data from server
  pageCount?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  pageIndex?: number;
  onRowClick?: (data: T) => void;
  clickableTooltip?: string;
  onSortChange?: (field: IdType<T>, directions: SortDirection) => void;
  onPageSizeChange?: (size: number) => void;
  sort?: TableSort<T>;
  noRowsMessage?: string;
  setSelectedRows?: Function;
  lockPageSize?: boolean;
  detailsPanel?: DetailsOptions<T>;
  footer?: boolean;
  hideToolbar?: boolean;
  manualPagination?: boolean;
  // Limit where you would like an expansion button to appear based off this props criteria
  canRowExpand?: (val: any) => boolean;
  className?: string;
  filterable?: boolean;
  filter?: { [key in keyof T]?: any };
  onFilterChange?: (values: any) => void;
  /** have page selection menu drop-up to avoid container growing in some scenarios */
  pageSizeMenuDropUp?: boolean;
}

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
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
  const filterFormRef = useRef<FormikProps<any>>();
  const [expandedRows, setExpandedRows] = React.useState<T[]>([]);
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 100, // width is used for both the flex-basis and flex-grow
    }),
    [],
  );

  const {
    clickableTooltip,
    columns,
    data,
    onRequestData,
    pageCount,
    setSelectedRows,
    footer,
    pageSize: pageSizeProp,
    pageIndex: pageIndexProp,
    manualPagination,
    sort,
    filterable,
  } = props;

  React.useEffect(() => {
    if (filterFormRef.current) {
      filterFormRef.current.setValues(props.filter);
    }
  }, [filterFormRef, props.filter]);

  const sortBy = useMemo(() => {
    return !!sort ? keys(sort).map(key => ({ id: key, desc: (sort as any)[key] === 'desc' })) : [];
  }, [sort]);
  // Use the useTable hook to create your table configuration
  const instance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: pageSizeProp
        ? { sortBy, pageIndex: pageIndexProp ?? 0, pageSize: pageSizeProp }
        : { sortBy, pageIndex: pageIndexProp ?? 0 },
      manualPagination: manualPagination ?? true, // Tell the usePagination hook
      manualSortBy: false,
      // that we'll handle our own data fetching.
      // This means we'll also have to provide our own
      // pageCount.
      pageCount,
    },
    useFlexLayout,
    useSortBy,
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
                maxWidth: 40,
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
    toggleSortBy,
    headerGroups,
    footerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // Get state from react-table
    state: { pageIndex, pageSize, selectedRowIds },
  } = instance;

  // Listen for changes in pagination and use the state to fetch our new data
  useEffect(() => {
    pageIndexProp !== undefined && pageIndexProp >= 0 && instance.gotoPage(pageIndexProp);
  }, [pageIndexProp, instance]);

  useEffect(() => {
    pageSizeProp && instance.setPageSize(pageSizeProp);
  }, [pageSizeProp, instance]);

  useEffect(() => {
    onRequestData?.({ pageIndex: pageIndex, pageSize });
  }, [onRequestData, pageIndex, pageSize]);

  useEffect(() => {
    if (setSelectedRows && Object.keys(selectedRowIds).length) {
      const selectedRows = _.filter(page, { isSelected: true });
      const selectedData = selectedRows.map((row: Row<T>) => row.original);
      setSelectedRows(selectedData);
    }
  }, [data, setSelectedRows, page, selectedRowIds]);

  const getNextSortDirection = (column: ColumnInstanceWithProps<T>): SortDirection => {
    if (!(props.sort as any)[column.id]) return 'asc';

    if ((props.sort as any)[column.id] === 'desc') {
      return undefined;
    }

    return 'desc';
  };

  const renderHeaderCell = (column: ColumnInstanceWithProps<T>) => {
    return (
      <div className="sortable-column">
        <ColumnFilter
          onFilter={values => {
            if (filterFormRef.current?.dirty) {
              filterFormRef.current.submitForm();
            }
          }}
          column={column}
        >
          {column.render('Header')}
        </ColumnFilter>
        <span style={{ flex: '1 1 auto' }} />
        <ColumnSort
          onSort={() => {
            const next = getNextSortDirection(column);
            props.onSortChange!(column.id, next);
            if (!!next) {
              toggleSortBy(column.id, next === 'desc', true);
            } else {
              column.clearSortBy();
            }
          }}
          column={column}
        />
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

  const renderExpandRowStateButton = useDeepCompareCallback(
    (
      open?: boolean,
      className?: string,
      onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
    ) => {
      const detailsClosedIcon =
        props.detailsPanel && props.detailsPanel.icons?.closed ? (
          props.detailsPanel.icons?.closed
        ) : (
          <FaAngleRight />
        );
      const detailsOpenedIcon =
        props.detailsPanel && props.detailsPanel.icons?.open ? (
          props.detailsPanel.icons?.open
        ) : (
          <FaAngleDown />
        );
      return (
        props.detailsPanel && (
          <TooltipWrapper
            toolTipId="expand-all-rows"
            toolTip={open ? 'Collapse Row' : 'Expand Row'}
          >
            <div className={className + ' svg-btn'} onClick={onClick}>
              {open ? detailsOpenedIcon : detailsClosedIcon}
            </div>
          </TooltipWrapper>
        )
      );
    },
    [props.detailsPanel],
  );

  const renderFooter = () => {
    if (!footer || !page?.length) {
      return null;
    }
    if (props.loading) {
      return renderLoading();
    }
    return (
      <div className="tfoot tfoot-light">
        {footerGroups.map(footerGroup => (
          <div {...footerGroup.getHeaderGroupProps()} className="tr">
            {footerGroup.headers.map(
              (column: ColumnInstanceWithProps<T> & { Footer?: Function }) => (
                <div {...column.getHeaderProps(headerProps)} className="th">
                  {column.Footer ? <column.Footer properties={_.map(page, 'original')} /> : null}
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderBody = useDeepCompareMemo(() => {
    if (props.loading) {
      return renderLoading();
    }

    if (props.data.length === 0) {
      return <div className="no-rows-message">{props.noRowsMessage || 'No rows to display'}</div>;
    }

    const handleExpandClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: T) => {
      e.preventDefault();
      let expanded = expandedRows;
      if (
        props.detailsPanel !== undefined &&
        props.detailsPanel.checkExpanded(data, expandedRows)
      ) {
        expanded = expandedRows.filter(
          x => props.detailsPanel?.getRowId(x) !== props.detailsPanel?.getRowId(data),
        );
      } else {
        expanded = [...expandedRows, data];
      }
      setExpandedRows(expanded);
      if (props.detailsPanel && props.detailsPanel.onExpand && expanded.length > 0) {
        props.detailsPanel.onExpand(expanded);
      }
    };

    const renderRow = (row: Row<T>, index: number) => {
      return (
        <div key={index} className="tr-wrapper">
          <div {...row.getRowProps()} className="tr">
            {/* If canRowExpand prop is passed only allow expansions on those rows */}
            {props.canRowExpand &&
              props.canRowExpand(row) &&
              renderExpandRowStateButton(
                props.detailsPanel && props.detailsPanel.checkExpanded(row.original, expandedRows),
                'td expander',
                e => handleExpandClick(e, row.original),
              )}
            {props.canRowExpand && !props.canRowExpand(row) ? (
              <div className="td">
                <div style={{ width: '20px' }}>&nbsp;</div>
              </div>
            ) : null}
            {/* Expansion button shown on every row by default */}
            {!props.canRowExpand &&
              renderExpandRowStateButton(
                props.detailsPanel && props.detailsPanel.checkExpanded(row.original, expandedRows),
                'td expander',
                e => handleExpandClick(e, row.original),
              )}
            {row.cells.map((cell: CellWithProps<T>) => {
              return (
                <div
                  {...cell.getCellProps(cellProps)}
                  title={cell.column.clickable && clickableTooltip ? clickableTooltip : ''}
                  className={classnames('td', cell.column.clickable ? 'clickable' : '')}
                  onClick={() =>
                    props.onRowClick && cell.column.clickable && props.onRowClick(row.original)
                  }
                >
                  {cell.render('Cell')}
                </div>
              );
            })}
          </div>
          {props.detailsPanel && (
            <Collapse in={props.detailsPanel.checkExpanded(row.original, expandedRows)}>
              <div style={{ padding: 10 }}>{props.detailsPanel.render(row.original)}</div>
            </Collapse>
          )}
        </div>
      );
    };

    return (
      <div {...getTableBodyProps()} className="tbody">
        {page.map((row: Row<T>, index: number) => {
          // This line is necessary to prepare the rows and get the row props from `react-table` dynamically
          prepareRow(row);
          // Each row can be rendered directly as a string using `react-table` render method
          return renderRow(row, index);
        })}
      </div>
    );
  }, [
    props.loading,
    props.detailsPanel,
    props.data,
    props.canRowExpand,
    props.onRowClick,
    props.noRowsMessage,
    renderExpandRowStateButton,
    cellProps,
    expandedRows,
    clickableTooltip,
    selectedRowIds,
  ]);

  // Render the UI for your table
  return (
    <>
      <div
        {...getTableProps({ style: { minWidth: undefined } })}
        className={classNames('table', props.className ?? '')}
      >
        <div className="thead thead-light">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              <Formik
                initialValues={props.filter || {}}
                onSubmit={values => {
                  if (!!props.onFilterChange) {
                    props.onFilterChange(values);
                  }
                }}
                innerRef={filterFormRef as any}
              >
                {actions => (
                  <>
                    <div className={'th reset-filter svg-btn'}>
                      {filterable && (
                        <TooltipWrapper
                          toolTipId="properties-list-filter-reset-tooltip"
                          toolTip="Reset Filter"
                        >
                          <Button
                            onClick={() => {
                              const nextState: any = { ...props.filter };
                              const fields = keys(props.filter || {});
                              for (const key of fields) {
                                if (Array.isArray(nextState[key])) {
                                  nextState[key] = [];
                                } else {
                                  nextState[key] = '';
                                }
                              }

                              actions.resetForm(nextState);
                              if (!!props.onFilterChange) {
                                props.onFilterChange(nextState);
                              }
                            }}
                            variant="secondary"
                            style={{ width: 20, height: 20 }}
                            icon={<FaUndo size={10} />}
                          ></Button>
                        </TooltipWrapper>
                      )}
                    </div>
                    {headerGroup.headers.map((column: ColumnInstanceWithProps<T>) => (
                      <div
                        {...(props.hideHeaders
                          ? column.getHeaderProps(noHeaders)
                          : column.getHeaderProps(headerProps))}
                        className={classnames(
                          'th',
                          column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : '',
                        )}
                      >
                        {renderHeaderCell(column)}
                      </div>
                    ))}
                  </>
                )}
              </Formik>
            </div>
          ))}
        </div>
        {renderBody}
        {renderFooter()}
      </div>
      {!props.hideToolbar && (
        <div className="table-toolbar">
          {props.pageSize !== -1 && <TablePagination<T> instance={instance} />}
          {!props.lockPageSize && props.data.length > 0 && !props.lockPageSize && (
            <TablePageSizeSelector
              options={props.pageSizeOptions || DEFAULT_PAGE_SELECTOR_OPTIONS}
              value={props.pageSize || DEFAULT_PAGE_SIZE}
              onChange={onPageSizeChange}
              alignTop={
                props.pageSizeMenuDropUp ? props.pageSizeMenuDropUp : props.data.length >= 20
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default Table;
