import BaseLayout from '@/components/layout/BaseLayout';
import { CustomDataGrid } from '@/components/table/DataTable';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';

interface IAgency {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: number;
  name: string;
  isDisabled: true;
  isVisible: true;
  sortOrder: number;
  type: string;
  code: string;
  parentId: number;
  description: string;
}

interface IRole {
  createdOn: string;
  updatedOn: string;
  updatedByName: string;
  updatedByEmail: string;
  id: UUID;
  name: string;
  isDisabled: true;
  isVisible: true;
  sortOrder: 0;
  type: string;
  description: string;
  keycloakGroupId: UUID;
  isPublic: true;
}

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
  agencies: IAgency[];
  roles: IRole[];
}

const UsersTable = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { getAuthorizationHeaderValue, state } = useKeycloak();

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
    Pending: 'warning',
    Active: 'success',
    Hold: 'error',
  };
  const rows = [
    {
      id: 0,
      firstName: 'Graham',
      lastName: 'Stewart',
      Status: 'Active',
      created: '2023-04-02',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      Status: 'Pending',
      created: '2023-04-02',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 2,
      firstName: 'Alice',
      lastName: 'Johnson',
      Status: 'Hold',
      created: '2023-02-03',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Anderson',
      Status: 'Active',
      created: '2023-04-03',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 4,
      firstName: 'Emma',
      lastName: 'White',
      Status: 'Pending',
      created: '2023-06-04',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Taylor',
      Status: 'Hold',
      created: '2023-04-04',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 6,
      firstName: 'Sophie',
      lastName: 'Brown',
      Status: 'Active',
      created: '2023-04-05',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 7,
      firstName: 'Michael',
      lastName: 'Jones',
      Status: 'Pending',
      created: '2023-04-05',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 8,
      firstName: 'Olivia',
      lastName: 'Wilson',
      Status: 'Active',
      created: '2023-04-06',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 9,
      firstName: 'Daniel',
      lastName: 'Miller',
      Status: 'Hold',
      created: '2023-04-06',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
    {
      id: 10,
      firstName: 'Cotton-Eye',
      lastName: 'Joe',
      Status: 'Hold',
      created: '2023-04-06',
      username: 'username@idir',
      email: 'email@gmail.com',
      agency: 'CITZ',
      position: 'Captain',
      role: 'Admin',
      lastLogin: '2024-02-06',
    },
  ];
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
    },
    {
      field: 'Status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        return <Chip sx={{ width: '6rem' }} label={params.value} color={colorMap[params.value]} />;
      },
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'IDIR/BCeID',
      flex: 1,
    },
    {
      field: 'agency',
      headerName: 'Agencies',
      flex: 1,
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      maxWidth: 150,
    },
    {
      field: 'created',
      headerName: 'Created On',
      flex: 1,
      maxWidth: 120,
    },
    {
      field: 'lastLogin',
      headerName: 'Last Login',
      flex: 1,
      maxWidth: 120,
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
            <Typography variant="h4">Users Overview ({rows.length} users)</Typography>
          </Box>
          <CustomDataGrid
            getRowId={(row) => row.id}
            columns={columns}
            rows={rows}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: {
                sortModel: [{ field: 'created', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 20, 30, 100]} // DataGrid max is 100
          />
        </Paper>
      </Box>
    </BaseLayout>
  );
};

export default UsersTable;
