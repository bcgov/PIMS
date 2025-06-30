import React, { useContext, useMemo } from 'react';
import { FilterSearchDataGrid } from '@/components/table/DataTable';
import { Box, SxProps, useTheme, ListSubheader, MenuItem } from '@mui/material';
import { GridColDef, GridComparatorFn, GridEventListener } from '@mui/x-data-grid';
import { MutableRefObject, PropsWithChildren, useEffect, useState } from 'react';
import { useSSO } from '@bcgov/citz-imb-sso-react';
import { IUser } from '@/interfaces/IUser';
import { dateFormatter, statusChipFormatter } from '@/utilities/formatters';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { Agency } from '@/hooks/api/useAgencyApi';
import { User } from '@/hooks/api/useUsersApi';
import { LookupContext } from '@/contexts/lookupContext';
import { Role } from '@/constants/roles';
import { getProvider, makeDateOrUndefined } from '@/utilities/helperFunctions';

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

const statusComparitor: GridComparatorFn = (v1, v2) => {
  const statusOrder = ['OnHold', 'Active', 'Disabled', 'Denied'];
  const indx1 = statusOrder.indexOf(v1);
  const indx2 = statusOrder.indexOf(v2);
  if (indx1 < 0 || indx2 < 0) return 0;
  else return indx2 - indx1;
};

const UsersTable = (props: IUsersTable) => {
  // States and contexts
  const { refreshData, data, error, isLoading, rowClickHandler } = props;
  const [users, setUsers] = useState([]);
  const { state } = useSSO();
  const lookup = useContext(LookupContext);

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

  const agenciesForSingleSelect = useMemo(() => {
    if (lookup.data) {
      return lookup.data.Agencies.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup]);

  const rolesForSingleSelect = useMemo(() => {
    if (lookup.data) {
      return lookup.data.Roles.map((a) => a.Name);
    } else {
      return [];
    }
  }, [lookup.data]);

  // Sets the preset filter based on the select input
  const selectPresetFilter = (value: string, ref: MutableRefObject<GridApiCommunity>) => {
    // Clear the quick search contents

    switch (value) {
      case 'All Users':
        ref.current.setFilterModel({ items: [] });
        break;
      // All Status filters
      case 'Active':
      case 'OnHold':
      case 'Disabled':
      case 'Denied':
        ref.current.setFilterModel({
          items: [
            {
              value,
              operator: 'is',
              field: 'Status',
            },
          ],
        });
        break;
      // All Role filters
      case 'General User':
      case 'Administrator':
      case 'Auditor':
      case 'No Role':
        ref.current.setFilterModel({
          items: [
            {
              value,
              operator: 'is',
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
      type: 'singleSelect',
      valueOptions: ['Active', 'Denied', 'OnHold', 'Disabled'],
      renderCell: (params) => {
        if (!params.value) return <></>;
        return statusChipFormatter(params.value);
      },
      sortComparator: statusComparitor,
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
      valueGetter: (value) => getProvider(value, lookup?.data?.Config.bcscIdentifier),
    },
    {
      field: 'Agency',
      headerName: 'Agency',
      minWidth: 125,
      flex: 1,
      type: 'singleSelect',
      valueOptions: agenciesForSingleSelect,
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
      type: 'singleSelect',
      valueOptions: [...rolesForSingleSelect, 'No Role'],
    },
    {
      field: 'CreatedOn',
      headerName: 'Created On',
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

  const excelDataMap = (data: User[]) => {
    return data.map((user) => {
      return {
        Username: user.Username,
        'First Name': user.FirstName,
        'Last Name': user.LastName,
        Email: user.Email,
        Status: user.Status,
        Agency: user.Agency?.Name,
        'Last Login': makeDateOrUndefined(user.LastLogin),
        Role: user.Role?.Name,
        'Created On': makeDateOrUndefined(user.CreatedOn),
        Position: user.Position,
      };
    });
  };

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
      <Box sx={{ height: 'calc(100vh - 180px)' }}>
        <FilterSearchDataGrid
          name="users"
          onRowClick={rowClickHandler}
          tableOperationMode="client"
          defaultFilter="All Users"
          tableHeader="Users Overview"
          excelTitle="Users Table"
          customExcelMap={excelDataMap}
          addTooltip="Adding a new user from this table is not supported yet. Please advise users to use the access request form."
          getRowId={(row) => row.Id}
          rowCountProp={users.length}
          columns={columns}
          rows={users}
          loading={isLoading}
          onPresetFilterChange={selectPresetFilter}
          presetFilterSelectOptions={[
            <CustomMenuItem key={'All Users'} value={'All Users'}>
              All Users
            </CustomMenuItem>,
            <CustomListSubheader key={'Status'}>Status</CustomListSubheader>,
            <CustomMenuItem key={'Active'} value={'Active'}>
              Active
            </CustomMenuItem>,
            <CustomMenuItem key={'On Hold'} value={'OnHold'}>
              On Hold
            </CustomMenuItem>,
            <CustomMenuItem key={'Disabled'} value={'Disabled'}>
              Disabled
            </CustomMenuItem>,
            <CustomMenuItem key={'Denied'} value={'Denied'}>
              Denied
            </CustomMenuItem>,
            <CustomListSubheader key={'Role'}>Role</CustomListSubheader>,
            <CustomMenuItem key={'General User'} value={'General User'}>
              General User
            </CustomMenuItem>,
            <CustomMenuItem key={'Administrator'} value={'Administrator'}>
              Administrator
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
    </Box>
  );
};

export default UsersTable;
