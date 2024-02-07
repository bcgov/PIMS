import { CustomDataGrid } from '@/components/table/DataTable';
import {
  Box,
  Chip,
  Paper,
  SxProps,
  Typography,
  debounce,
  useTheme,
  IconButton,
  Select,
  ListSubheader,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { GridColDef, gridFilteredSortedRowEntriesSelector, useGridApiRef } from '@mui/x-data-grid';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import KeywordSearch from '@/components/table/KeywordSearch';
import { IUser } from '@/interfaces/IUser';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadExcelFile } from '@/utilities/downloadExcelFile';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';

const CustomMenuItem = (props: PropsWithChildren & { value: string }) => {
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

const CustomListSubheader = (props: PropsWithChildren) => {
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

const UsersTable = () => {
  // States and contexts
  const [users, setUsers] = useState([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('All Users');
  const [gridFilterItems, setGridFilterItems] = useState([]);
  const { state } = useKeycloak();
  const theme = useTheme();
  const tableApiRef = useGridApiRef(); // Ref to MUI DataGrid

  // Getting data from API
  const usersApi = usePimsApi();
  const { data, refreshData, isLoading, error } = useDataLoader(usersApi.users.getAllUsers);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
    if (data) {
      setUsers(data as IUser[]);
    } else {
      refreshData();
    }
  }, [state, data]);

  // Determines colours of chips
  const colorMap = {
    Pending: 'info',
    Active: 'success',
    Hold: 'warning',
  };

  // Sets quickfilter value of DataGrid. newValue is a string input.
  const updateSearchValue = useMemo(() => {
    return debounce((newValue) => {
      tableApiRef.current.setQuickFilterValues(newValue.split(' ').filter((word) => word !== ''));
    }, 100);
  }, [tableApiRef]);

  // Converts dates to the MMM DD, YYYY locale
  const dateFormatter = (params) =>
    params.value
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }).format(new Date(params.value))
      : undefined;

  // Sets the preset filter based on the select input
  const selectPresetFilter = (value: string) => {
    // Clear the quick search contents
    setKeywordSearchContents('');
    switch (value) {
      case 'All Users':
        tableApiRef.current.setFilterModel({ items: [] });
        break;
      // All Status filters
      case 'Active':
      case 'Pending':
      case 'Hold':
        tableApiRef.current.setFilterModel({
          items: [
            {
              value,
              operator: 'contains',
              field: 'Status',
            },
          ],
        });
        break;
      // All Role filters
      case 'User':
      case 'Admin':
        tableApiRef.current.setFilterModel({
          items: [
            {
              value,
              operator: 'contains',
              field: 'Role',
            },
          ],
        });
        break;
    }
  };

  // Defines the columns used in the table.
  const columns: GridColDef[] = [
    {
      field: 'FirstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 125,
    },
    {
      field: 'LastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 125,
    },
    {
      field: 'Status',
      headerName: 'Status',
      renderCell: (params) => {
        if (!params.value) return <></>;
        return (
          <Chip
            sx={{
              width: '6rem',
              color: theme.palette[colorMap[params.value]]['main'],
              backgroundColor: theme.palette[colorMap[params.value]]['light'],
            }}
            label={params.value}
          />
        );
      },
      maxWidth: 100,
    },
    {
      field: 'Email',
      headerName: 'Email Address',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'Username',
      headerName: 'IDIR/BCeID',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      minWidth: 125,
      flex: 1,
    },
    {
      field: 'Position',
      headerName: 'Position',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'Role',
      headerName: 'Role',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'CreatedOn',
      headerName: 'Created',
      minWidth: 120,
      valueFormatter: dateFormatter,
      type: 'date',
    },
    {
      field: 'LastLogin',
      headerName: 'Last Login',
      minWidth: 120,
      valueFormatter: dateFormatter,
      type: 'date',
    },
  ];

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Paper
        sx={
          {
            width: '95vw',
            padding: '2rem',
            borderRadius: '32px',
            height: 'fit-content',
          } as SxProps
        }
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1em',
          }}
        >
          <Box display={'flex'}>
            <Typography variant="h4" alignSelf={'center'} marginRight={'1em'}>
              Users Overview ({rowCount ?? 0} users)
            </Typography>
            {keywordSearchContents || gridFilterItems.length > 0 ? (
              <Tooltip title="Clear Filter">
                <IconButton
                  onClick={() => {
                    // Set both DataGrid and Keyword search back to blanks
                    tableApiRef.current.setFilterModel({ items: [] });
                    setKeywordSearchContents('');
                    // Set select field back to default
                    setSelectValue('All Users');
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
                    tableName: 'UsersTable',
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
                selectPresetFilter(e.target.value);
                setSelectValue(e.target.value);
              }}
              sx={{ width: '10em', marginLeft: '0.5em' }}
              value={selectValue}
            >
              <CustomMenuItem value={'All Users'}>All Users</CustomMenuItem>
              <CustomListSubheader>Status</CustomListSubheader>
              <CustomMenuItem value={'Active'}>Active</CustomMenuItem>
              <CustomMenuItem value={'Pending'}>Pending</CustomMenuItem>
              <CustomMenuItem value={'Hold'}>Hold</CustomMenuItem>

              <CustomListSubheader>Role</CustomListSubheader>
              <CustomMenuItem value={'User'}>User</CustomMenuItem>
              <CustomMenuItem value={'Admin'}>System Admin</CustomMenuItem>
            </Select>
          </Box>
        </Box>
        <CustomDataGrid
          getRowId={(row) => row.Id}
          columns={columns}
          rows={users}
          loading={isLoading}
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
          }}
          slots={{ toolbar: KeywordSearch }}
        />
      </Paper>
    </Box>
  );
};

export default UsersTable;
