import React, {
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import Icon from '@mdi/react';
import { mdiDotsHorizontal } from '@mdi/js';
import {
  Box,
  IconButton,
  LinearProgress,
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
  GridOverlay,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowId,
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
import useDataLoader from '@/hooks/useDataLoader';

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
    <DataGrid {...props} slots={{ noRowsOverlay: NoRowsOverlay, loadingOverlay: LinearProgress }} />
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
  dataSource: (filter: CommonFiltering) => Promise<any[]>;
  onPresetFilterChange: (value: string, ref: MutableRefObject<GridApiCommunity>) => void;
  onAddButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
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
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState<number>(0);
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
  const [gridFilterItems, setGridFilterItems] = useState([]);
  const [selectValue, setSelectValue] = useState<string>(props.defaultFilter);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const tableApiRef = useGridApiRef(); // Ref to MUI DataGrid

  useEffect(() => {
    console.log(`New pagination value: ${JSON.stringify(pagination)}`);
    tableApiRef.current.setPaginationModel(pagination);
    props
      .dataSource({ quantity: pagination.pageSize, page: pagination.page })
      .then((ret) => setRows(ret));
  }, [pagination]);

  /**
   * @interface
   * @description Defines possible query parameters for table state
   */
  interface QueryStrings {
    keywordFilter?: string;
    quickSelectFilter?: string;
    columnFilterName?: string;
    columnFilterValue?: string;
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
    console.log(`Ran layoutEffect: ${JSON.stringify(query, null, 2)}`);
    // If query strings exist, prioritize that for preset filters, etc.
    if (Boolean(Object.keys(query).length)) {
      // Set keyword filter
      if (query.keywordFilter) {
        setKeywordSearchContents(query.keywordFilter);
        updateSearchValue(query.keywordFilter);
      }
      // Set quick select filter
      if (query.quickSelectFilter) {
        setSelectValue(query.quickSelectFilter);
        props.onPresetFilterChange(query.quickSelectFilter, tableApiRef);
      }
      // Set other column filter
      if (query.columnFilterName && query.columnFilterValue) {
        tableApiRef.current.setFilterModel({
          items: [
            {
              value: query.columnFilterValue,
              operator: 'contains',
              field: query.columnFilterName,
            },
          ],
        });
      }
      // Set sorting options
      if (query.columnSortName && query.columnSortValue) {
        tableApiRef.current.setSortModel([
          {
            field: query.columnSortName,
            sort: query.columnSortValue,
          },
        ]);
      }
      //Set pagination
      if (query.page && query.pageSize) {
        setPagination({ page: Number(query.page), pageSize: Number(query.pageSize) });
      }
    } else {
      // Setting the table's state from sessionStorage cookies
      const stateFromLocalStorage = sessionStorage?.getItem(props.name);
      if (stateFromLocalStorage) {
        const state: GridState = JSON.parse(stateFromLocalStorage);
        // Set sort
        if (state.sorting) {
          tableApiRef.current.setSortModel(state.sorting.sortModel);
        }
        if (state.pagination) {
          // Pagination and visibility are local only
          tableApiRef.current.setPaginationModel(state.pagination.paginationModel);
        }
        if (state.columns) {
          tableApiRef.current.setColumnVisibilityModel(state.columns.columnVisibilityModel);
        }
        // Set filters
        if (state.filter) {
          tableApiRef.current.setFilterModel(state.filter.filterModel);
          // Set Select filter
          // Without MUI Pro, only one item can be in this model at a time
          if (state.filter.filterModel.items.length > 0) {
            setSelectValue(state.filter.filterModel.items.at(0).value);
            setQuery({
              quickSelectFilter: state.filter.filterModel.items.at(0).value,
            });
          }
          // Set keyword search bar
          if (state.filter.filterModel.quickFilterValues) {
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
      setQuery({
        keywordFilter: newValue,
      });
    }, 100);
  }, [tableApiRef]);

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
            {`${props.tableHeader} (${rowCount ?? 0} rows)`}
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
            onChange={updateSearchValue}
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
              setQuery({ quickSelectFilter: e.target.value, keywordFilter: undefined });
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
          setRowCount(Object.values(e.filter.filteredRowsLookup).filter((value) => value).length);
        }}
        onFilterModelChange={(e) => {
          // Can only filter by 1 at a time without DataGrid Pro
          if (e.items.length > 0) {
            const item = e.items.at(0);
            setQuery({ columnFilterName: item.field, columnFilterValue: item.value });
          } else {
            setQuery({ columnFilterName: undefined, columnFilterValue: undefined });
          }
          // Get the filter items from MUI, filter out blanks, set state
          setGridFilterItems(e.items.filter((item) => item.value));
        }}
        onSortModelChange={(e) => {
          // Can only sort by 1 at a time without DataGrid Pro
          if (e.length > 0) {
            const item = e.at(0);
            setQuery({ columnSortName: item.field, columnSortValue: item.sort });
          } else {
            setQuery({ columnSortName: undefined, columnSortValue: undefined });
          }
        }}
        paginationMode="server"
        rowCount={-1}
        paginationMeta={{ hasNextPage: rows.length === pagination.pageSize }}
        onPaginationModelChange={(model) => {
          setPagination(model);
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
          overflow: 'scroll',
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
        slots={{ toolbar: KeywordSearch, noRowsOverlay: NoRowsOverlay }}
        {...props}
        rows={rows ?? []}
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
