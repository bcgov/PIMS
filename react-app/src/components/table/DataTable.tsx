import React, {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
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
  Theme,
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
  GridSortDirection,
  GridSortModel,
  GridTreeNodeWithRender,
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
import { useSearchParams } from 'react-router-dom';
import { Roles } from '@/constants/roles';
import { UserContext } from '@/contexts/authContext';
import { SnackBarContext } from '@/contexts/snackbarContext';

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

export const CustomMenuItem = (
  props: PropsWithChildren & { value: string; sx?: SxProps<Theme> },
) => {
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
  excelDataSource?: (filter: CommonFiltering, signal: AbortSignal) => Promise<any[]>;
  tableOperationMode: 'client' | 'server';
  onPresetFilterChange: (value: string, ref: MutableRefObject<GridApiCommunity>) => void;
  onAddButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  rowCountProp?: number;
  defaultFilter: string;
  presetFilterSelectOptions: JSX.Element[];
  tableHeader: string;
  excelTitle: string;
  customExcelMap?: (data: unknown[]) => Record<string, unknown>[];
  addTooltip: string;
  name: string;
  initialState?: GridInitialStateCommunity;
} & DataGridProps;

export const FilterSearchDataGrid = (props: FilterSearchDataGridProps) => {
  const DEFAULT_PAGE = 0;
  const DEFAULT_PAGESIZE = 100;

  const [searchParams, setSearchParams] = useSearchParams();
  const [dataSourceRows, setDataSourceRows] = useState([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
  const [gridFilterItems, setGridFilterItems] = useState([]);
  const [selectValue, setSelectValue] = useState<string>(props.defaultFilter);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [dataSourceLoading, setDataSourceLoading] = useState<boolean>(false);
  const tableApiRef = useGridApiRef(); // Ref to MUI DataGrid
  const previousController = useRef<AbortController>();
  const snackbar = useContext(SnackBarContext);

  interface ITableModelCollection {
    pagination?: GridPaginationModel;
    sort?: GridSortModel;
    filter?: GridFilterModel;
    quickFilter?: string[];
  }

  type DataTableSearchParamKeys =
    | 'keywordFilter'
    | 'quickSelectFilter'
    | 'columnFilterName'
    | 'columnFilterValue'
    | 'columnFilterMode'
    | 'columnSortName'
    | 'columnSortValue'
    | 'page'
    | 'pageSize';

  // Some thin wrappers around searchParams hook manipulation to try and provide some type safety, otherwise it's possible to accidentally
  // manipulate keys that aren't recognized by the rest of the DataTable features.
  const getSearchParamsKey = (key: DataTableSearchParamKeys) => searchParams.get(key);
  const setSearchParamsKey = (keyValuePairs: Partial<Record<DataTableSearchParamKeys, string>>) => {
    setSearchParams((params) => {
      for (const [key, val] of Object.entries(keyValuePairs)) {
        params.set(key, val);
      }
      return params;
    });
  };
  const deleteSearchParamsKey = (keys: DataTableSearchParamKeys[]) => {
    setSearchParams((params) => {
      for (const key of keys) {
        params.delete(key);
      }
      return params;
    });
  };

  const formatHeaderToFilterKey = (headerName: string) => {
    switch (headerName) {
      case 'PID':
      case 'PIN':
        return headerName.toLowerCase();
      default:
        return headerName.charAt(0).toLowerCase() + headerName.slice(1);
    }
  };

  const createFilterObject = (filter: GridFilterModel, quickFilter: string[]) => {
    const filterObj = {};
    if (filter?.items) {
      for (const f of filter.items) {
        if (f.value == '') continue; // Skip empty fields
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
    }
    return filterObj;
  };

  const createSortObj = (sort: GridSortModel) => {
    let sortObj: { sortKey?: string; sortOrder?: string; sortRelation?: string } = {};
    if (sort?.length) {
      sortObj = { sortKey: sort[0].field, sortOrder: sort[0].sort };
    }
    return sortObj;
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

    const sortObj = createSortObj(sort);
    const filterObj = createFilterObject(filter, quickFilter);
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
    const model: ITableModelCollection = {
      pagination: {
        pageSize: getSearchParamsKey('pageSize')
          ? Number(getSearchParamsKey('pageSize'))
          : DEFAULT_PAGESIZE,
        page: getSearchParamsKey('page') ? Number(getSearchParamsKey('page')) : DEFAULT_PAGE,
      },
      sort: [],
      filter: { items: [] },
      quickFilter: [],
    };
    if (
      getSearchParamsKey('columnFilterName') &&
      getSearchParamsKey('columnFilterValue') &&
      getSearchParamsKey('columnFilterMode') &&
      getSearchParamsKey('columnFilterValue') !== 'undefined'
    ) {
      model.filter.items = [
        {
          value: getSearchParamsKey('columnFilterValue'),
          operator: getSearchParamsKey('columnFilterMode'),
          field: getSearchParamsKey('columnFilterName'),
        },
      ];
    }
    if (getSearchParamsKey('keywordFilter')) {
      model.quickFilter = getSearchParamsKey('keywordFilter').split(' ');
    }
    if (getSearchParamsKey('columnSortName') && getSearchParamsKey('columnSortValue')) {
      model.sort = [
        {
          field: getSearchParamsKey('columnSortName'),
          sort: getSearchParamsKey('columnSortValue') as GridSortDirection,
        },
      ];
    }
    if (props.dataSource) {
      dataSourceUpdate(model);
    }
  }, [searchParams]);

  /**
   * @description Hook that runs after render. Looks to query strings to set filter. If none are found, then looks to state cookie.
   */
  useEffect(() => {
    if (Boolean(searchParams.size)) {
      if (getSearchParamsKey('keywordFilter')) {
        setKeywordSearchContents(getSearchParamsKey('keywordFilter'));
        updateSearchValue(getSearchParamsKey('keywordFilter'));
      }
      // Set quick select filter
      if (getSearchParamsKey('quickSelectFilter')) {
        setSelectValue(getSearchParamsKey('quickSelectFilter'));
        props.onPresetFilterChange(getSearchParamsKey('quickSelectFilter'), tableApiRef);
      }
      // Set other column filter
      if (
        getSearchParamsKey('columnFilterName') &&
        getSearchParamsKey('columnFilterValue') &&
        getSearchParamsKey('columnFilterMode')
      ) {
        const modelObj: GridFilterModel = {
          items: [],
          quickFilterValues: undefined,
        };
        modelObj.items = [
          {
            value: getSearchParamsKey('columnFilterValue'),
            operator: getSearchParamsKey('columnFilterMode'),
            field: getSearchParamsKey('columnFilterName'),
          },
        ];
        tableApiRef.current.setFilterModel(modelObj);
      }
      // Set sorting options
      if (getSearchParamsKey('columnSortName') && getSearchParamsKey('columnSortValue')) {
        tableApiRef.current.setSortModel([
          {
            field: getSearchParamsKey('columnSortName'),
            sort: getSearchParamsKey('columnSortValue') as GridSortDirection,
          },
        ]);
      }
      //Set pagination
      if (getSearchParamsKey('page') != undefined && getSearchParamsKey('pageSize') != undefined) {
        tableApiRef.current.setPaginationModel({
          page: Number(getSearchParamsKey('page')),
          pageSize: Number(getSearchParamsKey('pageSize')),
        });
      } else {
        //This should always get set to something even if there is no query param to load from, pagination may not work at all otherwise.
        tableApiRef.current.setPaginationModel({ page: DEFAULT_PAGE, pageSize: DEFAULT_PAGESIZE });
      }
    }
  }, [tableApiRef]);

  // Sets quickfilter value of DataGrid. newValue is a string input.
  const updateSearchValue = useMemo(() => {
    return debounce((newValue) => {
      tableApiRef.current.setQuickFilterValues(newValue.split(' ').filter((word) => word !== ''));
      const defaultpagesize = { page: 0, pageSize: DEFAULT_PAGESIZE };
      tableApiRef.current.setPaginationModel(defaultpagesize);
    }, 300);
  }, [tableApiRef]);

  const tableHeaderRowCount = useMemo(() => {
    return props.tableOperationMode === 'client'
      ? `(${rowCount ?? 0} rows)`
      : `(${props.rowCountProp ?? 0} rows)`;
  }, [props.tableOperationMode, rowCount, props.rowCountProp]);

  const { pimsUser } = useContext(UserContext);
  const isAuditor = pimsUser.hasOneOfRoles([Roles.AUDITOR]);

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
                  //Clear search params related to filtering
                  deleteSearchParamsKey([
                    'keywordFilter',
                    'quickSelectFilter',
                    'columnFilterMode',
                    'columnFilterName',
                    'columnFilterValue',
                  ]);
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
              {!isAuditor && (
                <IconButton onClick={props.onAddButtonClick} disabled={!props.onAddButtonClick}>
                  <AddIcon />
                </IconButton>
              )}
            </span>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton
              onClick={async () => {
                setIsExporting(true);
                let rows = [];
                if (props.tableOperationMode === 'server') {
                  const controller = new AbortController();
                  const signal = controller.signal;
                  const filterModel = {
                    filter: { items: [] },
                    quickFilter: [],
                  };
                  if (
                    getSearchParamsKey('columnFilterName') &&
                    getSearchParamsKey('columnFilterValue') &&
                    getSearchParamsKey('columnFilterMode')
                  ) {
                    filterModel.filter.items = [
                      {
                        value: getSearchParamsKey('columnFilterValue'),
                        operator: getSearchParamsKey('columnFilterMode'),
                        field: getSearchParamsKey('columnFilterName'),
                      },
                    ];
                  }
                  if (getSearchParamsKey('keywordFilter')) {
                    filterModel.quickFilter = getSearchParamsKey('keywordFilter').split(' ');
                  }
                  const sortFilterObj = {
                    ...createSortObj(tableApiRef.current.getSortModel()),
                    ...createFilterObject(filterModel.filter, filterModel.quickFilter),
                  };
                  rows = props.excelDataSource
                    ? await props.excelDataSource(sortFilterObj, signal)
                    : await props.dataSource(sortFilterObj, signal);
                } else {
                  // Client-side tables
                  rows = gridFilteredSortedRowEntriesSelector(tableApiRef).map((row) => row.model);
                }
                if (rows) {
                  if (props.customExcelMap) rows = props.customExcelMap(rows);
                  // Convert back to MUI table model
                  rows = rows.map((r, i) => ({
                    model: r,
                    id: i,
                  }));
                  downloadExcelFile({
                    data: rows,
                    tableName: props.excelTitle,
                    filterName: selectValue,
                    includeDate: true,
                  });
                } else {
                  snackbar.setMessageState({
                    style: snackbar.styles.warning,
                    text: 'Table failed to export.',
                    open: true,
                  });
                }
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
              setSearchParams((params) => {
                params.set('quickSelectFilter', e.target.value);
                params.delete('keywordFilter');
                return params;
              });
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
            setSearchParamsKey({
              columnFilterName: item.field,
              columnFilterValue: item.value,
              columnFilterMode: item.operator,
            });
          } else {
            model.filter = e;
            deleteSearchParamsKey(['columnFilterName', 'columnFilterValue', 'columnFilterMode']);
          }

          if (e.quickFilterValues) {
            model.quickFilter = e.quickFilterValues;
            setSearchParamsKey({ keywordFilter: e.quickFilterValues.join(' ') });
          } else {
            model.quickFilter = undefined;
            deleteSearchParamsKey(['keywordFilter']);
          }
          // Get the filter items from MUI, filter out blanks, set state
          setGridFilterItems(e.items.filter((item) => item.value));
        }}
        onSortModelChange={(e) => {
          // Can only sort by 1 at a time without DataGrid Pro
          if (e.length > 0) {
            const item = e.at(0);
            setSearchParamsKey({ columnSortName: item.field, columnSortValue: item.sort });
          } else {
            deleteSearchParamsKey(['columnSortName', 'columnSortValue']);
          }
        }}
        paginationMode={props.tableOperationMode}
        sortingMode={props.tableOperationMode}
        filterMode={props.tableOperationMode}
        rowCount={props.dataSource ? -1 : undefined}
        paginationMeta={props.dataSource ? { hasNextPage: false } : undefined}
        onPaginationModelChange={(model) => {
          setSearchParamsKey({ page: String(model.page), pageSize: String(model.pageSize) });
        }}
        apiRef={tableApiRef}
        // initialState={{
        //   pagination: {
        //     paginationModel: {
        //       pageSize: getSearchParamsKey('pageSize')
        //         ? Number(getSearchParamsKey('pageSize'))
        //         : DEFAULT_PAGE,
        //       page: getSearchParamsKey('page') ? Number(getSearchParamsKey('page')) : DEFAULT_PAGE,
        //     },
        //   },
        //   ...props.initialState,
        // }}
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
