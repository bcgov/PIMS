import { dateFormatter } from '@/utilities/formatters';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';

export interface INotificationModel {
  id: number;
  agency: string;
  status: string;
  sendOn: Date;
  to: string;
  subject: string;
}

export interface INotification {
  Id: number;
  ToAgencyId: number;
  Status: number;
  SendOn: Date;
  To: string;
  Subject: string;
}

export interface INotificationResponse {
  items: INotification[];
  pageNumber: number;
  pageSize: number;
}

interface ProjectNotificationsTableProps {
  rows: INotificationModel[];
  noteText?: string;
}

const ProjectNotificationsTable = (props: ProjectNotificationsTableProps) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const handlePaginationChange = (newModel: any) => {
    setPaginationModel({
      page: newModel.page,
      pageSize: newModel.pageSize,
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'to',
      headerName: 'To',
      flex: 1,
      maxWidth: 300,
    },
    {
      field: 'agency',
      headerName: 'Agency',
      flex: 1,
      maxWidth: 350,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
    },
    {
      field: 'sendOn',
      headerName: 'Send Date',
      width: 125,
      valueGetter: (value) => (value == null ? null : new Date(value)),
      renderCell: (params) => (params.value ? dateFormatter(params.value) : ''),
    },
  ];

  if (!props.rows) return <></>;

  // Prepare values for Enhanced Referral Notification fields
  const initalERN = props.rows.find(
    (row) => row.subject === 'ACTION REQUIRED - Notification of Surplus Real Property',
  );
  const thirtyDayERN = props.rows.find(
    (row) =>
      row.subject ===
      'Notification of Surplus Real Property - 30 Day Reminder Notification of Surplus Real Property',
  );
  const sixtyDayERN = props.rows.find(
    (row) =>
      row.subject ===
      'Notification of Surplus Real Property - 60 Day Reminder Notification of Surplus Real Property',
  );
  const nintyDayERN = props.rows.find(
    (row) =>
      row.subject ===
      'Notification of Surplus Real Property - Completion of 90 Day Enhanced Referral Period for Notification of Surplus Real Property',
  );

  return !props.rows ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No notifications were sent.</Typography>
    </Box>
  ) : (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h6">Enhanced Referral Notification Dates</Typography>
        <Box gap={1} display={'inline-flex'} mb={3} mt={2}>
          <DateField
            disabled={true}
            value={initalERN ? dayjs(initalERN.sendOn) : undefined}
            label={'Initial Send Date'}
            format={'LL'}
          />
          <DateField
            disabled={true}
            value={thirtyDayERN ? dayjs(thirtyDayERN.sendOn) : undefined}
            label={'30-day Send Date'}
            format={'LL'}
          />
          <DateField
            disabled={true}
            value={sixtyDayERN ? dayjs(sixtyDayERN.sendOn) : undefined}
            label={'60-day Send Date'}
            format={'LL'}
          />
          <DateField
            disabled={true}
            value={nintyDayERN ? dayjs(nintyDayERN.sendOn) : undefined}
            label={'90-day Send Date'}
            format={'LL'}
          />
        </Box>
      </LocalizationProvider>

      <Typography variant="h6">Total Notifications: {props.rows.length}</Typography>
      <Box marginBottom={2} />
      <DataGrid
        sx={{
          borderStyle: 'none',
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: 'none',
          },
          '& div div div div >.MuiDataGrid-cell': {
            borderBottom: 'none',
            borderTop: '1px solid rgba(224, 224, 224, 1)',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
        }}
        disableRowSelectionOnClick
        columns={columns}
        rows={props.rows}
        pagination={true}
        pageSizeOptions={[10]}
        paginationModel={paginationModel}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'sendOn', sort: 'asc' }] },
        }}
        onPaginationModelChange={handlePaginationChange}
      />
    </>
  );
};

export default ProjectNotificationsTable;
