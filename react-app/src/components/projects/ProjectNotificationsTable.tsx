import { NotificationStatus } from '@/constants/chesNotificationStatus';
import { NotificationQueue } from '@/hooks/api/useProjectNotificationApi';
import { dateFormatter } from '@/utilities/formatters';
import { Refresh, Delete } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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
      maxWidth: 20,
      renderCell: (params) => (
        <Tooltip placement="left" title="Resend Notification">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <IconButton onClick={() => props.onResendClick(params.row.Id)} color="primary">
              <Refresh />
            </IconButton>
          </div>
        </Tooltip>
      ),
    },
    {
      field: 'Cancel',
      headerName: '',
      sortable: false,
      filterable: false,
      maxWidth: 20,
      renderCell: (params) => (
        <Tooltip placement="right" title={'Cancel Notification'}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <IconButton
              disabled={
                params.row.Status !== NotificationStatus.Pending &&
                params.row.Status !== NotificationStatus.Accepted
              }
              onClick={() => props.onCancelClick(params.row.Id)}
              color="primary"
            >
              <Delete />
            </IconButton>
          </div>
        </Tooltip>
      ),
    },
  ];

  if (!props.rows) return <></>;

  return !props.rows ? (
    <Box display={'flex'} justifyContent={'center'}>
      <Typography>No notifications were sent.</Typography>
    </Box>
  ) : (
    <>
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
