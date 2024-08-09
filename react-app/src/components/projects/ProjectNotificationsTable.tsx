import { NotificationStatus } from '@/constants/chesNotificationStatus';
import { NotificationType } from '@/constants/notificationTypes';
import { NotificationQueue } from '@/hooks/api/useProjectNotificationApi';
import { dateFormatter } from '@/utilities/formatters';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface ProjectNotificationsTableProps {
  rows: NotificationQueue[];
  noteText?: string;
  onResendClick?: (id: number) => void;
  onCancelClick?: (id: number) => void;
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
      field: 'To',
      headerName: 'To',
      flex: 1,
      maxWidth: 300,
    },
    {
      field: 'AgencyName',
      headerName: 'Agency',
      flex: 1,
      maxWidth: 350,
    },
    {
      field: 'Subject',
      headerName: 'Subject',
      flex: 1,
    },
    {
      field: 'ChesStatusName',
      headerName: 'Status',
    },
    {
      field: 'SendOn',
      headerName: 'Send Date',
      width: 125,
      valueGetter: (value) => (value == null ? null : new Date(value)),
      renderCell: (params) => (params.value ? dateFormatter(params.value) : ''),
    },
    {
      field: 'Resend',
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Button onClick={() => props.onResendClick(params.row.Id)} color="primary">
            Resend
          </Button>
        </div>
      ),
    },
    {
      field: 'Cancel',
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Button
            disabled={
              params.row.Status !== NotificationStatus.Pending &&
              params.row.Status !== NotificationStatus.Accepted
            }
            onClick={() => props.onCancelClick(params.row.Id)}
            color="primary"
          >
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  if (!props.rows) return <></>;

  // Prepare values for Enhanced Referral Notification fields
  const initalERN = props.rows.find(
    (row) => row.TemplateId === NotificationType.NEW_PROPERTIES_ON_ERP,
  );
  const thirtyDayERN = props.rows.find(
    (row) => row.TemplateId === NotificationType.THIRTY_DAY_ERP_NOTIFICATION_OWNING_AGENCY,
  );
  const sixtyDayERN = props.rows.find(
    (row) => row.TemplateId === NotificationType.SIXTY_DAY_ERP_NOTIFICATION_OWNING_AGENCY,
  );
  const nintyDayERN = props.rows.find(
    (row) => row.TemplateId === NotificationType.NINTY_DAY_ERP_NOTIFICATION_OWNING_AGENCY,
  );

  const allErnNotificatonsFound = [initalERN, thirtyDayERN, sixtyDayERN, nintyDayERN].every(
    (notification) => notification != undefined,
  );

  return !props.rows ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No notifications were sent.</Typography>
    </Box>
  ) : (
    <>
      {allErnNotificatonsFound ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="h6">Enhanced Referral Notification Dates</Typography>
          <Box
            gap={1}
            display={'inline-flex'}
            mb={3}
            mt={2}
            sx={{
              '& .MuiInputBase-root.Mui-disabled': {
                '& > fieldset': {
                  borderColor: 'rgba(0,0,0)',
                },
              },
              '& .MuiFormLabel-root.MuiInputLabel-root': {
                color: 'rgba(0, 0, 0)',
              },
              '& .MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled': {
                color: 'rgba(0,0,0)',
                WebkitTextFillColor: 'rgba(0,0,0)',
              },
            }}
          >
            <DateField
              disabled={true}
              value={initalERN ? dayjs(initalERN.SendOn) : undefined}
              label={'Initial Send Date'}
              format={'LL'}
            />
            <DateField
              disabled={true}
              value={thirtyDayERN ? dayjs(thirtyDayERN.SendOn) : undefined}
              label={'30-day Send Date'}
              format={'LL'}
            />
            <DateField
              disabled={true}
              value={sixtyDayERN ? dayjs(sixtyDayERN.SendOn) : undefined}
              label={'60-day Send Date'}
              format={'LL'}
            />
            <DateField
              disabled={true}
              value={nintyDayERN ? dayjs(nintyDayERN.SendOn) : undefined}
              label={'90-day Send Date'}
              format={'LL'}
            />
          </Box>
        </LocalizationProvider>
      ) : (
        <></>
      )}

      <Typography variant="h6">Total Notifications: {props.rows.length}</Typography>
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
        getRowId={(row) => row.Id}
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
