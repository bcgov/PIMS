import React from 'react';
import { FilterSearchDataGrid } from '@/components/table/DataTable';
import { Box, SxProps, useTheme, ListSubheader, MenuItem } from '@mui/material';
import { GridColDef, GridEventListener } from '@mui/x-data-grid';
import { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react';
import { useKeycloak } from '@bcgov/citz-imb-kc-react';
import { IUser } from '@/interfaces/IUser';
import { dateFormatter, statusChipFormatter } from '@/utils/formatters';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

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
      case 'Hold':
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
        return statusChipFormatter(params.value);
      },
      minWidth: 150,
    },
    {
      field: 'Email',
      headerName: 'Email Address',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'DisplayName',
      headerName: 'IDIR/BCeID',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      minWidth: 125,
      flex: 1,
      valueGetter: (params) => params.value?.Name ?? ``,
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
      valueFormatter: (params) => dateFormatter(params.value),
      type: 'date',
    },
    {
      field: 'LastLogin',
      headerName: 'Last Login',
      minWidth: 120,
      valueFormatter: (params) => dateFormatter(params.value),
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
        onRowClick={rowClickHandler}
        defaultFilter="All Users"
        tableHeader="Users Overview"
        excelTitle="Users Table"
        getRowId={(row) => row.Id}
        columns={columns}
        rows={users}
        loading={isLoading}
        onPresetFilterChange={selectPresetFilter}
        presetFilterSelectOptions={[
          <CustomMenuItem key={'AllUsers'} value={'All Users'}>
            All Users
          </CustomMenuItem>,
          <CustomListSubheader key={'Status'}>Status</CustomListSubheader>,
          <CustomMenuItem key={'Active'} value={'Active'}>
            Active
          </CustomMenuItem>,
          <CustomMenuItem key={'Pending'} value={'Pending'}>
            Pending
          </CustomMenuItem>,
          <CustomMenuItem key={'Hold'} value={'Hold'}>
            Hold
          </CustomMenuItem>,
          <CustomListSubheader key={'Role'}>Role</CustomListSubheader>,
          <CustomMenuItem key={'User'} value={'User'}>
            User
          </CustomMenuItem>,
          <CustomMenuItem key={'Admin'} value={'Admin'}>
            System Admin
          </CustomMenuItem>,
        ]}
      />
    </Box>
  );
};

export default UsersTable;
