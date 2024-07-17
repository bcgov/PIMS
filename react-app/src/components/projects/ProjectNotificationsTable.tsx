import { dateFormatter } from '@/utilities/formatters';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

export interface INotificationModel {
  id: string;
  agency: string;
  status: string;
  sendOn: Date;
  to: string;
  subject: string;
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

  useEffect(() => {
    fetchData();
  }, [paginationModel.page, paginationModel.pageSize]);

  const fetchData = async () => {
    // alert('test here' + (paginationModel.page + 1));
    // const response = await axios.post('/api/project/notifications', {
    //   pageNumber: paginationModel.page + 1,
    //   pageSize: paginationModel.pageSize,
    // });
    // setRows(response.data.items);
  };

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
    },
    {
      field: 'agency',
      headerName: 'Agency',
      flex: 1,
    },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'sendOn',
      headerName: 'Date Sent / To Be Sent',
      flex: 1,
      valueGetter: (value) => (value == null ? null : new Date(value)),
      renderCell: (params) => (params.value ? dateFormatter(params.value) : ''),
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
      <Typography variant="h5">
        {props.noteText
          ? props.noteText
          : 'The notifications of "pending" status may not reflect the actual status, click on "View Updated Notifications" in order to get an updated status of all notifications.'}
      </Typography>
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
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        onPaginationModelChange={handlePaginationChange}
      />
    </>
  );
};

export default ProjectNotificationsTable;
