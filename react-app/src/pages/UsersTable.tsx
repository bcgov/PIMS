import BaseLayout from '@/components/layout/BaseLayout';
import { CustomDataGrid } from '@/components/table/DataTable';
import { Box, Chip, Paper, Typography, useTheme } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';

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

const UsersTable = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { getAuthorizationHeaderValue, state } = useKeycloak();
  const theme = useTheme();

  useEffect(() => {
    fetch('http://localhost:5000/api/v2/admin/users', {
      headers: {
        Authorization: getAuthorizationHeaderValue(),
      },
    })
      .then(async (response) => {
        setUsers(await response.json());
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
              marginBottom: '1em',
            }}
          >
            <Typography variant="h4">Users Overview ({users.length ?? 0} users)</Typography>
          </Box>
          <CustomDataGrid
            getRowId={(row) => row.id}
            columns={columns}
            rows={users}
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
          />
        </Paper>
      </Box>
    </BaseLayout>
  );
};

export default UsersTable;
