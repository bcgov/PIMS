import BaseLayout from '@/components/layout/BaseLayout';
import { CustomDataGrid } from '@/components/table/DataTable';
import {
  Box,
  Chip,
  InputAdornment,
  Paper,
  SxProps,
  TextField,
  Typography,
  debounce,
  useTheme,
} from '@mui/material';
import { GridColDef, useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

// interface IAgency {
//   createdOn: string;
//   updatedOn: string;
//   updatedByName: string;
//   updatedByEmail: string;
//   id: number;
//   name: string;
//   isDisabled: true;
//   isVisible: true;
//   sortOrder: number;
//   type: string;
//   code: string;
//   parentId: number;
//   description: string;
// }

// interface IRole {
//   createdOn: string;
//   updatedOn: string;
//   updatedByName: string;
//   updatedByEmail: string;
//   id: UUID;
//   name: string;
//   isDisabled: true;
//   isVisible: true;
//   sortOrder: 0;
//   type: string;
//   description: string;
//   keycloakGroupId: UUID;
//   isPublic: true;
// }

interface IUser {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: UUID;
  keycloakid: UUID;
  username: string;
  position: string;
  displayName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  isDisabled: true;
  emailVerified: true;
  note: string;
  lastLogin: string;
  agency: string;
  roles: string;
}

const KeywordSearch = ({onChange}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [fieldContents, setFieldContents] = useState<string>();
  const theme = useTheme();

  const commonStyle: SxProps = {
    fontSize: theme.typography.fontWeightBold,
    fontFamily: theme.typography.fontFamily,
    padding: '5px',
    marginBottom: '1px',
    boxSizing: 'content-box',
    borderRadius: '5px',
  };

  const openStyle: SxProps = {
    ...commonStyle,
    width: '240px',
    transition: 'width 0.3s ease-in, border 1s',
    border: '1.5px solid grey',
    '&:focus-within': {
      border: '1.5px solid black',
    },
  };

  const closedStyle: SxProps = {
    ...commonStyle,
    width: '32px',
    transition: 'width 0.3s ease-in, border 1s',
    border: '1.5px solid transparent',
    '&:hover': {
      cursor: 'default',
    },
  };
  return (
    <TextField
      id="keyword-search"
      variant="standard"
      sx={isOpen ? openStyle : closedStyle}
      size="small"
      style={{ fontSize: '5em' }}
      placeholder="Search..."
      value={fieldContents}
      onChange={(e) => {
        setFieldContents(e.target.value);
        onChange(e.target.value);
      }}
      InputProps={{
        disableUnderline: true,
        sx: { cursor: 'default' },
        endAdornment: (
          <InputAdornment position={'end'}>
            {fieldContents ? (
              <CloseIcon
                onClick={() => {
                  // Clear text and filter
                  setFieldContents('');
                  onChange('');
                  document.getElementById('keyword-search').focus();
                }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            ) : (
              <SearchIcon
                onClick={() => {
                  setIsOpen(!isOpen);
                  document.getElementById('keyword-search').focus();
                }}
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

const UsersTable = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const { getAuthorizationHeaderValue, state } = useKeycloak();
  const theme = useTheme();
  const apiRef = useGridApiRef();

  useEffect(() => {
    fetch('http://localhost:5000/api/v2/admin/users', {
      headers: {
        Authorization: getAuthorizationHeaderValue(),
      },
    })
      .then(async (response) => {
        const result: IUser[] = await response.json();
        setUsers(result);
      })
      .catch((e: unknown) => {
        console.log(e);
      });
  }, [state]);

  const colorMap = {
    Pending: 'info',
    Active: 'success',
    Hold: 'warning',
  };

  const updateSearchValue = React.useMemo(() => {
    return debounce((newValue) => {
      apiRef.current.setQuickFilterValues(newValue.split(' ').filter((word) => word !== ''));
    }, 100);
  }, [apiRef]);

  

  const dateFormatter = (params) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(params.value));

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
        <Paper sx={{ width: '95vw', padding: '2rem', borderRadius: '32px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1em',
            }}
          >
            <Typography variant="h4">Users Overview ({rowCount ?? 0} users)</Typography>
            <KeywordSearch onChange={updateSearchValue} />
          </Box>
          <CustomDataGrid
            getRowId={(row) => row.id}
            columns={columns}
            rows={users}
            onStateChange={(e) => {
              setRowCount(Object.values(e.filter.filteredRowsLookup).filter(
                (value) => value,
              ).length)
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
