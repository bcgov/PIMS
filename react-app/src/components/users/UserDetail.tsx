import React, { useState } from 'react';
import DataCard from '../display/DataCard';
import { Avatar, Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import { statusChipFormatter } from '@/utils/formatters';
import DeleteDialog from '../dialog/DeleteDialog';
import { deleteAccountConfirmText } from '@/constants/strings';

const UserDetail = () => {
  const theme = useTheme();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  interface User {
    Status: string;
  } //Placeholder type.

  //Backend hooks etc would go here.
  const userStatusData = {
    Status: 'Active',
    Role: 'System Admin',
    Created: new Date(),
    LastLogin: new Date(),
  };
  const userProfileData = {
    DisplayName: 'GSTEWART@idir',
    Email: 'graham.stewart@gov.bc.ca',
    FirstName: 'Graham',
    LastName: 'Stewart',
    Agency: 'BC Housing',
    Position: 'Senior Director',
  };
  const customFormatter = (key: keyof User, val: any) => {
    if (key === 'Status') {
      return statusChipFormatter(val);
    }
  };

  return (
    <Box display={'flex'} gap={'1rem'} mt={'2rem'} flexDirection={'column'}>
      <Box display={'flex'} alignItems={'center'}>
        <IconButton onClick={() => {}}>
          <Avatar
            style={{ color: 'white', backgroundColor: 'white' }} //For some reason this doesn't get applied if you do it in sx props.
            sx={{ border: '0.1px solid lightgray' }}
          >
            <Icon color="black" size={0.9} path={mdiArrowLeft} />
          </Avatar>
        </IconButton>
        <Typography variant="h5">Back to User Overview</Typography>
        <Button
          onClick={() => setOpenDeleteDialog(true)}
          sx={{ fontWeight: 'bold', color: theme.palette.warning.main, marginLeft: 'auto' }}
        >
          Delete Account
        </Button>
      </Box>
      <DataCard customFormatter={customFormatter} values={userStatusData} title={'User Status'} />
      <DataCard values={userProfileData} title={'User Profile'} />
      <DeleteDialog
        open={openDeleteDialog}
        title={'Delete account'}
        message={deleteAccountConfirmText}
        deleteText="Delete Account"
        onDelete={function (): void {
          throw new Error('Function not implemented.');
        }}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </Box>
  );
};

export default UserDetail;
