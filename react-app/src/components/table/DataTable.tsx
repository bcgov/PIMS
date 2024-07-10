import React, {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from '@mdi/react';
import { mdiDotsHorizontal } from '@mdi/js';
import {
  Box,
  IconButton,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Select,
  SxProps,
  Tooltip,
  Typography,
  debounce,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridFilterModel,
  GridOverlay,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
  GridSortModel,
  GridState,
  GridTreeNodeWithRender,
  GridValidRowModel,
  gridFilteredSortedRowEntriesSelector,
  useGridApiRef,
} from '@mui/x-data-grid';
import { downloadExcelFile } from '@/utilities/downloadExcelFile';
import KeywordSearch from './KeywordSearch';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GridInitialStateCommunity } from '@mui/x-data-grid/models/gridStateCommunity';
import CircularProgress from '@mui/material/CircularProgress';
import { CommonFiltering } from '@/interfaces/ICommonFiltering';

type RenderCellParams = GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;

const NoRowsOverlay = (): JSX.Element => {
  return (
    <GridOverlay sx={{ height: '100%' }}>
      <Typography>No rows to display.</Typography>
    </GridOverlay>
  );
};

interface IDataGridFloatingMenuAction {
  label: string;
  iconPath: string;
  action: (cellParams: RenderCellParams) => void;
}

interface IDataGridFloatingMenuProps {
  menuActions: IDataGridFloatingMenuAction[];
  cellParams: RenderCellParams;
}

