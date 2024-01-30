import BaseLayout from '@/components/layout/BaseLayout';
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
} from '@mui/material';
import { GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import KeywordSearch from '@/components/table/KeywordSearch';
import { IUser } from '@/interfaces/IUser';

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
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('all');
  const [gridFilterItems, setGridFilterItems] = useState([]);
  const { getAuthorizationHeaderValue, state } = useKeycloak();
  const theme = useTheme();
  const apiRef = useGridApiRef();

  useEffect(() => {
    if (state.accessToken) {
      // FIXME: This should be using the proxy...
      fetch('http://localhost:5000/api/v2/admin/users', {
        headers: {
          Authorization: getAuthorizationHeaderValue(),
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const result: IUser[] = await response.json();
            setUsers(result);
          }
        })
        .catch((e: unknown) => {
          console.warn(e);
        });
    }
  }, [state]);

  // Determines colours of chips
  const colorMap = {
    Pending: 'info',
    Active: 'success',
    Hold: 'warning',
  };

  // Sets quickfilter value of DataGrid. newValue is a string input.
  const updateSearchValue = React.useMemo(() => {
    return debounce((newValue) => {
      apiRef.current.setQuickFilterValues(newValue.split(' ').filter((word) => word !== ''));
    }, 100);
  }, [apiRef]);

  // Converts dates to the MMM DD, YYYY locale
  const dateFormatter = (params) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(params.value));

  // Sets the preset filter based on the select input
  const selectPresetFilter = (value: string) => {
    // Clear the quick search contents
    setKeywordSearchContents('');
    switch (value) {
      case 'all':
        apiRef.current.setFilterModel({ items: [] });
        break;
      // All Status filters
      case 'active':
      case 'pending':
      case 'hold':
        apiRef.current.setFilterModel({
          items: [
            {
              value,
              operator: 'contains',
              field: 'status',
            },
          ],
        });
        break;
      // All Role filters
      case 'user':
      case 'admin':
        apiRef.current.setFilterModel({
          items: [
            {
              value,
              operator: 'contains',
              field: 'role',
            },
          ],
        });
        break;
    }
  };

  // Defines the columns used in the table.
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 125,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 125,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (params) => {
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
      field: 'email',
      headerName: 'Email Address',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'IDIR/BCeID',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'agency',
      headerName: 'Agency',
      minWidth: 125,
      flex: 1,
    },
    {
      field: 'position',
      headerName: 'Position',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'created',
      headerName: 'Created',
      minWidth: 120,
      valueFormatter: dateFormatter,
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      minWidth: 120,
      valueFormatter: dateFormatter,
    },
  ];

  return (
    <BaseLayout>
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
                <IconButton
                  onClick={() => {
                    // Set both DataGrid and Keyword search back to blanks
                    apiRef.current.setFilterModel({ items: [] });
                    setKeywordSearchContents('');
                    // Set select field back to default
                    setSelectValue('all');
                  }}
                >
                  <FilterAltOffIcon />
                </IconButton>
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
                  margin: '0 5px',
                },
              }}
            >
              <KeywordSearch
                onChange={updateSearchValue}
                optionalExternalState={[keywordSearchContents, setKeywordSearchContents]}
              />
              <Select
                onChange={(e) => {
                  selectPresetFilter(e.target.value);
                  setSelectValue(e.target.value);
                }}
                defaultValue={'all'}
                sx={{ width: '10em' }}
                value={selectValue}
              >
                <CustomMenuItem value={'all'}>All Users</CustomMenuItem>
                <CustomListSubheader>Status</CustomListSubheader>
                <CustomMenuItem value={'active'}>Active</CustomMenuItem>
                <CustomMenuItem value={'pending'}>Pending</CustomMenuItem>
                <CustomMenuItem value={'hold'}>Hold</CustomMenuItem>

                <CustomListSubheader>Role</CustomListSubheader>
                <CustomMenuItem value={'user'}>User</CustomMenuItem>
                <CustomMenuItem value={'admin'}>System Admin</CustomMenuItem>
              </Select>
            </Box>
          </Box>
          <CustomDataGrid
            getRowId={(row) => row.id}
            columns={columns}
            rows={users}
            onStateChange={(e) => {
              // Keep track of row count separately
              setRowCount(
                Object.values(e.filter.filteredRowsLookup).filter((value) => value).length,
              );
            }}
            onFilterModelChange={(e) => {
              // Get the filter items from MUI, filter out blanks, set state
              setGridFilterItems(e.items.filter((item) => item.value));
            }}
            apiRef={apiRef}
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
    </BaseLayout>
  );
};

export default UsersTable;
