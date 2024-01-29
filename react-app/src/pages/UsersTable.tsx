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
} from '@mui/material';
import { GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import KeywordSearch from '@/components/table/KeywordSearch';
import { IUser } from '@/interfaces/IUser';

const UsersTable = () => {
  // States and contexts
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [keywordSearchContents, setKeywordSearchContents] = useState<string>('');
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

  // Defines the columns used in the table.
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
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
                  }}
                >
                  <FilterAltOffIcon />
                </IconButton>
              ) : (
                <></>
              )}
            </Box>
            <KeywordSearch
              onChange={updateSearchValue}
              optionalExternalState={[keywordSearchContents, setKeywordSearchContents]}
            />
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