export const DataGridFloatingMenu = (props: IDataGridFloatingMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="data-grid-actions"
        onClick={handleClick}
        data-testid="data-grid-actions"
        tabIndex={0}
      >
        <Icon path={mdiDotsHorizontal} size={1} />
      </IconButton>
      <Menu
        sx={{ boxShadow: '3px' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id="data-grid-menu-container"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {props.menuActions.map((action) => (
          <MenuItem
            key={`menu-action-${action.label}`}
            onClick={() => {
              handleClose();
              action.action(props.cellParams);
            }}
          >
            <ListItemIcon>
              <Icon path={action.iconPath} size={1} />
            </ListItemIcon>
            <Typography variant="inherit">{action.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const CustomDataGrid = (props: DataGridProps) => {
  return (
    <DataGrid
      {...props}
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'skeleton',
        },
      }}
    />
  );
};

export const CustomMenuItem = (props: PropsWithChildren & { value: string }) => {
  const theme = useTheme();
  return (
    <MenuItem
      sx={{
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
        height: '2.3em',
      }}
      {...props}
    >
      {props.children}
    </MenuItem>
  );
};

export const CustomListSubheader = (props: PropsWithChildren) => {
  const theme = useTheme();
  return (
    <ListSubheader
      sx={{
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeightBold,
        color: 'rgba(0, 0, 0, 1)',
        height: '2.3em',
        marginBottom: '5px',
      }}
      {...props}
    >
      {props.children}
    </ListSubheader>
  );
};

type FilterSearchDataGridProps = {
  dataSource?: (filter: CommonFiltering, signal: AbortSignal) => Promise<any[]>;
  tableOperationMode: 'client' | 'server';
  onPresetFilterChange: (value: string, ref: MutableRefObject<GridApiCommunity>) => void;
  onAddButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  rowCountProp?: number;
  defaultFilter: string;
  presetFilterSelectOptions: JSX.Element[];
  tableHeader: string;
  excelTitle: string;
  customExcelData?: (ref: MutableRefObject<GridApiCommunity>) => Promise<
    {
      id: GridRowId;
      model: GridValidRowModel;
    }[]
  >;
  addTooltip: string;
  name: string;
  initialState?: GridInitialStateCommunity;
} & DataGridProps;

export const FilterSearchDataGrid = (props: FilterSearchDataGridProps) => {
  const DEFAULT_PAGE = 0;
  const DEFAULT_PAGESIZE = 100;

  const [dataSourceRows, setDataSourceRows] = useState([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [tableModel, setTableModel] = useState<ITableModelCollection>({
    pagination: {
      page: props.initialState?.pagination?.paginationModel?.page ?? DEFAULT_PAGE,
      pageSize: props.initialState?.pagination?.paginationModel?.pageSize ?? DEFAULT_PAGESIZE,
    },
    sort: props.initialState?.sorting?.sortModel ?? undefined,
  });
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
  const [gridFilterItems, setGridFilterItems] = useState([]);
  const [selectValue, setSelectValue] = useState<string>(props.defaultFilter);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [dataSourceLoading, setDataSourceLoading] = useState<boolean>(false);
  const tableApiRef = useGridApiRef(); // Ref to MUI DataGrid
  const previousController = useRef<AbortController>();

  interface ITableModelCollection {
    pagination?: GridPaginationModel;
    sort?: GridSortModel;
    filter?: GridFilterModel;
    quickFilter?: string[];
  }

  const formatHeaderToFilterKey = (headerName: string) => {
    switch (headerName) {
      case 'PID':
      case 'PIN':
        return headerName.toLowerCase();
      default:
        return headerName.charAt(0).toLowerCase() + headerName.slice(1);
    }
  };

  const dataSourceUpdate = (models: ITableModelCollection) => {
    const { pagination, sort, filter, quickFilter } = models;
    if (previousController.current) {
      previousController.current.abort();
    }
    //We use this AbortController to cancel requests that haven't finished yet everytime we start a new one.
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;
    let sortObj: { sortKey?: string; sortOrder?: string; sortRelation?: string } = {};
    if (sort?.length) {
      sortObj = { sortKey: sort[0].field, sortOrder: sort[0].sort };
    }
    const filterObj = {};
    if (filter?.items) {
      for (const f of filter.items) {
        const asCamelCase = formatHeaderToFilterKey(f.field);
        if (f.value != undefined && String(f.value) !== 'Invalid Date') {
          filterObj[asCamelCase] = `${f.operator},${f.value}`;
        } else if (f.operator === 'isNotEmpty' || f.operator === 'isEmpty') {
          filterObj[asCamelCase] = f.operator;
        }
      }
    }
    if (quickFilter) {
      const keyword = quickFilter[0];
      if (keyword) filterObj['quickFilter'] = `contains,${keyword}`;
      // for (const fieldName of tableApiRef.current.getAllColumns().map((col) => col.field)) {
      //   if (keyword != undefined) {
      //     const asCamelCase = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
      //     filterObj[asCamelCase] = `contains,${keyword}`;
      //   }
      // }
    }
    setDataSourceLoading(true);
    props
      .dataSource(
        {
          quantity: pagination.pageSize,
          page: pagination.page,
          ...sortObj,
          ...filterObj,
        },
        signal,
      )
      .then((resolved) => {
        setDataSourceRows(resolved);
      })
      .catch((e) => {
        if (!(e instanceof DOMException)) {
          //Represses DOMException which is the expected result of aborting the connection.
          //If something else happens though, we may want to rethrow that.
          throw e;
        }
      })
      .finally(() => {
        setDataSourceLoading(false);
      });
  };

  useEffect(() => {
    if (props.dataSource) {
      dataSourceUpdate(tableModel);
    }
  }, [tableModel]);

  /**
   * @interface
   * @description Defines possible query parameters for table state
   */
  interface QueryStrings {
    keywordFilter?: string;
    quickSelectFilter?: string;
    columnFilterName?: string;
    columnFilterValue?: string;
    columnFilterMode?: string;
    columnSortName?: string;
    columnSortValue?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }

  /**
   * @description Sets the query parameters in the URL
   * @param {QueryStrings} query An object with possible query string key-value pairs
   */
  const setQuery = (query: QueryStrings) => {
    if ('URLSearchParams' in window) {
      const searchParams = new URLSearchParams(window.location.search);
      Object.entries(query).forEach((entry) => {
        const [key, value] = entry;
        // Remove is one of these values
        if (value === null || value === undefined || value === '') searchParams.delete(key);
        // Otherwise set the query param
        else searchParams.set(key, `${value}`);
      });
      // Replace existing entry in the browser history
      const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
      history.replaceState(null, '', newRelativePathQuery);
    }
  };

  /**
   * @description Gets the query parameters from the URL
   * @returns An object with properties matching URL query parameters
   */
  const getQuery: () => QueryStrings = () => {
    if ('URLSearchParams' in window) {
      const searchParams = Object.fromEntries(new URLSearchParams(window.location.search));
      return searchParams;
    }
    return {};
  };

  /**
   * @description Clears all query parameters from the URL.
   */
  const clearQuery = () => {
    history.replaceState(null, '', window.location.pathname);
  };

  /**
   * @description Saves the current table state to a cookie based on a provided name
   */
  const saveSnapshot = useCallback(() => {
    if (sessionStorage) {
      if (tableApiRef?.current?.exportState) {
        const currentState = tableApiRef.current.exportState();
        sessionStorage.setItem(props.name, JSON.stringify(currentState));
      }
    }
  }, [tableApiRef]);

  /**
   * @description Hook that runs after render. Looks to query strings to set filter. If none are found, then looks to state cookie.
   */
  useLayoutEffect(() => {
    const query = getQuery();
    // If query strings exist, prioritize that for preset filters, etc.
    // const model: ITableModelCollection = {
    //   pagination: { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGESIZE },
    //   sort: undefined,
    //   filter: undefined,
    //   quickFilter: undefined,
    // };
    if (Boolean(Object.keys(query).length)) {
      // Set quick select filter
      if (query.quickSelectFilter) {
        setSelectValue(query.quickSelectFilter);
        props.onPresetFilterChange(query.quickSelectFilter, tableApiRef);
      }
      // Set other column filter
      if (
        (query.columnFilterName && query.columnFilterValue && query.columnFilterMode) ||
        query.quickSelectFilter
      ) {
        // model.quickFilter = undefined;
        const modelObj: GridFilterModel = {
          items: undefined,
          quickFilterValues: undefined,
        };
        if (query.columnFilterName && query.columnFilterValue && query.columnFilterMode) {
          modelObj.items = [
            {
              value: query.columnFilterValue,
              operator: query.columnFilterMode,
              field: query.columnFilterName,
            },
          ];
        }
        if (query.keywordFilter) {
          setKeywordSearchContents(query.keywordFilter);
          modelObj.quickFilterValues = query.keywordFilter.split(' ').filter((a) => a !== '');
        }
        //model.filter = modelObj;
        tableApiRef.current.setFilterModel(modelObj);
      }
      // Set sorting options
      if (query.columnSortName && query.columnSortValue) {
        //model.sort = [{ field: query.columnSortName, sort: query.columnSortValue }];
        tableApiRef.current.setSortModel([
          { field: query.columnSortName, sort: query.columnSortValue },
        ]);
      }
      //Set pagination
      if (query.page && query.pageSize) {
        //model.pagination = { page: Number(query.page), pageSize: Number(query.pageSize) };
        tableApiRef.current.setPaginationModel({
          page: Number(query.page),
          pageSize: Number(query.pageSize),
        });
      }
      //setTableModel(model);
    } else {
      // Setting the table's state from sessionStorage cookies
      const model: ITableModelCollection = {
        pagination: { page: 0, pageSize: 10 },
        sort: undefined,
        filter: undefined,
        quickFilter: undefined,
      };
      const stateFromLocalStorage = sessionStorage?.getItem(props.name);
      if (stateFromLocalStorage) {
        const state: GridState = JSON.parse(stateFromLocalStorage);
        // Set sort
        if (state.sorting) {
          tableApiRef.current.setSortModel(state.sorting.sortModel);
          model.sort = state.sorting.sortModel;
        }
        if (state.pagination) {
          // Pagination and visibility are local only
          tableApiRef.current.setPaginationModel(state.pagination.paginationModel);
          model.pagination = state.pagination.paginationModel;
        }
        if (state.columns) {
          tableApiRef.current.setColumnVisibilityModel(state.columns.columnVisibilityModel);
          //Is this still used?
        }
        // Set filters
        if (state.filter) {
          tableApiRef.current.setFilterModel(state.filter.filterModel);
          // Set Select filter
          // Without MUI Pro, only one item can be in this model at a time
          if (state.filter.filterModel.items.length > 0) {
            model.filter = state.filter.filterModel;
            setSelectValue(state.filter.filterModel.items.at(0).value);
            setQuery({
              quickSelectFilter: state.filter.filterModel.items.at(0).value,
            });
          }
          // Set keyword search bar
          if (state.filter.filterModel.quickFilterValues) {
            model.quickFilter = state.filter.filterModel.quickFilterValues;
            const filterValue = state.filter.filterModel.quickFilterValues.join(' ');
            setKeywordSearchContents(filterValue);
            setQuery({
              keywordFilter: filterValue,
            });
          }
        }
      }
    }

    // handle refresh and navigating away/refreshing
    window.addEventListener('beforeunload', saveSnapshot);

    return () => {
      // in case of an SPA remove the event-listener
      // window.removeEventListener('beforeunload', saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);

  // Sets quickfilter value of DataGrid. newValue is a string input.
  const updateSearchValue = useMemo(() => {
    return debounce((newValue) => {
      tableApiRef.current.setQuickFilterValues(newValue.split(' ').filter((word) => word !== ''));
      const defaultpagesize = { page: 0, pageSize: tableModel.pagination.pageSize };
      tableApiRef.current.setPaginationModel(defaultpagesize);
      // console.log(`updateSearchValue: ${JSON.stringify(tableModel)}`);
      // setTableModel({
      //   ...tableModel,
      //   pagination: defaultpagesize,
      //   quickFilter: newValue.split(' ').filter((word) => word !== ''),
      // });
      // setQuery({
      //   ...defaultpagesize,
      //   keywordFilter: newValue,
      // });
    }, 300);
  }, [tableApiRef]);

  const tableHeaderRowCount = useMemo(() => {
    return props.tableOperationMode === 'client'
      ? `(${rowCount ?? 0} rows)`
      : `(${props.rowCountProp ?? 0} rows)`;
  }, [props.tableOperationMode, rowCount, props.rowCountProp]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1em',
        }}
      >
        <Box display={'flex'}>
          <Typography variant="h4" alignSelf={'center'} marginRight={'1em'}>
            {`${props.tableHeader} ${tableHeaderRowCount}`}
          </Typography>
          {keywordSearchContents || gridFilterItems.length > 0 ? (
            <Tooltip title="Clear Filter">
              <IconButton
                onClick={() => {
                  // Set both DataGrid and Keyword search back to blanks
                  tableApiRef.current.setFilterModel({ items: [] });
                  setKeywordSearchContents('');
                  // Set select field back to default
                  setSelectValue(props.defaultFilter);
                  // Clear query params
                  clearQuery();
                  setTableModel({
                    pagination: { page: 0, pageSize: tableModel.pagination.pageSize },
                  });
                }}
              >
                <FilterAltOffIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
        </Box>
        <Box
          display={'flex'}
          maxHeight={'2.5em'}
          sx={{
            '> *': {
              // Applies to all children
              margin: '0 2px',
            },
          }}
        >
          <KeywordSearch
            onChange={(e) => {
              updateSearchValue(e);
            }}
            optionalExternalState={[keywordSearchContents, setKeywordSearchContents]}
          />
          <Tooltip title={props.addTooltip}>
            <span>
              <IconButton onClick={props.onAddButtonClick} disabled={!props.onAddButtonClick}>
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton
              onClick={async () => {
                setIsExporting(true);
                downloadExcelFile({
                  data: props.customExcelData
                    ? await props.customExcelData(tableApiRef)
                    : gridFilteredSortedRowEntriesSelector(tableApiRef),
                  tableName: props.excelTitle,
                  filterName: selectValue,
                  includeDate: true,
                });
                setIsExporting(false);
              }}
            >
              {isExporting ? <CircularProgress size={24} /> : <DownloadIcon />}
            </IconButton>
          </Tooltip>
          <Select
            onChange={(e) => {
              setKeywordSearchContents('');
              setSelectValue(e.target.value);
              setQuery({ quickSelectFilter: e.target.value, keywordFilter: undefined }); // Clear keywordFilter too
              setTableModel({ ...tableModel, filter: undefined }); // Clear existing column filters
              props.onPresetFilterChange(`${e.target.value}`, tableApiRef);
            }}
            sx={{ width: '10em', marginLeft: '0.5em' }}
            value={selectValue}
          >
            {props.presetFilterSelectOptions}
          </Select>
        </Box>
      </Box>
      <CustomDataGrid
        onStateChange={(e) => {
          // Keep track of row count separately
          if (!props.dataSource) {
            setRowCount(Object.values(e.filter.filteredRowsLookup).filter((value) => value).length);
          }
        }}
        onFilterModelChange={(e) => {
          // Can only filter by 1 at a time without DataGrid Pro
          const model: ITableModelCollection = {};
          if (e.items.length > 0) {
            const item = e.items.at(0);
            model.filter = e;
            setQuery({
              columnFilterName: item.field,
              columnFilterValue: item.value,
              columnFilterMode: item.operator,
            });
          } else {
            model.filter = e;
            setQuery({
              columnFilterName: undefined,
              columnFilterValue: undefined,
              columnFilterMode: undefined,
            });
          }

          if (e.quickFilterValues) {
            model.quickFilter = e.quickFilterValues;
            setQuery({ keywordFilter: e.quickFilterValues.join(' ') });
          } else {
            model.quickFilter = undefined;
            setQuery({ keywordFilter: undefined });
          }
          setTableModel({
            ...tableModel,
            ...model,
            pagination: { page: 0, pageSize: DEFAULT_PAGESIZE },
          });
          // Get the filter items from MUI, filter out blanks, set state
          setGridFilterItems(e.items.filter((item) => item.value));
        }}
        onSortModelChange={(e) => {
          // Can only sort by 1 at a time without DataGrid Pro
          if (e.length > 0) {
            const item = e.at(0);
            setTableModel({
              ...tableModel,
              sort: e,
            });
            setQuery({ columnSortName: item.field, columnSortValue: item.sort });
          } else {
            setTableModel({
              ...tableModel,
              sort: undefined,
            });
            setQuery({ columnSortName: undefined, columnSortValue: undefined });
          }
        }}
        paginationMode={props.tableOperationMode}
        sortingMode={props.tableOperationMode}
        filterMode={props.tableOperationMode}
        rowCount={props.dataSource ? -1 : undefined}
        paginationMeta={props.dataSource ? { hasNextPage: false } : undefined}
        onPaginationModelChange={(model) => {
          setTableModel({ ...tableModel, pagination: model });
          setQuery({ page: model.page, pageSize: model.pageSize });
        }}
        apiRef={tableApiRef}
        initialState={{
          pagination: {
            paginationModel: { pageSize: getQuery().pageSize ?? 10, page: getQuery().page ?? 0 },
          },
          ...props.initialState,
        }}
        pageSizeOptions={[10, 20, 30, 100]} // DataGrid max is 100
        disableRowSelectionOnClick
        sx={{
          width: '100%',
          minHeight: '200px',
          // Neutralize the hover colour (causing a flash)
          '& .MuiDataGrid-row.Mui-hovered': {
            backgroundColor: 'transparent',
          },
          // We want hover colour and pointer cursor
          '& .MuiDataGrid-row:hover': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
        loading={dataSourceLoading}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        {...props}
        rows={dataSourceRows && props.dataSource ? dataSourceRows : props.rows}
      />
    </>
  );
};

type PinnedColumnDataGridProps = {
  pinnedFields: string[];
  pinnedSxProps?: SxProps;
  scrollableSxProps?: SxProps;
} & DataGridProps;

/**
 * This is a somewhat hacky workaround for pinned columns in the community version of mui-x.
 * If we ever get a Pro sub, we can just get rid of this entirely.
 * All the sorting and filtering options are disabled since this is just two data grids smushed together
 * and their states are not synced at all.
 */
export const PinnedColumnDataGrid = (props: PinnedColumnDataGridProps) => {
  const { columns, rows, pinnedFields, scrollableSxProps, pinnedSxProps, ...rest } = props;
  columns.forEach((col) => (col.sortable = false));
  const pinnedColumns = columns.filter((col) => pinnedFields.find((a) => a === col.field));
  const scrollableColumns = columns.filter((col) => !pinnedFields.find((a) => a === col.field));

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Box
        display={'flex'}
        boxShadow={'2px 0px 5px 0px rgba(0, 0, 0, 0.12)'}
        style={{ flex: '0 0 auto' }}
        sx={{ clipPath: 'inset(0px -10px 0px 0px);' }}
        width={'auto'}
      >
        <DataGrid
          columns={pinnedColumns}
          rows={rows}
          disableColumnMenu
          disableColumnFilter
          disableRowSelectionOnClick
          autoHeight
          sx={pinnedSxProps}
          {...rest}
        />
      </Box>
      <Box display={'flex'} width={'auto'} style={{ flex: '1 1 auto', overflowX: 'auto' }}>
        <DataGrid
          columns={scrollableColumns}
          rows={rows}
          disableColumnMenu
          disableColumnFilter
          disableRowSelectionOnClick
          autoHeight
          sx={scrollableSxProps}
          {...rest}
        />
      </Box>
    </Box>
  );
};
