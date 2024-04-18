import React from 'react';
import { FilterSearchDataGrid } from '@/components/table/DataTable';
import { Box, SxProps, useTheme, ListSubheader, MenuItem } from '@mui/material';
import { GridColDef, GridEventListener } from '@mui/x-data-grid';
import { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { IUser } from '@/interfaces/IUser';
import { dateFormatter, statusChipFormatter } from '@/utilities/formatters';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { Agency } from '@/hooks/api/useAgencyApi';
import { Role } from '@/hooks/api/useRolesApi';

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

interface IUsersTable {
  rowClickHandler: GridEventListener<'rowClick'>;
  data: Record<string, any>;
  isLoading: boolean;
  refreshData: () => void;
  error: unknown;
}

const UsersTable = (props: IUsersTable) => {
  // States and contexts
  const { refreshData, data, error, isLoading, rowClickHandler } = props;
  const [users, setUsers] = useState([]);
  const { state } = useKeycloak();

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

  // Sets the preset filter based on the select input
  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    // Clear the quick search contents

    switch (value) {
      case 'All Users':
        ref.current.setFilterModel({ items: [] });
        break;
      // All Status filters
      case 'Active':
      case 'Pending':
      case 'On Hold':
      case 'Disabled':
        ref.current.setFilterModel({
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
      case 'Auditor':
        ref.current.setFilterModel({
          items: [
            {
              value,
              operator: 'contains',
              field: 'Role',
            },
          ],
        });
        break;
      case 'No Role':
        ref.current.setFilterModel({
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
      maxWidth: 200,
    },
    {
      field: 'LastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 125,
      maxWidth: 200,
    },
    {
      field: 'Status',
      headerName: 'Status',
      renderCell: (params) => {
        if (!params.value) return <></>;
        return statusChipFormatter(params.value);
      },
      width: 150,
    },
    {
      field: 'Email',
      headerName: 'Email Address',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'Username',
      headerName: 'Provider',
      width: 125,
      valueGetter: (value) => {
        const username: string = value;
        if (username && !username.includes('@')) return undefined;
        const provider = username.split('@').at(1);
        switch (provider) {
          case 'idir':
            return 'IDIR';
          default:
            return 'BCeID';
        }
      },
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      minWidth: 125,
      flex: 1,
      valueGetter: (value?: Agency) => value?.Name ?? ``,
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
      minWidth: 150,
      flex: 1,
      valueGetter: (value?: Role) => value?.Name ?? `No Role`,
    },
    {
      field: 'CreatedOn',
      headerName: 'Created',
      minWidth: 120,
      valueFormatter: (value) => dateFormatter(value),
      type: 'date',
    },
    {
      field: 'LastLogin',
      headerName: 'Last Login',
      minWidth: 120,
      valueFormatter: (value) => dateFormatter(value),
      type: 'date',
    },
  ];

  return (
    <Box
      sx={
        {
          padding: '24px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        } as SxProps
      }
    >
      <FilterSearchDataGrid
        name="users"
        onAddButtonClick={() => {}}
        onRowClick={rowClickHandler}
        defaultFilter="All Users"
        tableHeader="Users Overview"
        excelTitle="Users Table"
        addTooltip="Adding a new user from this table is not supported yet. Please advise users to use the access request form."
        getRowId={(row) => row.Id}
        columns={columns}
        rows={users}
        loading={isLoading}
        initialState={{
          sorting: {
            sortModel: [{ field: 'CreatedOn', sort: 'desc' }],
          },
        }}
        onPresetFilterChange={selectPresetFilter}
        presetFilterSelectOptions={[
          <CustomMenuItem key={'All Users'} value={'All Users'}>
            All Users
          </CustomMenuItem>,
          <CustomListSubheader key={'Status'}>Status</CustomListSubheader>,
          <CustomMenuItem key={'Active'} value={'Active'}>
            Active
          </CustomMenuItem>,
          <CustomMenuItem key={'Pending'} value={'Pending'}>
            Pending
          </CustomMenuItem>,
          <CustomMenuItem key={'On Hold'} value={'On Hold'}>
            On Hold
          </CustomMenuItem>,
          <CustomMenuItem key={'Disabled'} value={'Disabled'}>
            Disabled
          </CustomMenuItem>,
          <CustomListSubheader key={'Role'}>Role</CustomListSubheader>,
          <CustomMenuItem key={'User'} value={'User'}>
            General User
          </CustomMenuItem>,
          <CustomMenuItem key={'Admin'} value={'Admin'}>
            System Admin
          </CustomMenuItem>,
          <CustomMenuItem key={'Auditor'} value={'Auditor'}>
            Auditor
          </CustomMenuItem>,
          <CustomMenuItem key={'No Role'} value={'No Role'}>
            No Role
          </CustomMenuItem>,
        ]}
      />
    </Box>
  );
};

export default UsersTable;
