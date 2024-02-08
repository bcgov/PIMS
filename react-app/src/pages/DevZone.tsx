/* eslint-disable no-console */
//Simple component testing area.
import React, { useEffect, useState } from 'react';
import { CustomDataGrid, DataGridFloatingMenu } from '@/components/table/DataTable';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { mdiCheckCircle, mdiCloseThick } from '@mdi/js';
import UserDetail from '@/components/users/UserDetail';
import BaseLayout from '@/components/layout/BaseLayout';
import useDataLoader from '@/hooks/useDataLoader';
import usePimsApi from '@/hooks/usePimsApi';

const Dev = () => {
  const { users } = usePimsApi();
  const {
    data: realData,
    refreshData: refreshRealData,
    isLoading: realDataLoading,
  } = useDataLoader(users.getLatestAccessRequest, () => {});

  const {
    data: fakeData,
    refreshData: refreshFakeData,
    isLoading: fakeDataLoading,
  } = useDataLoader(
    async () => rows,
    () => {},
  );

  const rows = [
    { UserId: 0, FirstName: 'Graham', LastName: 'Stewart', Status: 'Active', Date: '2023-04-02' },
    { UserId: 1, FirstName: 'John', LastName: 'Smith', Status: 'Pending', Date: '2023-04-02' },
    { UserId: 2, FirstName: 'Alice', LastName: 'Johnson', Status: 'Hold', Date: '2023-04-03' },
    { UserId: 3, FirstName: 'Bob', LastName: 'Anderson', Status: 'Active', Date: '2023-04-03' },
    { UserId: 4, FirstName: 'Emma', LastName: 'White', Status: 'Pending', Date: '2023-04-04' },
    { UserId: 5, FirstName: 'David', LastName: 'Taylor', Status: 'Hold', Date: '2023-04-04' },
    { UserId: 6, FirstName: 'Sophie', LastName: 'Brown', Status: 'Active', Date: '2023-04-05' },
    { UserId: 7, FirstName: 'Michael', LastName: 'Jones', Status: 'Pending', Date: '2023-04-05' },
    { UserId: 8, FirstName: 'Olivia', LastName: 'Wilson', Status: 'Active', Date: '2023-04-06' },
    { UserId: 9, FirstName: 'Daniel', LastName: 'Miller', Status: 'Hold', Date: '2023-04-06' },
  ];

  const [dataRows, setDataRows] = useState([]);
  useEffect(() => {
    if (fakeData) {
      setDataRows(fakeData);
    }
  }, [fakeData]);

  useEffect(() => {
    if (!realData) {
      refreshRealData();
    }
  }, [realData]);

  const colorMap = {
    Pending: 'warning',
    Active: 'success',
    Hold: 'error',
  };

  const columns: GridColDef[] = [
    {
      field: 'FirstName',
      headerName: 'Given Name',
      flex: 1,
    },
    {
      field: 'LastName',
      headerName: 'Family Name',
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
      field: 'Date',
      headerName: 'Date',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <DataGridFloatingMenu
          cellParams={params}
          menuActions={[
            {
              label: 'Approve',
              iconPath: mdiCheckCircle,
              action: (p) => {
                console.log(`Approve read this row: ${JSON.stringify(p.row)}`);
              },
            },
            {
              label: 'Deny',
              iconPath: mdiCloseThick,
              action: (p) => {
                console.log(`Deny read this row: ${JSON.stringify(p.row)}`);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <BaseLayout>
      <Box display={'flex'} justifyContent={'center'}>
        <UserDetail />
      </Box>

      <Paper sx={{ width: '1080px', padding: '2rem', borderRadius: '32px' }}>
        <CustomDataGrid
          autoHeight={true}
          getRowId={(row) => row.UserId}
          columns={columns}
          rows={dataRows}
          loading={fakeDataLoading}
        />
      </Paper>
    </BaseLayout>
  );
};

export default Dev;
