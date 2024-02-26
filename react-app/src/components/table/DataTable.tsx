import React, { MutableRefObject, PropsWithChildren, useMemo, useState } from 'react';
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
  Tooltip,
  Typography,
  debounce,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridOverlay,
  GridRenderCellParams,
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
  onPresetFilterChange: (value: string, ref: MutableRefObject<GridApiCommunity>) => void;
  defaultFilter: string;
  presetFilterSelectOptions: JSX.Element[];
  tableHeader: string;
  excelTitle: string;
} & DataGridProps;

export const FilterSearchDataGrid = (props: FilterSearchDataGridProps) => {
  const [rowCount, setRowCount] = useState<number>(0);
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
  const [gridFilterItems, setGridFilterItems] = useState([]);
  const [selectValue, setSelectValue] = useState<string>(props.defaultFilter);
  const tableApiRef = useGridApiRef(); // Ref to MUI DataGrid

  // Sets quickfilter value of DataGrid. newValue is a string input.
  const updateSearchValue = useMemo(() => {
    return debounce((newValue) => {
      tableApiRef.current.setQuickFilterValues(newValue.split(' ').filter((word) => word !== ''));
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
          <Tooltip
            title={
              'Adding a new user from this table is not supported yet. Please advise users to use the sign-up form.'
            }
          >
            <span>
              <IconButton disabled>
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton
              onClick={() => {
                downloadExcelFile({
                  data: gridFilteredSortedRowEntriesSelector(tableApiRef),
                  tableName: props.excelTitle,
                  filterName: selectValue,
                  includeDate: true,
                });
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Select
            onChange={(e) => {
              setKeywordSearchContents('');
              props.onPresetFilterChange(e.target.value, tableApiRef);
              setSelectValue(e.target.value);
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
          // Get the filter items from MUI, filter out blanks, set state
          setGridFilterItems(e.items.filter((item) => item.value));
        }}
        apiRef={tableApiRef}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: {
            sortModel: [{ field: 'created', sort: 'desc' }],
          },
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
          // Take out the hover colour
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
            padding: '16px',
          },
        }}
        slots={{ toolbar: KeywordSearch }}
        {...props}
      />
    </>
  );
};
